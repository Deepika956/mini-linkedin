import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [banner, setBanner] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("👋 Logged out successfully!");
    navigate("/login");
  };

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load user data");

      setUser(data.user);
      setUserPosts(data.posts || []);
      setBio(data.user.bio || "");
      setLocation(data.user.location || "");
      setBanner(data.user.banner || null);
      setProfilePic(data.user.profilePic || null);

      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("Failed to fetch user data:", err.message);
      toast.error("❌ Failed to load profile data.");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      toast.warning("🔒 You must be logged in to access your profile");
      navigate("/login");
      return;
    }

    fetchUserData(storedUser._id);
  }, [navigate]);

  const saveToDatabase = async (updatedUserData) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/update/${updatedUserData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updatedUserData.name || "No Name",
            bio: updatedUserData.bio || "No bio",
            location: updatedUserData.location || "No location",
            banner: updatedUserData.banner || "",
            profilePic: updatedUserData.profilePic || "",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success("✅ Profile updated!");
    } catch (err) {
      toast.error("❌ " + err.message);
    }
  };

  const handleSave = () => {
    if (!user) return;
    saveToDatabase({
      _id: user._id,
      name: user.name,
      bio,
      location,
      banner,
      profilePic,
    });
  };

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);

    const endpoint =
      type === "banner"
        ? "http://localhost:5000/api/users/upload/banner"
        : "http://localhost:5000/api/users/upload/profile";

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Upload failed: " + errorText);
    }

    const data = await res.json();
    return `http://localhost:5000${data.imageUrl}`;
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      try {
        const url = await uploadImage(file, "banner");
        setBanner(url);
        await saveToDatabase({ ...user, banner: url });
      } catch (err) {
        toast.error("❌ " + err.message);
      }
    }
  };

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      try {
        const url = await uploadImage(file, "profile");
        setProfilePic(url);
        await saveToDatabase({ ...user, profilePic: url });
      } catch (err) {
        toast.error("❌ " + err.message);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-main">
        <div className="banner-container">
          <img
            src={banner || "https://via.placeholder.com/800x200"}
            className="banner"
          />
          <label htmlFor="bannerUpload" className="edit-banner">
            📸 Change Banner
            <input
              type="file"
              id="bannerUpload"
              onChange={handleBannerChange}
              hidden
            />
          </label>

          <img
            src={profilePic || "https://via.placeholder.com/100"}
            className="profile-pic"
          />
          <label htmlFor="profileUpload" className="edit-profile-pic">
            🖊️
            <input
              type="file"
              id="profileUpload"
              onChange={handleProfileChange}
              hidden
            />
          </label>
        </div>

        <div className="user-info">
          <h2>
            {user.name} <span className="pronoun">She/Her</span>
          </h2>

          <div className="editable-field">
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Your bio"
            />
          </div>

          <div className="editable-field">
            Location:
            <input
              type="text"
              className="loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your location"
            />
          </div>

          <div className="email">
            <p>
              <a
                href={`mailto:${user.email}`}
                style={{ textDecoration: "underline" }}
              >
                Contact info:
              </a>
            </p>
            <p>{user.email}</p>
          </div>
          <div className="action-buttons">
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>

          <div className="user-posts-section">
            <h3 className="section-heading">Featured Posts</h3>

            {userPosts.length === 0 ? (
              <p className="no-posts-text">You haven’t shared anything yet.</p>
            ) : (
              <div className="user-posts-grid">
                {userPosts.map((post) => (
                  <div className="user-post-card" key={post._id}>
                    <div className="post-card-header">
                      <h4>{post.title}</h4>
                      <p className="timestamp">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="post-text">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="post"
                        className="post-image-preview"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-card">
          <p>
            <strong>Profile language</strong>
          </p>
          <p>English</p>
        </div>

        <div className="sidebar-card">
          <p>
            <strong>Public profile & URL</strong>
          </p>
          <p>
            www.minilinkedin.com/in/
            {user.name.toLowerCase().replace(/\s+/g, "")}
          </p>
        </div>

        <div className="sidebar-card logout-card">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
