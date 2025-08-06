import React, { useEffect, useState } from "react";
import "./PostModal.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PostModal({ onClose, onPostSuccess }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      toast.warning("⚠️ Please log in to create a post.");
      setRedirecting(true); // Show loader

      setTimeout(() => {
        onClose(); // Close modal
        navigate("/login"); // Redirect
      }, 1500); // Wait 1.5s before redirect
    }
  }, [navigate, onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.warning("📌 Title and content are required.");
      return;
    }
    if (!user) {
      toast.error("⚠️ You must be logged in.");
      onClose();
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch("http://localhost:5000/api/posts/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image upload failed");
        imageUrl = `http://localhost:5000${data.imageUrl}`;
      }

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: user.id || user._id,
          title,
          content,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Post creation failed");

      toast.success("✅ Post created!");
      onPostSuccess();
      onClose();
    } catch (err) {
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loader UI while redirecting
  if (redirecting) {
    return (
      <div className="modal-overlay">
        <div className="redirecting-loader">
          <div className="spinner" />
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="post-modal">
        <h2>Create a Post</h2>

        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {imagePreview && (
          <img src={imagePreview} alt="preview" className="image-preview" />
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handlePost} disabled={loading} className="post-btn">
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
