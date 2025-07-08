import express from "express";
import {
  addToCart,
  deleteCart,
  getCartItems,
  updateCartQty,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/addCart", protect, addToCart);
cartRouter.get("/user/:userId", protect, getCartItems);
cartRouter.put("/update", protect, updateCartQty);
cartRouter.delete("/:userId/:productId", protect, deleteCart);

export default cartRouter;
