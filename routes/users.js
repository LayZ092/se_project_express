import express from "express";

import { getCurrentUser, updateProfile } from "../controllers/users.js";

const router = express.Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

export default router;
