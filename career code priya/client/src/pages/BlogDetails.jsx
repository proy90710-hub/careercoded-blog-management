import { Heart, Tag } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const BlogDetails = () => {
  const { id } = useParams();
  const { user, refreshMe } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const liked = Boolean(user?.likedBlogs?.some((item) => (item._id || item) === id));

  const loadBlog = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/blogs/${id}`);
      setBlog(data.blog);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlog();
  }, [id]);

  const toggleLike = async () => {
    if (!user) {
      setError("Please login to like blogs.");
      return;
    }

    const endpoint = `/blogs/${id}/${liked ? "unlike" : "like"}`;
    const method = liked ? "delete" : "post";
    const { data } = await api[method](endpoint);
    setBlog((current) => ({ ...current, likes: data.likes }));
    await refreshMe();
  };

  if (loading) return <section className="page"><p className="muted">Loading blog...</p></section>;
  if (error && !blog) return <section className="page"><p className="alert">{error}</p></section>;

  return (
    <article className="article">
      <img className="article-image" src={blog.thumbnail} alt={blog.title} />
      <div className="article-body">
        <div className="card-meta">
          <span>{blog.category}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <h1>{blog.title}</h1>
        <p className="lead">{blog.description}</p>
        <div className="article-actions">
          <button className={liked ? "like-btn liked" : "like-btn"} onClick={toggleLike} type="button">
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked" : "Like"} · {blog.likes}
          </button>
          <span>By {blog.author}</span>
        </div>
        {error && <p className="alert">{error}</p>}
        <div className="content">{blog.content.split("\n").map((line) => <p key={line}>{line}</p>)}</div>
        <div className="tags">
          {blog.tags.map((tag) => (
            <span key={tag}><Tag size={14} />{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
