import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/:id/review")
  .post(protect, createReview)
  .get(getAllReviews)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default reviewRouter;
