import jwt from "jsonwebtoken";

// console.log("secretKey", process.env.JWT_SECRET);
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProduction = process.env.NODE_ENV === "production"; // true in production

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dys
    // domain : process.env.NODE_ENV === "production" ? "suuqlay.com" :"localhost"
  });

  return token;
};

export default generateToken;
