import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/index.js";
import errorHandler from "./middlewares/error-handler.js";
import NotFoundError from "./errors/not-found-error.js";
import dotenv from "dotenv";

import { errors } from "celebrate";
import { requestLogger, errorLogger } from "./middlewares/loggers.js";

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use(requestLogger);
app.use(errorLogger);

app.use("/", router);
app.use((req, res) => {
  throw new NotFoundError("Requested resource not found");
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
