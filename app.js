import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.js";
import { NOT_FOUND } from "./utils/errors.js";
import { login, createUser } from "./controllers/users.js";
import auth from "./middlewares/auth.js";

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use("/", router);
app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});
