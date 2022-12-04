import { config } from "dotenv";
import { MongoClient } from "mongodb";
config();

import { ObjCheck } from "../func/yuppy.js";

// @ts-ignore -- this is for my extension
if (process.env.MONGO_URI === undefined) {
    console.log("Please set the environment variable MONGO_URI");
    process.exit(1);
}

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("MyDatabase");
const collection = db.collection("tasks");

async function CheckConnection() {
    try {
        await client.connect();
        console.log("Mongo : 200 : Connection established");
        return 200;
    } catch (err) {
        console.log("Mongo : 403 : ERROR connecting to mongodb");
        console.log(err);
        return 403;
    } finally {
        await client.close();
        console.log("Mongo : 200 : Connection Closed.");
    }
}

async function NewTask(Document) {
    if (await ObjCheck(Document)) {
        try {
            await client.connect();
            console.log("Mongo : 200 : Connection established");
            await collection.insertOne(Document);
            console.log("/task/new : 201 : Document Inserted");
            return 201;
        } catch (err) {
            console.log("Mongo : 403 : ERROR connecting to mongodb");
            console.log(err);
            return 403;
        } finally {
            await client.close();
            console.log("Mongo : 200 : Connection Closed");
        }
    } else {
        console.log("/tasks/new : 400 : Please Provide Correct Object type");
        return 400;
    }
}

async function DeleteTask(id) {
    try {
        await client.connect();
        console.log("Mongo : 200 : Connection established");
        await collection.deleteOne({
            _id: id,
        });
        console.log("/tasks/:id : 302 & 200 : Document Deleted");
        return 200;
    } catch (err) {
        console.log("Mongo : 403 : ERROR connecting to mongodb");
        console.log(err);
        return 403;
    } finally {
        await client.close();
        console.log("Mongo : 200 : Connection Closed");
    }
}

async function UpdateTask(id, Document) {
    if (await ObjCheck(Document)) {
        try {
            await client.connect();
            console.log("Mongo : 200 : Connection established");
            await collection.updateOne(
                {
                    _id: id,
                },
                {
                    $set: Document,
                }
            );
            console.log("/tasks/:id : 302 & 200 : Document Updated");
            return 200;
        } catch (err) {
            console.log("Mongo : 403 : ERROR connecting to mongodb");
            console.log(err);
            return 403;
        } finally {
            await client.close();
            console.log("Mongo : 200 : Connection Closed");
        }
    } else {
        console.log("/tasks/:id : 400 : Please Provide Correct Object type");
        return 400;
    }
}

async function GetTask(id) {
    try {
        await client.connect();
        console.log("Mongo : 200 : Connection established");
        const result = await collection.findOne({
            _id: id,
        });
        console.log("/tasks/:id : 302 & 200 : Document Found");
        return { code: 200, data: result };
    } catch (err) {
        console.log("Mongo : 403 : ERROR connecting to mongodb");
        console.log(err);
        return { code: 403 };
    } finally {
        await client.close();
        console.log("Mongo : 200 : Connection Closed");
    }
}

async function GetAllTasks(email) {
    try {
        await client.connect();
        console.log("Mongo : 200 : Connection established");
        const result = await collection.find({
            email: email,
        });
        console.log("/tasks : 302 & 200 : Documents Found");
        return { code: 200, data: result };
    } catch (err) {
        console.log("Mongo : 403 : ERROR connecting to mongodb");
        console.log(err);
        return { code: 403 };
    } finally {
        await client.close();
        console.log("Mongo : 200 : Connection Closed");
    }
}

export {
    CheckConnection,
    NewTask,
    DeleteTask,
    UpdateTask,
    GetTask,
    GetAllTasks,
};
