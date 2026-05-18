import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

const toTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
};

const blogPayload = (body) => ({
  title: body.title,
  thumbnail: body.thumbnail,
  description: body.description,
  content: body.content,
  author: body.author,
  category: body.category,
  tags: toTags(body.tags),
  isPublished: body.isPublished ?? true
});

export const getBlogs = asyncHandler(async (req, res) => {
  const {
    search = "",
    category = "",
    page = 1,
    limit = 9,
    published
  } = req.query;

  const numericPage = Math.max(Number(page) || 1, 1);
  const numericLimit = Math.min(Math.max(Number(limit) || 9, 1), 30);
  const query = {};

  if (req.user?.role !== "admin" || published === "true") {
    query.isPublished = true;
  } else if (published === "false") {
    query.isPublished = false;
  }

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { tags: new RegExp(search, "i") }
    ];
  }

  const [blogs, total, categories] = await Promise.all([
    Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),
    Blog.countDocuments(query),
    Blog.distinct("category", req.user?.role === "admin" ? {} : { isPublished: true })
  ]);

  res.json({
    blogs,
    categories,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      pages: Math.ceil(total / numericLimit) || 1
    }
  });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  if (!blog.isPublished && req.user?.role !== "admin") {
    throw new ApiError(404, "Blog not found.");
  }

  res.json({ blog });
});

export const createBlog = asyncHandler(async (req, res) => {
  const payload = blogPayload(req.body);

  if (!payload.title || !payload.thumbnail || !payload.description || !payload.content || !payload.author || !payload.category) {
    throw new ApiError(400, "Title, thumbnail, description, content, author, and category are required.");
  }

  const blog = await Blog.create(payload);
  res.status(201).json({ blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  Object.assign(blog, blogPayload(req.body));
  await blog.save();

  res.json({ blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  await User.updateMany({ likedBlogs: blog._id }, { $pull: { likedBlogs: blog._id } });
  await blog.deleteOne();

  res.json({ message: "Blog deleted." });
});

export const likeBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog id.");
  }

  const blog = await Blog.findById(blogId);
  if (!blog || !blog.isPublished) {
    throw new ApiError(404, "Blog not found.");
  }

  const alreadyLiked = req.user.likedBlogs.some((id) => id.equals(blog._id));
  if (!alreadyLiked) {
    req.user.likedBlogs.push(blog._id);
    blog.likedBy.push(req.user._id);
    blog.likes = blog.likedBy.length;
    await Promise.all([req.user.save(), blog.save()]);
  }

  res.json({ blogId: blog._id, likes: blog.likes, liked: true });
});

export const unlikeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  req.user.likedBlogs = req.user.likedBlogs.filter((id) => !id.equals(blog._id));
  blog.likedBy = blog.likedBy.filter((id) => !id.equals(req.user._id));
  blog.likes = blog.likedBy.length;

  await Promise.all([req.user.save(), blog.save()]);
  res.json({ blogId: blog._id, likes: blog.likes, liked: false });
});

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [totalBlogs, publishedBlogs, totalLikesResult, recentBlogs] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ isPublished: true }),
    Blog.aggregate([{ $group: { _id: null, totalLikes: { $sum: "$likes" } } }]),
    Blog.find().sort({ createdAt: -1 }).limit(5).select("title category likes isPublished createdAt")
  ]);

  res.json({
    stats: {
      totalBlogs,
      publishedBlogs,
      draftBlogs: totalBlogs - publishedBlogs,
      totalLikes: totalLikesResult[0]?.totalLikes || 0
    },
    recentBlogs
  });
});

