import React, { useState, useEffect, useRef } from "react";
import "./Modal.css";

// Función para capitalizar la primera letra de una cadena
const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

// Función para formatear el ID del Pokémon con ceros a la izquierda
const formatPokemonId = (id) => id.toString().padStart(3, "0");

export function Modal({ isOpen, onClose, pokemon }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen && pokemon) {
      const fetchCryUrl = async () => {
        try {
          const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemon.id}.ogg`;
          if (audioRef.current) {
            audioRef.current.src = cryUrl;
            audioRef.current.play().catch((error) => {
              console.error("Error playing audio:", error);
            });
          }
        } catch (error) {
          console.error("Error fetching cry URL:", error);
        }
      };

      fetchCryUrl();

      // Clean up function to stop the audio if the modal is closed or if the component unmounts
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
  }, [isOpen, pokemon]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bg"></div>
        <div className="modal-content">
          <img
            src="/close.png"
            alt=""
            className="close-button"
            onClick={onClose}
          />
          <div className="modal-img">
            <img src={pokemon.gif} alt={pokemon.name} />
          </div>
          <div className="modal-info">
            <div className="modal-info-div modal-title">
              <p>N.° {formatPokemonId(pokemon.id)}</p>
              <p>{capitalizeFirstLetter(pokemon.name)}</p>
            </div>
            <div className="modal-info-div dark">
              <p>{pokemon.genus}</p>
            </div>
            <div className="modal-info-div dark">
              <p>Tipo</p>
              <div className="">
                {pokemon.types.map((type) => (
                  <img
                    key={type.name}
                    src={type.sprite}
                    alt={type.name}
                    className="type-sprite"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-description">
          <p>{pokemon.flavorText}</p>
        </div>
        {/* Audio element for playing Pokémon cry */}
        <audio ref={audioRef} />
      </div>
    </div>
  );
}
