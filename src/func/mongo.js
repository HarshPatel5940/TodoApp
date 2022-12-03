import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { nanoid } from "nanoid";
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
        console.log("Successfully connected to mongodb");
    } catch (err) {
        console.log("Error connecting to mongodb");
    } finally {
        await client.close();
    }
}

async function NewTask(Document) {
    if (await ObjCheck(Document)) {
        try {
            await client.connect();
            await collection.insertOne(Document);
            return "Ok";
        } catch (err) {
            console.log(err);
            return "Error inserting document";
        } finally {
            await client.close();
        }
    } else {
        return "Invalid document";
    }
}
export { CheckConnection, NewTask };

let obj = {
    taskheader: "Hello srmKzilla",
    taskdesc: "I love srmKzilla",
    email: "helloworld@gmail.com",
    uuid: nanoid(),
    createdOn: new Date(),
};

console.log(await CheckConnection());
console.log(await NewTask(obj));
