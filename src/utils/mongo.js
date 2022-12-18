import { config } from "dotenv";
import { nanoid } from "nanoid";
import { MongoClient } from "mongodb";
config();

import { ValidateFull, ValidateUpdate } from "./validation.js";

// @ts-ignore -- this is for my extension
if (process.env.MONGO_URI === undefined) {
    console.log("Please set the environment variable MONGO_URI");
    process.exit(1);
}

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("MyDatabase");
const collection = db.collection("tasks");

async function NaNoid() {
    let uuid = nanoid();

    const result = await collection.find({ uuid: uuid }).toArray();

    if (result.length === 0) {
        return uuid;
    } else {
        console.log("UUID : REGENERATING A NEW ONE one");
        await NaNoid();
    }
}

async function MongoConnect() {
    try {
        await client.connect();
        console.log(">>> 200 : MONGO_CONNECT : Connected to mongodb");
    } catch (err) {
        console.error(err);
        console.log(">>> 403 : MONGO_CONNECT : ERROR connecting to mongodb");
    }
}

async function CheckConnection() {
    try {
        const status = await client.db("admin").command({
            ping: 1,
        });
        const Data = `Uptime: ${Math.floor(
            process.uptime()
        )} Seconds | MongoDB: ${status.ok}`;
        console.log(Data);
        return { code: 200, message: Data };
    } catch (err) {
        console.error(err);
        return {
            code: 403,
            message: "CHECK_CONNECTION : 403 : MONGO ERROR",
        };
    }
}

async function CreateNewTask(task) {
    delete task["_id"];
    delete task["uuid"];

    task.uuid = await NaNoid();
    task.createdOn = new Date();

    if (await ValidateFull(task)) {
        try {
            await collection.insertOne(task);
            console.log(">>> 201 : CREATE_NEW_TASK : New Task Created");
            return {
                code: 201,
                message: "201 : CREATE_NEW_TASK : New Task Created",
            };
        } catch (err) {
            console.log(">>> 403 : CREATE_NEW_TASK : Mongo Error");
            console.error(err);
            return {
                code: 403,
                message: "403 : CREATE_NEW_TASK : Mongo Error",
            };
        }
    } else {
        console.log(
            ">>> 400 : CREATE_NEW_TASK : Please Provide Correct Object type"
        );
        return {
            code: 400,
            message:
                ">>> 400 : CREATE_NEW_TASK : Please Provide Correct Object type",
        };
    }
}

async function GetTask(TaskID) {
    try {
        const result = await collection.findOne({
            uuid: TaskID,
        });
        if (!result) {
            console.log(`>>> 404 : GET_TASK : No Task With ID ${TaskID} Found`);
            return {
                code: 404,
                message: `>>> 404 : GET_TASK : No Task With ID ${TaskID} Found`,
            };
        }
        console.log(">>> 302: GET_TASK : Found Task");
        return {
            code: 302,
            message: "302: GET_TASK : Found Task",
            Data: result,
        };
    } catch (err) {
        console.error(err);
        return { code: 403, message: "403 : GET_TASK : Mongo Error" };
    }
}

async function GetAllTasks(email) {
    try {
        const result = await collection
            .find({
                Email: email,
            })
            .toArray();

        if (result.length === 0) {
            console.log(
                `>>> 404 : GET_ALL_TASKS : No Task With ID ${email} Found`
            );
            return {
                code: 404,
                message: `>>> 404 : GET_ALL_TASKS : No Task With ID ${email} Found`,
            };
        }

        console.log(">>> 302: GET_ALL_TASKS : Found Tasks");
        return {
            code: 302,
            message: "302: GET_ALL_TASKS : Found Tasks",
            Data: result,
        };
    } catch (err) {
        console.error(err);
        return { code: 403, message: "403 : GET_ALL_TASKS : Mongo Error" };
    }
}

async function UpdateTask(TaskID, task) {
    task["uuid"] = TaskID;

    if (await ValidateUpdate(task)) {
        try {
            let existingTask = await collection.findOne({ uuid: TaskID });
            if (!existingTask) {
                console.log(
                    `>>> 404 : UPDATE_TASK : No Task With ID ${TaskID} Found`
                );
                return {
                    code: 404,
                    message: `>>> 404 : UPDATE_TASK : No Task With ID ${TaskID} Found`,
                };
            }
            let result = await collection.findOneAndUpdate(
                {
                    uuid: TaskID,
                },
                {
                    $set: task,
                },
                {
                    upsert: false,
                }
            );
            console.log("302 : UPDATE_TASK : Task Updated");
            return {
                code: 200,
                message: "302 : UPDATE_TASK : Task Updated",
            };
        } catch (err) {
            console.error(err);
            return {
                code: 403,
                message: "403 : UPDATE_TASK : Mongo Error",
            };
        }
    } else {
        console.log(
            ">>> 400 : UPDATE_TASK : Please Provide Correct Object type"
        );
        return {
            code: 400,
            message:
                ">>> 400 : UPDATE_TASK : Please Provide Correct Object type",
        };
    }
}

async function DeleteTask(TaskID) {
    try {
        let existingTask = await collection.findOne({ uuid: TaskID });
        if (!existingTask) {
            console.log(
                `>>> 404 : DELETE_TASK : No Task With ID ${TaskID} Found`
            );
            return {
                code: 404,
                message: `>>> 404 : DELETE_TASK : No Task With ID ${TaskID} Found`,
            };
        }
        await collection.deleteOne({
            uuid: TaskID,
        });
        console.log("200 : DELETE_TASK : Task Deleted");
        return {
            code: 200,
            message: "200 : DELETE_TASK : Task Deleted",
        };
    } catch (err) {
        console.error(err);
        return {
            code: 403,
            message: "403 : UPDATE_TASK : Mongo Error",
        };
    }
}

export {
    CheckConnection,
    CreateNewTask,
    DeleteTask,
    UpdateTask,
    GetTask,
    GetAllTasks,
    MongoConnect,
};
