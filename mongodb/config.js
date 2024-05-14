import mongoose from "mongoose";

mongoose.connect("mongodb://0.0.0.0:27017/society");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", function () {
  console.log("successfully connected to the database");
});

export default db;
