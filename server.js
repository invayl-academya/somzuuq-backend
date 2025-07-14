// const express = require("express"); // load
import express from "express";
import "dotenv/config";
// import dotenv from "dotenv";
import db from "./config/db.js";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middlewares/errors.js";
import productRouter from "./routes/productRoutes.js";
import morgan from "morgan";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express(); // initialize

const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.setHeader(
    "Cache-control",
    "no-store , no-cache , must-revalidate , private"
  );
  next();
});

db();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_APP_URL,
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

// home route
app.get("/", (req, res) => {
  res.send("Helloo from Invayl");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}  port`);
});
