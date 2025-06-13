import jwt from "jsonwebtoken";
import User from "../models/user.js";
import generateResponse from "../utils/generateResponse.js";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(generateResponse(false, {}, "Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json(generateResponse(false, {}, "Authentication failed"));
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json(
        generateResponse(false, {}, "Authentication failed", error.message)
      );
  }
};
