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

export { CheckConnection, NewTask };
