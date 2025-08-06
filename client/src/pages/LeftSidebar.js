import React, { useEffect, useState } from "react";
import "./LeftSidebar.css";

export default function LeftSidebar() {
  const [user, setUser] = useState(null);

  // Fetch full user details from backend
  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`https://mini-linkedin-w94t.onrender.com/api/users/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load user");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user)); // keep localStorage in sync
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed._id) {
          fetchUserDetails(parsed._id);
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, []);

  if (!user) return null;

  return (
    <div className="left-sidebar">
      <div className="profile-card">
        <div className="banner-container">
          <img
            src={user.banner || "https://via.placeholder.com/600x150"}
            alt="Banner"
            className="banner-img"
          />
          <img
            src={user.profilePic || "https://via.placeholder.com/100"}
            alt="Profile"
            className="sidebar-profile-pic"
          />
        </div>

        <div className="user-details">
          <h3>{user.name}</h3>
          <p className="bio">{user.bio || "No bio available"}</p>
          <button className="experience"><span>+</span>Experience</button>
        </div>
      </div>

      <div className="connection-card">
        <p className="label">Connections</p>
        <p className="sub">Grow your network</p>
        <p className="connection-count"></p>
      </div>
    </div>
  );
}


