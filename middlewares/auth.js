import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";
import { UNAUTHORIZED } from "../utils/errors.js";

const auth = (req, res, next) => {
  if (
    req.method === "POST" &&
    (req.path === "/signin" || req.path === "/signup")
  ) {
    return next();
  }

  if (req.method === "GET" && req.path === "/items") {
    return next();
  }

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
};

export default auth;
