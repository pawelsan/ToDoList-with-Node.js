const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });


//mongoose schema
const itemsSchema = {
    name: String
};
//mongoose model with singular version of collection name and the name of the schema used
const Item = mongoose.model("Item", itemsSchema);

const task1 = new Item({
    name: "Go get the washing mashine"
})

const task2 = new Item({
    name: "Buy some grocery"
})

const task3 = new Item({
    name: "Get a birthday present for Joasia"
})

const tasks = [task1, task2, task3];

// let Tasks = [];
// let WorkTasks = [];

app.get("/", function (req, res) {
    const day = date.getDate();

    Item.find({}, function (err, results) {
        if (err) {
            console.log(err)
        }

        else if (results.length === 0) {
            Item.insertMany(tasks, function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("successflly saved in the DB")
                }
            });
            res.redirect("/");
        } else {
            res.render("index", {
                listTitle: day,
                items: results,
            })
        }
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