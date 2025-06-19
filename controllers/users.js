const User = require("../models/user");

// GET users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).send("Internal Server Error");
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data provided" });
      }
      res.status(500).send("Internal Server Error");
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error("Error fetching user by ID:", err);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = { getUsers, createUser, getUser };
