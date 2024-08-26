import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Asegúrate de importar el componente del modal

export function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showCards, setShowCards] = useState(false); // Nuevo estado para controlar la visibilidad de cards-container
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Estado para el Pokémon seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

  const handleImageClick = () => {
    if (!isClicked) {
      setIsClicked(true);
      setIsExpanded(true);
      setTimeout(() => {
        setShowCards(true); // Muestra cards-container después de la animación de expansión
      }, 5); // Debe coincidir con la duración de la animación CSS
    }
  };

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsHidden(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const data = await response.json();
        const pokemons = data.results;

        const detailedPokemons = await Promise.all(
          pokemons.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const pokemonData = await res.json();
            return {
              id: pokemonData.id,
              name: pokemonData.name,
              gif: pokemonData.sprites.other.showdown.front_default,
              image: pokemonData.sprites.front_default,
              icon:
                pokemonData.sprites.versions["generation-vii"].icons
                  .front_default || pokemonData.sprites.front_default,
            };
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemons();
  }, []);

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  return (
    <div className="apli">
      <div className="circles"></div>
      <div className="home">
        <div className="top">
          <img src="./top-2.png" alt="top2" className="top2" />
          <div className="spacer-top"></div>
          <img src="./top.png" alt="top" className="topimg" />
        </div>
        <div
          className={`middle ${isExpanded ? "expanded" : ""}`}
          onClick={handleImageClick}
        >
          {showCards && ( // Condicionalmente muestra cards-container basado en showCards
            <div className="cards-container">
              {pokemons.map((pokemon) => (
                <div
                  className="card"
                  key={pokemon.id}
                  onClick={() => openModal(pokemon)} // Abre el modal al hacer clic
                >
                  <img src={pokemon.icon} alt={pokemon.name} />
                  <p>{pokemon.id}</p>
                </div>
              ))}
            </div>
          )}
          <img
            src="./pokeball.png"
            alt="pokeball"
            className={`pokeball ${isClicked ? "clicked" : ""}`}
            style={{ display: isHidden ? "none" : "block" }}
          />
          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            pokemon={selectedPokemon}
          />
        </div>
        <div className="bottom">
          <img src="./bottom.png" alt="bottom" />
          <div className="spacer-bottom"></div>
          <img src="./bottom-2.png" alt="bottom2" className="bottom2" />
        </div>
      </div>
    </div>
  );
}
