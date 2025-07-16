import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createOrderItem,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
} from "../controllers/orderController.js";
const orderRouter = express.Router();

orderRouter.post("/create", protect, createOrderItem);
orderRouter.get("/mine", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.put("/:id/pay", protect, updateOrderToPaid);

export default orderRouter;
