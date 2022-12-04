import express, { json } from "express";
const app = express();
app.use(json());
import { CheckConnection, NewTask } from "./func/mongo.js";

app.get("/", function (req, res) {
    console.log("redirecting to /tasks");
    res.status(302).redirect("http://localhost:3000/tasks");
});

app.get("/tasks", function (req, res) {});

app.get("/healthcheck", async function (req, res) {
    const code = await CheckConnection();
    res.status(code).json({
        status: code,
        message: "Check console for more info",
    });
});

app.patch("/tasks/:id", function (req, res) {
    res.status(200).json({ message: "All the changes have been made" });
});

app.post("/task/new/", async function (req, res) {
    const code = await NewTask(req.body);
    res.status(code).send(`Code ${code} : Check console for more info`);
});

app.delete("/tasks/:id", async function (req, res) {
    const code = 200;
    res.status(code).send(`Code ${code} : Check console for more info`);
});

app.listen(3000, () => {
    console.log("Server started at PORT: 3000");
    console.log("http://localhost:3000");
});
