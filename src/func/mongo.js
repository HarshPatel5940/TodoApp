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
        console.log("Mongo : Connection established");
        return 200;
    } catch (err) {
        console.log("Mongo : ERROR connecting to mongodb");
        console.log(err);
        return 403;
    } finally {
        await client.close();
        console.log("Mongo : Connection Closed.");
    }
}

async function NewTask(Document) {
    if (await ObjCheck(Document)) {
        try {
            await client.connect();
            console.log("Mongo : Connection established");
            await collection.insertOne(Document);
            return 302;
        } catch (err) {
            console.log("Mongo : ERROR connecting to mongodb");
            console.log(err);
            return 403;
        } finally {
            await client.close();
        }
    } else {
        console.log("BAD REQUEST/INFO : Please Provide Correct Object type");
        return 400;
    }
}

export { CheckConnection, NewTask };
