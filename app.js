const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT;

mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("connected to database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const postsRoute = require("./src/routes/posts_route");
const commentsRoute = require("./src/routes/comment_route");

app.use('/comments', commentsRoute);
app.use("/posts", postsRoute);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
