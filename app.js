const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let Tasks = [];
let WorkTasks = [];

app.get("/", function (req, res) {
    const date = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    const day = date.toLocaleDateString("en-US", options);

    res.render("index", {
        listTitle: day,
        items: Tasks,
    })


    //My own idea below
    // const dayNumber = date.getDay();
    // const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // res.render("index", { today: week[dayNumber] })
})

app.post("/", function (req, res) {
    const newTask = req.body.newTask;
    console.log(req.body);
    if (req.body.button == "Work") {
        WorkTasks.push(newTask);
        res.redirect("/work");
    } else {
        Tasks.push(newTask);
        res.redirect("/");
    }
})

app.get("/work", function (req, res) {
    res.render("index", {
        listTitle: "Work List",
        items: WorkTasks,
    })
})

app.post("/work", function (req, res) {
    const newTask = req.body.newTask;


})

app.get("/about", function (req, res) {
    res.render("about")
})


app.listen(3000, function () {
    console.log("Server running on port 3000")
})