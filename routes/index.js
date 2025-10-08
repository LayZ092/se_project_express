import { Router } from "express";
import usersRouter from "./users.js";
import clothingItemsRouter from "./clothingItems.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.use("/users", auth, usersRouter);

router.use("/items", auth, clothingItemsRouter);

export default router;
