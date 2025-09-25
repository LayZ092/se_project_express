import { Router } from "express";
import usersRouter from "./users.js";
import clothingItemsRouter from "./clothingItems.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/items", clothingItemsRouter);

export default router;
