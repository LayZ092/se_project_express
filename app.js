import express from "express";
import mongoose from "mongoose";
import { router } from "./routes/index.js";

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "6853f1b9a27692a90a057820",
  };
  next();
});
app.use("/", router);
app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});
