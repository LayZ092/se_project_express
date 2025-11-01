import jwt from "jsonwebtoken";
import JWT_SECRET from "../utils/config.js";
import UnauthorizedError from "../errors/unauthorized-error.js";

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
  }

  req.user = payload;
  return next();
};

export default auth;
