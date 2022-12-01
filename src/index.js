const { MongoClient } = require("mongodb");
import dotenv from "dotenv";
const express = require("express");
import { nanoid } from "nanoid";
const app = express();

dotenv.config();
app.use(express.json());

// @ts-ignore -- this is for my extension
const client = new MongoClient(process.env.MONGO_URI);

app.get("/", function (req, res) {
    console.log("redirecting to /tasks");
    res.status(302).redirect("http://localhost:3000/tasks");
});

app.get("/healthcheck", function (req, res) {
    // TODO: Need to add checks if connection with mongo db is alive.

    res.status(200).json({ message: "All systems working functional!" });
});

app.patch("/tasks/:id", function (req, res) {
    res.status(200).json({ message: "All the changes have been made" });
});

app.post("/task/new/", function (req, res) {
    // ! we need to use email and unique id
    const newUuid = nanoid();

    res.status(200).json({
        // TODO: add {data: <data>}
    });
});

app.delete("/tasks/:id", function (req, res) {
    res.status(200).json({
        // TODO: add {data: <data>}
    });
});

app.listen(3000, () => {
    console.log("Server started at PORT: 3000");
    console.log("http://localhost:3000");
});
