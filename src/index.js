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
} from "./utilities/mongo.js";

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

app.get("/task/:id", async function (req, res) {
    const codeobj = await GetTask(req.params.id);
    res.status(codeobj.code).send({
        message: `Code: ${codeobj.code}`,
        data: codeobj.data,
    });
});

app.get("/healthcheck", async function (req, res) {
    const code = await CheckConnection();
    res.status(code).send({
        status: code,
        message: "Check console for more info",
    });
});

app.patch("/tasks/:id", async function (req, res) {
    const code = await UpdateTask(req.params.id, req.body);
    res.status(code).send({ message: `Code: ${code}` });
});

app.post("/task/new/", async function (req, res) {
    const code = await NewTask(req.body);
    res.status(code).send(`Code ${code} : Check console`);
});

app.delete("/tasks/:id", async function (req, res) {
    const code = await DeleteTask(req.params.id);
    res.status(code).send(`Code ${code} : Check console`);
});

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
});
