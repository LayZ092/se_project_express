import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
} from "../utils/errors.js";

import ClothingItem from "../models/clothingItem.js";
// GET clothing items

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error("Error fetching clothing items:", err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { userId: owner } = req.user;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error("Error creating clothing item:", err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { userId: currentUserId } = req.user;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }

      const ownerId = item.owner ? item.owner.toString() : null;
      if (!ownerId || ownerId !== String(currentUserId)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Forbidden: you cannot delete this item" });
      }

      return item
        .deleteOne()
        .then(() =>
          res
            .status(200)
            .send({ message: "Clothing item deleted successfully" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      console.error("Error deleting clothing item:", err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error("Error unliking item:", err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

export {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
