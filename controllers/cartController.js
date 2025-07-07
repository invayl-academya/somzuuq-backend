import asyncHandler from "../middlewares/asyncHandler.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCart = asyncHandler(async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    if (!userId || !productId || qty <= 0) {
      return res.status(403).json({
        success: false,
        message: "invalid Data ",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(403).json({
        success: false,
        message: "product not Found!",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const currentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (currentProductIndex === -1) {
      cart.items.push({ productId, qty });
    } else {
      cart.items[currentProductIndex].qty += qty;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "item added to Cart",
      cart,
    });
  } catch (error) {
    console.log("error occur", error);
    res.status(500).json({
      success: false,
      message: `Error Occur / faild to Add , ${error.message}`,
    });
  }
});

export const getCartItems = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "user not Found!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price description countInStock",
    });

    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
      });
    }

    const cartItems = cart.items.filter((productItem) => productItem.productId);

    if (cartItems.length < cart.items.length) {
      cart.items = cartItems;
      await cart.save();
    }

    const populateCartItems = cartItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      countInStock: item.productId.countInStock,
      category: item.productId.category,
      brand: item.productId.brand,
      qty: item.qty,
    }));

    res.status(201).json({
      success: true,
      message: "cart items fetched",
      cart: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    return res.status(404).json({
      message: "failed to fetch user cart",
      success: false,
    });
  }
});
