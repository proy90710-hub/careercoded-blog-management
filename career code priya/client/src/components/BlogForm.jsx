import { Save } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";

const emptyBlog = {
  title: "",
  thumbnail: "",
  description: "",
  content: "",
  author: "",
  category: "",
  tags: "",
  isPublished: true
};

const BlogForm = ({ initialBlog, onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyBlog);

  useEffect(() => {
    if (initialBlog) {
      setForm({
        title: initialBlog.title || "",
        thumbnail: initialBlog.thumbnail || "",
        description: initialBlog.description || "",
        content: initialBlog.content || "",
        author: initialBlog.author || "",
        category: initialBlog.category || "",
        tags: initialBlog.tags?.join(", ") || "",
        isPublished: initialBlog.isPublished ?? true
      });
    }
  }, [initialBlog]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="editor-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Title
          <input name="title" value={form.title} onChange={update} required minLength="3" />
        </label>
        <label>
          Author
          <input name="author" value={form.author} onChange={update} required />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={update} required />
        </label>
        <label>
          Tags
          <input name="tags" value={form.tags} onChange={update} placeholder="React, Careers, Interview" />
        </label>
      </div>
      <label>
        Thumbnail Image URL
        <input name="thumbnail" type="url" value={form.thumbnail} onChange={update} required />
      </label>
      <label>
        Short Description
        <textarea name="description" rows="3" value={form.description} onChange={update} maxLength="280" required />
      </label>
      <label>
        Content
        <textarea name="content" rows="12" value={form.content} onChange={update} required minLength="20" />
      </label>
      <label className="checkbox-row">
        <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={update} />
        Publish this blog
      </label>
      <button className="primary-btn" type="submit" disabled={submitting}>
        <Save size={18} />
        {submitting ? "Saving..." : "Save Blog"}
      </button>
    </form>
  );
};

export default BlogForm;
