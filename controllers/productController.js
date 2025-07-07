import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { handleImageUpload } from "../utils/cloudinary.js";

export const uploadImageToCloud = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({
        success: false,
        message: "No File uploaded!",
      });
    }

    const result = await handleImageUpload(req.file.buffer, req.file.mimetype);
    res.json({
      success: true,
      message: "Image uploaded succesfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error Occur",
    });
  }
};
export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    image,
    category,
    brand,
    description,
    price,
    salePrice,
    countInStock,
  } = req.body;

  const product = new Product({
    user: req.user.id, // assuming user is set in auth middleware
    title,
    image,
    category,
    brand,
    description,
    price,
    salePrice,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json({
    success: true,
    message: "Created product successfully",
    data: createdProduct,
  });
});

//admins
export const getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.json(products);
};

export const getFilteredProducts = asyncHandler(async (req, res) => {
  try {
    const { category, brand, sortBy = "price-asc" } = req.query;
    const filters = {};

    // {"men" , "products"}

    if (category && typeof category === "string" && category.trim() !== "") {
      const categoryArray = category.split(",").filter(Boolean);
      //  filters.category = ["men" , "women"]
      if (categoryArray.length > 0) {
        filters.category = { $in: categoryArray };
      }
    }

    if (brand && typeof brand === "string" && brand.trim() !== "") {
      const brandArray = brand.split(",").filter(Boolean);
      if (brandArray.length > 0) {
        filters.brand = { $in: brandArray };
        //  filters.brand = ["men" , "women"]
      }
    }

    let sort = {};
    switch (sortBy) {
      case "price-asc":
        sort.price = 1;
        break;

      case "price-desc":
        sort.price = -1;
        break;
      case "price-asc":
        sort.title = 1;
        break;

      case "price-desc":
        sort.title = -1;
        break;

      default:
        sort.price = 1;
    }

    const products = await Product.find(filters).sort(sort);
    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch Products , Try AGAIN",
    });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    image,
    category,
    brand,
    description,
    price,
    salePrice,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = title;
    product.price = price;
    product.salePrice = salePrice;
    product.image = image;
    product.description = description;
    product.countInStock = countInStock;
    product.brand = brand;
    product.category = category;

    const updatedProduct = await product.save();
    res.json({
      success: true,
      message: "Succesfully Updated Product",
      updatedProduct,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ success: true, message: "Deleted Product Succesfully ..." });
  } else {
    res.status(501).json({
      success: false,
      message: "Product Not Found",
    });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // const id = req.params.id;

  const product = await Product.findById(id).populate("user", "name email");

  if (!product)
    return res.json({
      success: false,
      message: "Product is Not in the DB!",
    });

  if (product) {
    res.status(200).json({
      success: true,
      message: "Fetched Product Detail From DB succesfully",
      product,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Not Found Product",
    });
  }
});
