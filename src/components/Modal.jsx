import React, { useState, useEffect } from "react";
import "./Modal.css"; // Asegúrate de agregar estilos para el modal

const Modal = ({ isOpen, onClose, pokemon }) => {
  useEffect(() => {
    if (isOpen && pokemon) {
      const fetchCryUrl = async () => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
          );
          const data = await response.json();
          // Asumimos que la URL del grito se puede encontrar en un campo adecuado
          // En este ejemplo, cambiamos a una URL directa para el sonido
          const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemon.id}.ogg`; // Cambia esto si tienes una URL diferente
          const audio = new Audio(cryUrl);
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        } catch (error) {
          console.error("Error fetching cry URL:", error);
        }
      };

      fetchCryUrl();

      // Clean up function to stop the audio if the modal is closed
      return () => {
        const audio = new Audio();
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isOpen, pokemon]);

  if (!isOpen) return null;

  // Function to capitalize the first letter of the Pokémon name
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Function to format Pokémon ID with leading zeros
  const formatPokemonId = (id) => {
    return id.toString().padStart(3, "0"); // Asegúrate de que el ID tenga 3 dígitos
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bg"></div>
        <div className="modal-content">
          <span className="close-button dark" onClick={onClose}>
            &times;
          </span>
          <div className="modal-img">
            <img src={pokemon.gif} alt={pokemon.name} />
          </div>
          <div className="modal-info">
            <div className="modal-info-div modal-title">
              <p>N.° {formatPokemonId(pokemon.id)}</p>{" "}
              {/* Formatea el ID aquí */}
              <p>{capitalizeFirstLetter(pokemon.name)}</p>{" "}
              {/* Capitaliza el nombre aquí */}
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
                    src={type.sprite} // Muestra el sprite del tipo
                    alt={type.name}
                    className="type-sprite"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-description">
          <p>{pokemon.flavorText}</p> {/* Muestra el flavorText aquí */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
