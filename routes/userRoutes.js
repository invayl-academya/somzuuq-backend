import express from "express";
import {
  getUserProfile,
  login,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

//   http:google.com/api/users/register
userRouter.post("/register", registerUser);
userRouter.post("/auth", login);
userRouter.post("/logout", protect, logoutUser);

userRouter.route("/profile").get(protect, getUserProfile);

export default userRouter;
