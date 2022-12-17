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
        console.log("UUID already exists, generating a new one");
        await NaNoid();
    }
}

async function MongoConnect() {
    try {
        await client.connect();
        console.log("Mongo : 200 : Connected to mongodb");
    } catch (err) {
        console.log(err);
        console.log("Mongo : 403 : ERROR connecting to mongodb");
    }
}

async function CheckConnection() {
    try {
        const status = await client.db("admin").command({
            ping: 1,
        });
        const Data = `Uptime: ${Math.floor(process.uptime())} Seconds`;
        console.log(status, Data);
        return { code: 200, message: Data };
    } catch (err) {
        console.log(err);
        return {
            code: 403,
            message: "Mongo : 403 : ERROR connecting to mongodb",
        };
    }
}

async function NewTask(task) {
    delete task["_id"];
    delete task["uuid"];

    task.uuid = await NaNoid();
    task.createdOn = new Date();

    if (await ValidateFull(task)) {
        try {
            await collection.insertOne(task);
            console.log("/task/new : 201 : New Task Created");
            return { code: 201, Data: "/task/new : 201 : New Task Created" };
        } catch (err) {
            console.log("/task/new : 403 : Mongo Error");
            console.log(err);
            return { code: 403, message: "/task/new : 403 : Mongo Error" };
        }
    } else {
        console.log("/tasks/new : 400 : Please Provide Correct Object type");
        return {
            code: 400,
            message: "/tasks/new : 400 : Please Provide Correct Object type",
        };
    }
}

async function GetTask(TaskID) {
    try {
        const result = await collection.findOne({
            uuid: TaskID,
        });
        console.log("/tasks/:id : 302 & 200 : Task Found");
        return {
            code: 302,
            message: "/tasks/:id : 302 & 200 : Task Found",
            Data: result,
        };
    } catch (err) {
        console.log("/task/:id : 403 : Mongo Error");
        console.log(err);
        return { code: 403, message: "/task/:id : 403 : Mongo Error" };
    }
}

async function GetAllTasks(email) {
    try {
        const result = await collection
            .find({
                Email: email,
            })
            .toArray();

        console.log("/tasks : 302 & 200 : Tasks Found");
        return {
            code: 302,
            message: "/tasks : 302 & 200 : Tasks Found",
            Data: result,
        };
    } catch (err) {
        console.log("Mongo : 403");
        console.log(err);
        return { code: 403, message: "/tasks/ : 403 : Mongo Error" };
    }
}

async function UpdateTask(id, task) {
    task["uuid"] = id;

    if (await ValidateUpdate(task)) {
        try {
            await collection.findOneAndUpdate(
                {
                    uuid: id,
                },
                {
                    $set: task,
                }
            );
            console.log("/task/:id : 302 & 200 : Task Updated");
            return {
                code: 200,
                message: "/task/:id : 302 & 200 : Task Updated",
            };
        } catch (err) {
            console.log("/task/:id : 403 : Mongo Error");
            console.log(err);
            return { code: 403, message: "/task/:id : 403 : Mongo Error" };
        }
    } else {
        console.log("/tasks/:id : 400 : Please Provide Correct Object type");
        return {
            code: 400,
            message: "/tasks/:id : 400 : Please Provide Correct Object type",
        };
    }
}

async function DeleteTask(TaskID) {
    try {
        await collection.deleteOne({
            uuid: TaskID,
        });
        console.log("/tasks/:id : 302 & 200 : Task Deleted");
        return {
            code: 200,
            message: "/tasks/:id : 302 & 200 : Task Deleted",
        };
    } catch (err) {
        console.log("/task/:id : 403 : Mongo Error");
        console.log(err);
        return { code: 403, message: "/task/:id : 403 : Mongo Error" };
    }
}

export {
    CheckConnection,
    NewTask,
    DeleteTask,
    UpdateTask,
    GetTask,
    GetAllTasks,
    MongoConnect,
};
