import { Router } from "express";
import { router as usersRouter } from "./users.js";
import { router as clothingItemsRouter } from "./clothingItems.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/items", clothingItemsRouter);

export { router, usersRouter, clothingItemsRouter };
