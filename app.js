
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const itemsSchema = new mongoose.Schema({
  name: String
})
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})
const Item = mongoose.model('Item', itemsSchema)
const listItem = mongoose.model('List', listSchema )




const item1 = new Item ({
  name: "Welcome to your todolist!"
})
const item2 = new Item ({
  name: "Hit the + button to add a new item."
})
const item3 = new Item ({
  name: "<- hit this to delete item."
})

const defaultItems = [item1, item2, item3]




app.get("/", function(req, res) {
  Item.find({})
    .then(foundItems => {
      if (foundItems.length === 0){
        Item.insertMany(defaultItems).then(() => {
          console.log("Item is successfully inserted in todolistDB.")
          mongoose.connection.close()
        }).catch(err => {
          console.log(err)  
        });
        res.redirect('/');
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch(err => {
      console.log(err);
    });
});



app.get("/:customListName", function(req, res) {
  const customListName = req.params.field
  


});



app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });
  item.save()
  res.redirect('/');
});

app.post('/delete', function(req, res) {
  const checkedBox = req.body.checkbox;
  Item.findByIdAndRemove(checkedBox).then(() => {
    console.log("Item is successfully removed from todolistDB.")
    res.redirect('/')
  }).catch(err => {
    console.log(err)  
  }); 
})

// app.get("/:field", function(req,res){
//   const newField = req.params.field
//   res.render("list", { listTitle: newField, newListItems: foundItems });
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
