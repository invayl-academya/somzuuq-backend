import express from "express";
import { upload } from "../utils/cloudinary.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFilteredProducts,
  getProductById,
  updateProduct,
  uploadImageToCloud,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
const productRouter = express.Router();

productRouter.post("/upload-image", upload.single("image"), uploadImageToCloud);

productRouter.post("/create", protect, createProduct);
productRouter.put("/:id/update", protect, updateProduct);
productRouter.route("/:id/delete").delete(protect, deleteProduct);

productRouter.get("/filter", getFilteredProducts);

productRouter.get("/all", getAllProducts);

productRouter.route("/:id").get(getProductById);

export default productRouter;
