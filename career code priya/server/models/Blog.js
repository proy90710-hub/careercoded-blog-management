import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280
    },
    content: {
      type: String,
      required: true,
      minlength: 20
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", description: "text", content: "text", tags: "text" });

export default mongoose.model("Blog", blogSchema);

