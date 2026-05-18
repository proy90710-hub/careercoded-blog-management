import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/errors.js";
import { signToken } from "../utils/token.js";

const passwordIsStrong = (password) => typeof password === "string" && password.length >= 8;

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    token: signToken(user),
    user
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  if (!passwordIsStrong(password)) {
    throw new ApiError(400, "Password must be at least 8 characters.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({ name, email, password, role: "user" });
  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  sendAuthResponse(res, user);
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email, role: "admin" }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  sendAuthResponse(res, user);
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("likedBlogs", "title thumbnail category");
  res.json({ user });
});

