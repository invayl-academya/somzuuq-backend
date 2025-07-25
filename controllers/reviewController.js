import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReview = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReview) {
      res.status(400);
      throw new Error("product Already Review");
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "product reviewed" });
  } else {
    res.status(404);
    throw new Error("product not Found");
  }
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name"
  );

  if (!product) {
    res.status(404);
    throw new Error("product not Found");
  }

  res.json(product.reviews);
});

export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const review = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (review) {
      review.rating = rating !== undefined ? rating : review.rating;
      review.comment = comment !== undefined ? comment : review.comment;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.json({ message: "review updated" });
    } else {
      res.status(404);
      throw new Error("review not found");
    }
  } else {
    res.status(500);
    throw new Error("Serer failed");
  }
});

export const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const index = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (index === -1) {
      res.status(404);
      throw new Error("Review not Found");
    }

    product.reviews.splice(index, 1);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, ite) => ite.rating + acc, 0) /
          product.reviews.length
        : 0;

    await product.save();
    res.status(201).json("review deleted");
  } else {
    res.status(404);
    throw new Error("review not found");
  }
});
