import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  login,
  logoutUser,
  registerUser,
  updateUserProfile,
  updateUserRole,
} from "../controllers/userController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

//   http:google.com/api/users/register
userRouter.post("/register", registerUser);
userRouter.post("/auth", login);
userRouter.get("/all", protect, getAllUsers);

userRouter.post("/logout", protect, logoutUser);

userRouter
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
userRouter.put("/role/:id", protect, admin, updateUserRole); // admin
userRouter.delete("/:id", protect, admin, deleteUser); // admin

export default userRouter;
