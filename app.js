const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const day = date.getDate();

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

app.get("/", function (req, res) {

    const homePage = true;
    List.find({}, function (err, results) {
        if (err) {
            console.log(err)
        } else {

            res.render("index", {
                listTitle: day,
                homePage: homePage,
                items: results.filter(result => result.name !== "Favicon.ico" && result.name !== "About")
            })
        }
    });



    //Used to have a simplistic way for getting the date below
    // const dayNumber = date.getDay();
    // const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // res.render("index", { today: week[dayNumber] })

    // Home page used to have its own list of tasks instead of a list of lists
    // Item.find({}, function (err, results) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     //Code below was useful when the tasks array was prefilled
    //     // else if (results.length === 0) {
    //     //     Item.insertMany(tasks, function (err) {
    //     //         if (err) {
    //     //             console.log(err)
    //     //         }
    //     //         else {
    //     //             console.log("successflly saved in the DB")
    //     //         }
    //     //     });
    //     //     res.redirect("/");
    //     // }
    //     else {
    //         res.render("index", {
    //             listTitle: day,
    //             items: results,
    //         })
    //     }
    // })
})

// Predefine route with "About me" info:
app.get("/about", function (req, res) {
    res.render("about")
})

// Instead of predefining, dynamically creating a custom route and a new list of tasks associated with it just by taping address extension:
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    //Empty array as a starting point for any lists
    const tasks = [];

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // creating new list dynamically
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
                res.render("index", {
                    listTitle: foundList.name,
                    items: foundList.items,
                    homePage: false
                })
            }
        }
    })
})



app.post("/", function (req, res) {
    // The name of the button passes the value, which is the name of the listTitle passed to index.ejs in the block of code above
    const listTitle = req.body.button;
    const newItem = _.capitalize(req.body.newItem)
    const elements = [];

    if (listTitle === day) {
        // checking if we are in the home route and if yes, it will create a new list
        const list = new List({
            name: newItem,
            items: elements
        });
        list.save();
        res.redirect("/");
    }
    else {
        // if in the custom route, pushing a new item to existing list
        const item = new Item({
            name: newItem
        });
        List.findOne({
            name: listTitle
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listTitle);
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
    console.log(req.body.deleted)
    const deletedItemId = req.body.deleted;
    const listName = req.body.listName;
    if (listName === date.getDate()) {
        // Deleting a list of tasks from the home page list
        List.findByIdAndRemove(deletedItemId, function (err) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Succesfully deleted item from the DB");
                res.redirect("/")
            }
        })
    } else {
        // Deleting items from the custom lists
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: deletedItemId } } },
            function (err, results) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Succesfully deleted item from the DB");
                    res.redirect("/" + listName)
                }
            }
        )
    }



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



app.listen(3000, function () {
    console.log("Server running on port 3000")
})