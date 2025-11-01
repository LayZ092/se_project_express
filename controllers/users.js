import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NotFoundError from "../errors/not-found-error.js";
import BadRequestError from "../errors/bad-request-error.js";
import ConflictError from "../errors/conflict-error.js";
import UnauthorizedError from "../errors/unauthorized-error.js";
import UNAUTHORIZED from "../utils/errors.js";

import User from "../models/user.js";

import JWT_SECRET from "../utils/config.js";

const createUser = (req, res, next) => {
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
        next(new ConflictError("Email already exists"));
        return;
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
        return;
      }
      next(err);
    }
  })();
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error("Error fetching user by ID:", err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
        return;
      }
      next(err);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    next(new BadRequestError("Email and password are required"));
    return;
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user || user === UNAUTHORIZED) {
      throw new UnauthorizedError("Incorrect email or password");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
  }
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
        return;
      }
      next(err);
    });
};

export { createUser, getCurrentUser, login, updateProfile };
