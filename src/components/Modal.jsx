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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bg"></div>
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <div className="modal-img">
            <img src={pokemon.gif} alt={pokemon.name} />
          </div>
          <div className="modal-info">
            {" "}
            <h2>{pokemon.name}</h2>
            <p>ID: {pokemon.id}</p>
          </div>
        </div>

        <div className="modal-description">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum in
            dolore voluptas repudiandae obcaecati consequuntur maxime voluptatum
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
