import express from "express";
import cors from "cors";
import { json, urlencoded } from "express"; // Import json and urlencoded directly
import router from "./routes/index.js";

import db from "./mongodb/config.js";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(router);

app.listen(3001, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log("Express server is running on port 8000");
});
