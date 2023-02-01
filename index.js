const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const connectionUrl = "mongodb://localhost:27017/users";
mongoose.set("strictQuery", false);
mongoose.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err) throw err;
    console.log("Connected")
});

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("index")
});


app.post("/signup", (req, res) => {
  const email = req.body.email;
  UserModel.findOne({ email: email }, (error, foundUser) => {
    if (error) throw error;
    if (foundUser) {
      res.render("result", { message: "User already exists" });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) throw err;
        const SaveUser = new UserModel({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          password: hash,
        });
        SaveUser.save((error, savedUser) => {
          if (error) throw error;
          res.render("result", { message: "User saved successfully" });
        });
      });
    }
  });
});


app.listen(3000, ()=>{
    console.log("listening to port 3000")
});
