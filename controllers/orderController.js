import asyncHandler from "../middlewares/asyncHandler.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";

export const createOrderItem = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order Items");
  }

  const productIds = orderItems.map((item) => item.productId);
  const productsFromDB = await Product.find({ _id: { $in: productIds } });

  const items = orderItems.map((fromClient) => {
    const matchedProduct = productsFromDB.find(
      (prod) => prod._id.toString() === fromClient.productId
    );

    if (!matchedProduct) {
      throw new Error(`product not Found ${fromClient.productId}`);
    }

    return {
      product: fromClient.productId,
      name: fromClient.title,
      image: fromClient.image,
      qty: fromClient.qty,
      price: matchedProduct.price,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(items);

  //   save order
  const order = new Order({
    orderItems: items,
    user: req.user.id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  //clear cart item
  await Cart.findOneAndUpdate({ userId: req.user.id }, { $set: { items: [] } });

  res.status(201).json({
    success: true,
    message: "Order created succesfully ..",
    createdOrder,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(201).json(order);
  } else {
    res.status(404);
    throw new Error("order Not Found");
  }
});
