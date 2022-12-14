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
        console.log(status1, `Uptime: ${Math.floor(process.uptime())} Seconds`);
        return { code: 200 };
    } catch (err) {
        console.log(err);
        return { code: 403 };
    }
}

async function GetTask(id) {
    try {
        const result = await collection.findOne({
            _id: id,
        });
        console.log("/tasks/:id : 302 & 200 : Document Found");
        return { code: 200, data: result };
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
                email: email,
            })
            .toArray();

        console.log("/tasks : 302 & 200 : Documents Found");
        return { code: 200, data: result };
    } catch (err) {
        console.log("Mongo : 403");
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
            await collection.insertOne(Document);
            console.log("/task/new : 201 : Document Inserted");
            return { code: 201 };
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

async function DeleteTask(id) {
    try {
        await collection.deleteOne({
            uuid: id,
        });
        console.log("/tasks/:id : 302 & 200 : Document Deleted");
        return { code: 200 };
    } catch (err) {
        console.log("Mongo : 403");
        console.log(err);
        return { code: 403 };
    }
}

async function UpdateTask(id, Document) {
    if (await ValidateFull(Document)) {
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
            return { code: 200 };
        } catch (err) {
            console.log("Mongo : 403");
            console.log(err);
            return { code: 403 };
        }
    } else {
        console.log("/tasks/:id : 400 : Please Provide Correct Object type");
        return { code: 400 };
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
    NaNoid,
};
