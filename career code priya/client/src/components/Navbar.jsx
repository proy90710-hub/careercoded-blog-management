import { BookMarked, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <BookMarked size={22} />
        <span>Career</span>
        <strong>Coded Journal</strong>
      </Link>
      <p className="nav-note">Editorial learning desk</p>
      <nav className="navlinks">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/blogs">Journal</NavLink>
        {isAdmin && (
          <NavLink to="/admin/dashboard">
            <LayoutDashboard size={18} />
            Desk
          </NavLink>
        )}
        {user ? (
          <>
            <NavLink to="/profile">
              <UserRound size={18} />
              Profile
            </NavLink>
            <button className="icon-text" onClick={signOut} type="button">
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink className="button-link" to="/register">
              Start
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
