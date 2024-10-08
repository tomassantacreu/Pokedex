import React from "react";
import "./PokemonCard.css";

export const PokemonCard = ({ pokemon, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(pokemon)}>
      <img src={pokemon.icon} alt={pokemon.name} />
      <p>{pokemon.id.toString().padStart(3, "0")}</p>{" "}
    </div>
  );
};
