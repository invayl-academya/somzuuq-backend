import asyncHandler from "../middlewares/asyncHandler.js";
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
