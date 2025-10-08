import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} from "../utils/errors.js";

import User from "../models/user.js";

import JWT_SECRET from "../utils/config.js";

// GET users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error("Error fetching users:", err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  (async () => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({ name, avatar, email, password: hash });
      return res.status(201).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  })();
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error("Error fetching user by ID:", err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user || user === UNAUTHORIZED) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const updateProfile = (req, res) => {
  const { userId } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error("Error updating user:", err);
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

export { getUsers, createUser, getCurrentUser, login, updateProfile };
