import React from "react";
import "./RightSidebar.css";

export default function RightSidebar() {
  return (
    <div className="right-sidebar">
      <div className="news-card">
        <h4>LinkedIn News</h4>
        <ul>
          <li>Karnataka bus strike begins</li>
          <li>IndusInd Bank appoints new CEO</li>
          <li>GCCs to step up hiring</li>
        </ul>
      </div>

      <div className="puzzle-card">
        <h4>Today's puzzle</h4>
        <p>🧠 Zip – a quick brain teaser</p>
      </div>
    </div>
  );
}
