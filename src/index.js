import express, { json } from "express";
const app = express();
app.use(json());
import {
    CheckConnection,
    DeleteTask,
    GetAllTasks,
    GetTask,
    NewTask,
    UpdateTask,
    MongoConnect,
} from "./utilities/mongo.js";

await MongoConnect();

app.get("/", function (req, res) {
    res.status(200).send(`
    Hello World!

    Check out /tasks and other things for more info!
    `);
});

app.get("/tasks", async function (req, res) {
    if (req.body.email) {
        const Task = await GetAllTasks(req.body.email);
        res.status(Task.code).send({
            message: `Code: ${Task.code} : Check console`,
            data: Task.data,
        });
    } else {
        res.status(400).send({
            message: `Code: 400 : Check console`,
            data: "Please provide email in the body",
        });
    }
});

app.get("/task/:uuid", async function (req, res) {
    const Task = await GetTask(req.params.uuid);
    res.status(Task.code).send({
        message: `Code: ${Task.code} : Check console`,
        data: Task.data,
    });
});

app.get("/healthcheck", async function (req, res) {
    await CheckConnection();
    res.status(200).send("Check console :");
});

app.patch("/task/:id", async function (req, res) {
    const Task = await UpdateTask(req.params.id, req.body);
    res.status(Task.code).send(`Code: ${Task.code} : Check console`);
});

app.post("/task/new/", async function (req, res) {
    const Task = await NewTask(req.body);
    res.status(Task.code).send(`Code ${Task.code} : Check console`);
});

app.delete("/task/:id", async function (req, res) {
    const Task = await DeleteTask(req.params.id);
    res.status(Task.code).send(`Code ${Task.code} : Check console`);
});

app.listen(process.env.PORT, async () => {
    console.log(`Starting - Listening at http://localhost:${process.env.PORT}`);
});
