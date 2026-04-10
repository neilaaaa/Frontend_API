import React from "react";
import "./Background.css";
import bg from "../assets/bg.jpg";

export default function Background({ children }) {
  return (
    <div className="background" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">{children}</div>
    </div>
  );
}