const { MongoClient, ServerApiVersion } = require("mongodb");
import dotenv from "dotenv";
const express = require("express");
const app = express();
app.use(express.json());

// dotenv.config({ path: ".env.test" });
dotenv.config();

// const uri =
//     "mongodb+srv://hp8823:<password>@cluster1.xzubd4k.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1,
// });

// client.connect((err) => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

let MoviesArr = [
    {
        id: 0,
        TaskTitle: "",
        TaskDesc: "",
    },
];

app.get("/", function (req, res) {
    console.log("redirecting to /tasks");
    res.status(302).redirect("http://localhost:3000/tasks");
});

app.get("/tasks", function (req, res) {
    res.status(200).json({ data: MoviesArr, message: "Tasks Data fetched!" });
});

// app.post("/movie/new/", function (req, res) {
//     MoviesArr.push(req.body);
//     res.status(200).json({ data: MoviesArr });
// });

// app.delete("/movie/delete/:id", function (req, res) {
//     MoviesArr = MoviesArr.filter(function (el) {
//         return req.params.id !== el.id.toString();
//     });
//     res.status(200).json({ data: MoviesArr });
// });

app.listen(3000, () => {
    console.log("Server started at PORT: 3000");
    console.log("http://localhost:3000");
});
