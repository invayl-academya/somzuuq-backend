import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createOrderItem,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";
const orderRouter = express.Router();

orderRouter.post("/create", protect, createOrderItem);
orderRouter.get("/mine", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrderById);

export default orderRouter;
