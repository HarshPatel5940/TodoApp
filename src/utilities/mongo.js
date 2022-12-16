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
        console.log("Mongo : 200 : initial connection done.");
    } catch (err) {
        console.log(err);
        console.log("Mongo : 403 : ERROR connecting to mongodb");
    }
}

async function CheckConnection() {
    try {
        const status1 = await client.db("admin").command({
            ping: 1,
        });
        const Data = `Uptime: ${Math.floor(process.uptime())} Seconds`;
        console.log(status1, Data);
        return { code: 200, message: Data };
    } catch (err) {
        console.log(err);
        return { code: 403 };
    }
}

async function NewTask(Document1) {
    delete Document1["_id"];
    delete Document1["uuid"];

    Document1.uuid = await NaNoid();
    Document1.createdOn = new Date();

    if (await ValidateFull(Document1)) {
        try {
            await collection.insertOne(Document1);
            console.log("/task/new : 201 : Document Inserted");
            return { code: 201, Data: "/task/new : 201 : Document Inserted" };
        } catch (err) {
            console.log("Mongo : 403");
            console.log(err);
            return { code: 403 };
        }
    } else {
        console.log("/tasks/new : 400 : Please Provide Correct Object type");
        return { code: 400 };
    }
}

async function GetTask(id) {
    try {
        const result = await collection.findOne({
            $eq: {
                uuid: id,
            },
        });
        console.log(result);
        console.log("/tasks/:id : 302 & 200 : Task Document Found");
        return {
            code: 302,
            message: "/tasks/:id : 302 & 200 : Task Document Found",
            Data: result,
        };
    } catch (err) {
        console.log("Mongo : 403");
        console.log(err);
        return { code: 403 };
    }
}

async function GetAllTasks(email) {
    try {
        const result = await collection
            .find({
                Email: email,
            })
            .toArray();

        console.log("/tasks : 302 & 200 : Task Documents Found");
        return {
            code: 302,
            message: "/tasks : 302 & 200 : Task Documents Found",
            Data: result,
        };
    } catch (err) {
        console.log("Mongo : 403");
        console.log(err);
        return { code: 403 };
    }
}

async function UpdateTask(id, Document) {
    Document["uuid"] = id;

    if (await ValidateUpdate(Document)) {
        try {
            await collection.findOneAndUpdate(
                {
                    uuid: id,
                },
                {
                    $set: Document,
                }
            );
            console.log("/tasks/:id : 302 & 200 : Document Updated");
            return {
                code: 200,
                message: "/tasks/:id : 302 & 200 : Document Updated",
            };
        } catch (err) {
            console.log("Mongo : 403");
            console.log(err);
            return { code: 403, message: "something went wrong" };
        }
    } else {
        console.log("/tasks/:id : 400 : Please Provide Correct Object type");
        return {
            code: 400,
            message: "/tasks/:id : 400 : Please Provide Correct Object type",
        };
    }
}

async function DeleteTask(id) {
    try {
        await collection.deleteOne({
            uuid: id,
        });
        console.log("/tasks/:id : 302 & 200 : Document Deleted");
        return {
            code: 200,
            message: "/tasks/:id : 302 & 200 : Document Deleted",
        };
    } catch (err) {
        console.log("Mongo : 403");
        console.log(err);
        return { code: 403 };
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
