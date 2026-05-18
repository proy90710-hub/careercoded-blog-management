import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode }) => {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">{isRegister ? "Create account" : "Welcome back"}</span>
        <h1>{isRegister ? "Register" : "Login"}</h1>
        {isRegister && (
          <label>
            Name
            <input name="name" value={form.name} onChange={update} required />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={update} minLength="8" required />
        </label>
        {error && <p className="alert">{error}</p>}
        <button className="primary-btn" disabled={submitting} type="submit">
          {submitting ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>
        <p className="muted">
          {isRegister ? "Already registered?" : "New to CareerCoded?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Register"}</Link>
        </p>
      </form>
    </section>
  );
};

export default AuthPage;
