import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  likeBlog,
  unlikeBlog,
  updateBlog
} from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

const optionalAuth = (req, _res, next) => {
  if (!req.headers.authorization) return next();
  return protect(req, _res, next);
};

router.get("/", optionalAuth, getBlogs);
router.get("/:id", optionalAuth, getBlogById);
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);
router.post("/:id/like", protect, likeBlog);
router.delete("/:id/unlike", protect, unlikeBlog);

export default router;

