import { Router } from "express";
import usersRouter from "./users.js";
import clothingItemsRouter from "./clothingItems.js";
import auth from "../middlewares/auth.js";
import { getClothingItems } from "../controllers/clothingItems.js";

const router = Router();

router.use("/users", auth, usersRouter);

router.get("/items", getClothingItems);

router.use("/items", auth, clothingItemsRouter);

export default router;
