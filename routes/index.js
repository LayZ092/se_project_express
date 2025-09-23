const router = require("express").Router();

const usersRouter = require("./users");

router.use("/users", usersRouter);

const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);

module.exports = router;
