import express from "express";

import { getUsers, createUser, getUser } from "../controllers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

export { router };
