import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [localStorage.getItem("user")]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          <img src="/logo.png" className="logo" />
        </NavLink>
        <input type="text" placeholder="Search" className="navbar-search" />
      </div>

      <div className="hamburger" onClick={toggleMobileMenu}>
        <i className="fas fa-bars"></i>
      </div>

      <div className={`navbar-center ${mobileMenuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className="nav-item"
          onClick={() => setMobileMenuOpen(false)}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/network"
          className="nav-item"
          onClick={() => setMobileMenuOpen(false)}
        >
          <i className="fas fa-users"></i>
          <span>My Network</span>
        </NavLink>
        <NavLink
          to="/notifications"
          className="nav-item"
          onClick={() => setMobileMenuOpen(false)}
        >
          <i className="fas fa-bell"></i>
          <span>Notifications</span>
        </NavLink>

        <div className="nav-item me-menu" onClick={toggleDropdown}>
          {user ? (
            <>
              <img
                src={user.profilePic || "https://via.placeholder.com/30"}
                className="me-icon"
              />
              <span>Profile</span>
            </>
          ) : (
            <>
              <i className="fas fa-user-circle"></i>
              <span>Login/SignUp</span>
            </>
          )}

          {/* <span>{user ? "Profile" : "Login / Register"}</span> */}

          {dropdownOpen && (
            <div className="dropdown">
              {user ? (
                <div onClick={() => handleNavigate("/profile")}>
                  <i className="fas fa-id-badge"></i> View Profile
                </div>
              ) : (
                <>
                  <div onClick={() => handleNavigate("/login")}>
                    <i className="fas fa-sign-in-alt"></i> Login
                  </div>
                  <div onClick={() => handleNavigate("/register")}>
                    <i className="fas fa-user-plus"></i> Register
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
