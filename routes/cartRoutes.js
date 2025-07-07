import express from "express";
import { addToCart, getCartItems } from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/addCart", protect, addToCart);
cartRouter.get("/user/:userId", protect, getCartItems);

export default cartRouter;
