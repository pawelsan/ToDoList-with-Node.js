const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });


//mongoose schemas
const itemsSchema = {
    name: String
};
const listSchema = {
    name: String,
    items: [itemsSchema]
}

//mongoose models with singular version of collection name and the name of the schema used
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

// Used to have starting tasks
// const task1 = new Item({
//     name: "Go get the washing mashine"
// })

// const task2 = new Item({
//     name: "Buy some grocery"
// })

// const task3 = new Item({
//     name: "Get a birthday present for Joasia"
// })

// const tasks = [task1, task2, task3];
const tasks = [];

app.get("/", function (req, res) {
    const day = date.getDate();

    //Used to have a simplistic way for getting the date below
    // const dayNumber = date.getDay();
    // const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // res.render("index", { today: week[dayNumber] })

    Item.find({}, function (err, results) {
        if (err) {
            console.log(err)
        }
        //Code below was useful when the tasks array was prefilled
        // else if (results.length === 0) {
        //     Item.insertMany(tasks, function (err) {
        //         if (err) {
        //             console.log(err)
        //         }
        //         else {
        //             console.log("successflly saved in the DB")
        //         }
        //     });
        //     res.redirect("/");
        // }
        else {
            res.render("index", {
                listTitle: day,
                items: results,
            })
        }
    })
})

app.post("/", function (req, res) {
    const newTask = req.body.newTask;
    // The name of the button passes the value, which is the name of the listTitle passed to index.ejs in the block of code above
    const newList = req.body.button;

    // Creating tasks dynamically
    const task = new Item({
        name: newTask
    });

    if (newList === date.getDate()) {
        // checking if we are in the home route
        task.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: newList
        }, function (err, foundList) {
            foundList.items.push(task);
            foundList.save();
            res.redirect("/" + newList);
        })
    }

    // if (req.body.button == "Work") {
    //     WorkTasks.push(newTask);
    //     res.redirect("/work");
    // } else {
    //     Tasks.push(newTask);
    //     res.redirect("/");
    // }
})

app.post("/delete", function (req, res) {
    const deletedItemId = req.body.deleted;
    Item.findByIdAndRemove(deletedItemId, function (err) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Succesfully deleted item from the DB");
            res.redirect("/")
        }
    })
})
// When the work route was to be predefined:
// app.get("/work", function (req, res) {
//     res.render("index", {
//         listTitle: "Work List",
//         // items: WorkTasks,
//     })
// })
// When the work route was to be predefined:
// app.post("/work", function (req, res) {
//     const newTask = req.body.newTask;
// })

// Instead of predefining, dynamically creating a custom route and a new list of tasks associated with it:
app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // make new list
                const list = new List({
                    name: customListName,
                    items: tasks
                });
                //saving in the collection
                list.save();
                // redirecting to the custom route which we are currently in
                res.redirect("/" + customListName);
            } else {
                // render the page with existing list
                res.render("index", { listTitle: foundList.name, items: foundList.items })
            }
        }
    })
})

// Predefine route with "About me" info:
app.get("/about", function (req, res) {
    res.render("about")
})

app.listen(3000, function () {
    console.log("Server running on port 3000")
})