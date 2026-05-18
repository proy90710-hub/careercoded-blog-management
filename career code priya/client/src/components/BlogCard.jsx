import { Heart, MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => (
  <article className="blog-card">
    <img src={blog.thumbnail} alt={blog.title} />
    <div className="blog-card-body">
      <div className="card-meta">
        <span>{blog.category}</span>
        <span className={blog.isPublished ? "status published" : "status draft"}>
          {blog.isPublished ? "Published" : "Draft"}
        </span>
      </div>
      <h3>{blog.title}</h3>
      <p>{blog.description}</p>
      <div className="tag-preview">
        {(blog.tags || []).slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="card-actions">
        <span className="likes">
          <Heart size={17} />
          {blog.likes}
        </span>
        <Link to={`/blogs/${blog._id}`}>
          Open Entry
          <MoveRight size={17} />
        </Link>
      </div>
    </div>
  </article>
);

export default BlogCard;
