const ClothingItem = require("../models/clothingItem");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error("Error fetching clothing items:", err);
      return res.status(500).send("Internal Server Error");
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error("Error creating clothing item:", err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data provided" });
      }
      return res.status(500).send("Internal Server Error");
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
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
        return res.status(400).send({ message: "Invalid item ID format" });
      }
      console.error("Error deleting clothing item:", err);
      return res.status(500).send("Internal Server Error");
    });
};

const likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID format" });
      }
      return res.status(500).send("Internal Server Error");
    });
};

const dislikeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error("Error unliking item:", err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID format" });
      }
      return res.status(500).send("Internal Server Error");
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
