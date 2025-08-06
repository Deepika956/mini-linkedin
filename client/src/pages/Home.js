// src/pages/Home.js
import React from "react";
import LeftSidebar from "./LeftSidebar";
import PostSection from "./PostSection";
import RightSidebar from "./RightSidebar";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <LeftSidebar />
      <PostSection />
      <RightSidebar />
    </div>
  );
}
