import express from "express";
import { admin, protect } from "../middlewares/authMiddleware.js";
import {
  createOrderItem,
  getAllOrders,
  getDeliveredOrders,
  getMyOrders,
  getOrderById,
  markOrderisDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
const orderRouter = express.Router();

orderRouter.post("/create", protect, createOrderItem);
orderRouter.get("/mine", protect, getMyOrders);
orderRouter.get("/delivered", protect, admin, getDeliveredOrders);
orderRouter.get("/all", protect, getAllOrders);

orderRouter.get("/:id", protect, getOrderById);
orderRouter.put("/:id/pay", protect, updateOrderToPaid);
orderRouter.put("/:id/deliver", protect, admin, markOrderisDelivered);

export default orderRouter;
