import React from "react";
import "./Background.css";
import bg from "../assets/bg.jpg";

function Background({ children }) {
  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay">
        {children} {/* Les enfants (login) apparaissent ici */}
      </div>
    </div>
  );
}

export default Background;