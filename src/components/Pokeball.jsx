import React from "react";
import "./Pokeball.css";

export function Pokeball({ isClicked, isHidden }) {
  return (
    <img
      src="./pokeball.png"
      alt="pokeball"
      className={`pokeball ${isClicked ? "clicked" : ""}`}
      style={{ display: isHidden ? "none" : "block" }}
    />
  );
}
