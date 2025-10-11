import express from "express";

import {
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} from "../controllers/clothingItems.js";

const router = express.Router();

router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

export default router;
