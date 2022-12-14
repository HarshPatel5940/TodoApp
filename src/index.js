import express, { json } from "express";
const app = express();
app.use(json());
import {
    CheckConnection,
    DeleteTask,
    GetAllTasks,
    GetTask,
    CreateNewTask,
    UpdateTask,
    MongoConnect,
} from "./utils/mongo.js";

await MongoConnect();

app.get("/", function (req, res) {
    res.status(200).send(`
    Hello World!

    Check out /tasks and other things for more info!
    `);
});

app.get("/healthcheck", async function (req, res) {
    const ConnectionStatus = await CheckConnection();
    res.status(ConnectionStatus.code).send(ConnectionStatus.message);
});

app.post("/task/new/", async function (req, res) {
    const Task = await CreateNewTask(req.body);
    res.status(Task.code).send(`${Task.Data}`);
});

app.get("/tasks", async function (req, res) {
    if (req.body.email) {
        const Task = await GetAllTasks(req.body.email);
        res.status(Task.code).send({
            message: `${Task.message}`,
            data: Task.Data,
        });
    } else {
        res.status(400).send(
            ">>> 400 : GET_ALL_TASKS : Missing Email Address in the email"
        );
    }
});

app.get("/task/:id", async function (req, res) {
    const Task = await GetTask(req.params.id);
    res.status(Task.code).send({
        message: `${Task.message}`,
        data: Task.Data,
    });
});

app.patch("/task/:id", async function (req, res) {
    const Task = await UpdateTask(req.params.id, req.body);
    res.status(Task.code).send(`s${Task.message}`);
});

app.delete("/task/:id", async function (req, res) {
    const Task = await DeleteTask(req.params.id);
    res.status(Task.code).send(`${Task.message}}`);
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist");
});

app.listen(process.env.PORT, async () => {
    console.log(`Starting - Listening at http://localhost:${process.env.PORT}`);
});
