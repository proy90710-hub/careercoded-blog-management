import { FileText, Heart, Library, PenSquare } from "lucide-react";
import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";

const AdminDashboard = () => {
  const { data, loading, error } = useFetch(async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  }, []);

  const stats = data?.stats || {};

  return (
    <section className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="page-heading">
          <span className="eyebrow">Editor operations</span>
          <h1>Publishing Desk</h1>
        </div>
        {error && <p className="alert">{error}</p>}
        {loading ? <p className="muted">Loading dashboard...</p> : (
          <>
            <div className="stats-grid">
              <div><Library /><span>Total Entries</span><strong>{stats.totalBlogs}</strong></div>
              <div><FileText /><span>Published</span><strong>{stats.publishedBlogs}</strong></div>
              <div><PenSquare /><span>Drafts</span><strong>{stats.draftBlogs}</strong></div>
              <div><Heart /><span>Reader Likes</span><strong>{stats.totalLikes}</strong></div>
            </div>
            <section className="table-card">
              <h2>Recent Entries</h2>
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Likes</th><th>Status</th></tr></thead>
                <tbody>
                  {data.recentBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>{blog.title}</td>
                      <td>{blog.category}</td>
                      <td>{blog.likes}</td>
                      <td>{blog.isPublished ? "Published" : "Draft"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
