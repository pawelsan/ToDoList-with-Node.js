const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let newTasks = [];

app.get("/", function (req, res) {
    const date = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    const day = date.toLocaleDateString("en-US", options);

    res.render("index", {
        today: day,
        newItems: newTasks,
    })


    //My own idea below
    // const dayNumber = date.getDay();
    // const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // res.render("index", { today: week[dayNumber] })
})

app.post("/", function (req, res) {
    const newTask = req.body.newTask;
    newTasks.push(newTask);
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server running on port 3000")
})