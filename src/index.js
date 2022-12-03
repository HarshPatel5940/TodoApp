import express, { json } from "express";
const app = express();
app.use(json());

app.get("/", function (req, res) {
    console.log("redirecting to /tasks");
    res.status(302).redirect("http://localhost:3000/tasks");
});

app.get("/healthcheck", function (req, res) {
    // TODO: Need to add checks if connection with mongo db is alive.

    (function (err) {
        if (err) {
            console.log("Error connecting to mongodb");
            res.status(500).json({
                status: "error",
                message: "Error connecting to mongodb",
            });
        } else {
            console.log("Successfully connected to mongodb");
            res.status(200).json({
                status: "ok",
                message: "Successfully connected to mongodb",
            });
        }
    });
});

app.patch("/tasks/:id", function (req, res) {
    res.status(200).json({ message: "All the changes have been made" });
});

app.post("/task/new/", async function (req, res) {
    // ! we need to use email and unique id
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
