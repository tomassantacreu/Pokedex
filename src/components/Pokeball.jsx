import React from "react";
import "./Pokeball.css";

export function Pokeball({ isClicked, isHidden }) {
  return (
    <div
      className={`pokeball ${isClicked ? "clicked" : ""}`}
      style={{ display: isHidden ? "none" : "block" }}
    >
      <div className="circle">
        <div className="pbg"></div>
        <div className="pulse1"></div>
        <div className="pulse2"></div>
        <div className="pulse3"></div>
        <div className="pulse4"></div>
        <div className="pulse5"></div>
        <p>POKÉDEX</p>
      </div>
    </div>
  );
}
