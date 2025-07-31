import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import validator from "validator";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "Not Found user register first",
    });

  if (user && (await user.matchPasssword(password))) {
    const token = generateToken(res, user._id);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        token,
      },
      success: true,
      message: "Succesfully Login user",
    });
  } else {
    res.status(402);
    throw new Error("try again , wrong user credentials");
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if ((!name || !email, !username || !password)) {
    throw new Error("please fill All fields ");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1, // # @
      minNumbers: 1,
    })
  ) {
    throw new Error(
      "password should have at least 10 charector one uppercase and 1 special character"
    );
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("user Already Exist , Try Sign in");
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      success: true,
      message: "Succesfully Register user",
    });
  } else {
    res.status(500);
    throw new Error("Failed to create user , try again");
  }
});

export const logoutUser = async (req, res) => {
  res.clearCookie("jwt");
  res.status(201).json({
    success: true,
    message: "Logged Out Succesfuly",
  });
};

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).lean();

  const userIds = users.map((u) => u._id);

  // userIds = ["6852772d6efa16263a6f64f1" , "6852772d6efa16263a6f64f1" , "sfrt43557"]

  const orders = await Order.find({ user: { $in: userIds } })
    .populate("user", "name email")
    .populate("orderItems.product", "name price image ")
    .lean();

  const userOrderMap = {};

  orders.forEach((order) => {
    const userId = order.user._id.toString();

    if (!userOrderMap[userId]) {
      userOrderMap[userId] = [];
    }
    userOrderMap[userId].push(order);
  });

  // atch orders to user
  const userWithOrders = users.map((user) => {
    const userId = user._id.toString();

    return {
      ...user,
      orders: userOrderMap[userId] || [],
    };
  });

  // res.json(users);
  res.json(userWithOrders);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.email && !validator.isEmail(req.body.email)) {
      res.status(404);
      throw new Error("invalid Email");
    }

    if (
      req.body.password &&
      !validator.isStrongPassword(req.body.password, {
        minLength: 10,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1, // # @
        minNumbers: 1,
      })
    ) {
      res.status(400);
      throw new Error(
        "password should have at least 10 charector one uppercase and 1 special character"
      );
    }

    user.name = req.body.name || user.name;
    // user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  user.isAdmin = !user.isAdmin;

  await user.save();

  res.json({ message: "user Role updated", user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("cannot delete Admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "Successfully removed user" });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});
