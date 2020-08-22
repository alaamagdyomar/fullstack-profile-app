const express = require("express"); // load express
const mongoose = require("mongoose"); // load mongoose
const bodyParser = require("body-parser"); // load body parser
const db = require("./config/keys").mongoURI;
const passport = require("passport"); // load passport

// require("dotenv").config();

// load routes configurations
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express(); // integrate express in const app

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db config

// db connection first logic
// mongoose
//   .connect(db)
//   .then(() => console.log("mongodb connected"))
//   .catch((err) => console.log(err));

// mongodb connection logic updated
// const uri = process.env.ATLAS_URI;
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb connection established succesfully");
});

// passport middlewares
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`im listening on port ${port}`));
