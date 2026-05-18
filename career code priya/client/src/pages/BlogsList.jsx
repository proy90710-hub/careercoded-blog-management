import { Search } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import api from "../services/api";

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/blogs", {
        params: { search, category, page, limit: 9 }
      });
      setBlogs(data.blogs);
      setCategories(data.categories);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadBlogs(1), 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <section className="page journal-page">
      <div className="journal-masthead">
        <div className="page-heading">
          <span className="eyebrow">Latest journal entries</span>
          <h1>CareerCoded Journal</h1>
        </div>
        <p>
          Browse practical editorial notes for students, junior developers, and career switchers.
        </p>
      </div>
      <div className="filters">
        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search journal" />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {error && <p className="alert">{error}</p>}
      {loading ? (
        <p className="muted">Loading blogs...</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      )}
      {!loading && blogs.length === 0 && <p className="muted">No journal entries found.</p>}
      <div className="pagination">
        <button disabled={pagination.page <= 1} onClick={() => loadBlogs(pagination.page - 1)}>Previous</button>
        <span>Page {pagination.page} of {pagination.pages}</span>
        <button disabled={pagination.page >= pagination.pages} onClick={() => loadBlogs(pagination.page + 1)}>Next</button>
      </div>
    </section>
  );
};

export default BlogsList;
