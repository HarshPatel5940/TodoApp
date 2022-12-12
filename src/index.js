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
    res.status(200).send(
        `Hello World!  
        
            Check out /tasks and other things for more info!`
    );
});

app.get("/tasks", async function (req, res) {
    const codeobj = await GetAllTasks(req.query.email);
    res.status(codeobj.code).send({
        message: `Code: ${codeobj.code}`,
        data: codeobj.data,
    });
});

app.get("/task/:uuid", async function (req, res) {
    const Task = await GetTask(req.params.uuid);
    res.status(Task.code).send({
        message: `Code: ${Task.code}`,
        data: Task.data,
    });
});

app.get("/healthcheck", async function (req, res) {
    // TODO: check connection
    CheckConnection();
    res.status(200).send("Check console :");
});

app.patch("/task/:id", async function (req, res) {
    const code = await UpdateTask(req.params.id, req.body);
    res.status(code).send({ message: `Code: ${code}` });
});

app.post("/task/new/", async function (req, res) {
    const code = await NewTask(req.body);
    res.status(code).send(`Code ${code} : Check console`);
});

app.delete("/task/:id", async function (req, res) {
    const code = await DeleteTask(req.params.id);
    res.status(code).send(`Code ${code} : Check console`);
});

app.listen(process.env.PORT, async () => {
    console.log(`Starting - Listening at http://localhost:${process.env.PORT}`);
});
