import NotFoundError from "../errors/not-found-error.js";
import BadRequestError from "../errors/bad-request-error.js";
import ForbiddenError from "../errors/forbidden-error.js";

import ClothingItem from "../models/clothingItem.js";
// GET clothing items

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error("Error fetching clothing items:", err);
      next(err);
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error("Error creating clothing item:", err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
        return;
      }
      next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Clothing item not found");
      }

      const ownerId = item.owner ? item.owner.toString() : null;
      if (!ownerId || ownerId !== String(currentUserId)) {
        throw new ForbiddenError("You cannot delete this item");
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
        next(new BadRequestError("Invalid item ID format"));
        return;
      }
      console.error("Error deleting clothing item:", err);
      next(err);
    });
};

const likeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID format"));
        return;
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error("Error unliking item:", err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID format"));
        return;
      }
      next(err);
    });
};

export {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
