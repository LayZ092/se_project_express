const mongoose = require("mongoose");
const { Schema } = mongoose;

const clothingItemSchema = new Schema({});

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);
module.exports = ClothingItem;
