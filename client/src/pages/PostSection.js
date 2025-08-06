import React, { useEffect, useState } from "react";
import PostModal from "../components/PostModal";
import "./PostSection.css";
import { formatDistanceToNow } from "date-fns";

const dummyPosts = [
  {
    _id: "1",
    title: "10 Tips to Boost Your Productivity at Work",
    content:
      "Learn how to manage your time better, stay focused, and accomplish more every day with these simple tips.",
    createdAt: new Date().toISOString(),
    image: "https://source.unsplash.com/800x400/?office,work",
    author: {
      _id: "demo-user-1",
      name: "Samantha Brooks",
      profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
      // bio: "Product Manager | Team Builder | Remote Work Advocate",
      // location: "San Francisco, CA",
    },
  },
  {
    _id: "2",
    title: "Why Emotional Intelligence is the Future of Leadership",
    content:
      "Emotional intelligence is no longer optional—it's a key driver of high-performing teams and resilient leadership.",
    createdAt: new Date().toISOString(),
    image: "https://source.unsplash.com/800x400/?leadership,business",
    author: {
      _id: "demo-user-2",
      name: "David Kim",
      profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
      // bio: "Leadership Coach | Author | Keynote Speaker",
      // location: "New York, NY",
    },
  },
];

export default function PostSection() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState(dummyPosts); // default fallback
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      if (!res.ok || !Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid or empty post data");
      }
      setPosts(data);
    } catch (err) {
      console.warn("⚠️ Falling back to dummy posts:", err.message);
      setPosts(dummyPosts);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={`post-section ${!user ? "full-width" : ""}`}>
      <div className="post-box">
        <div className="post-top">
          <img
            src={user?.profilePic || "https://via.placeholder.com/50"}
            alt="User"
            className="post-profile-pic"
          />
          <button
            className="start-post-btn"
            onClick={() => user && setShowModal(true)}
            disabled={!user}
            style={{ opacity: !user ? 0.6 : 1, cursor: !user ? "not-allowed" : "pointer" }}
          >
            {user ? "Start a post" : "Login to start a post"}
          </button>
        </div>
      </div>

      {showModal && (
        <PostModal
          onClose={() => setShowModal(false)}
          onPostSuccess={fetchPosts}
        />
      )}

      <div className="feed">
        {posts.map((post) => (
          <div className="post" key={post._id}>
            <div className="post-header">
              <img
                src={post.author?.profilePic || "https://via.placeholder.com/40"}
                alt="Author"
                className="post-user-img"
              />
              <div>
                <h2 className="authorname">{post.author?.name || "Unknown User"}</h2>
                {post.author?.bio && <p className="post-bio">{post.author.bio}</p>}
                {post.author?.location && (
                  <p className="post-location">{post.author.location}</p>
                )}
                <p className="post-time">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
            {post.image && <img src={post.image} alt="Post" className="post-image" />}
          </div>
        ))}
      </div>
    </div>
  );
}
