// src/App.js
import React, { useState, useEffect } from "react";
import { Modal } from "./components/Modal";
import { Pokeball } from "./components/Pokeball";
import { PokemonCard } from "./components/PokemonCard";
import "./App.css"; // Asegúrate de tener tus estilos aquí
import "./fonts.css";

// Constantes para los sprites de tipos de Pokémon
const TYPE_SPRITES = {
  fire: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/10.png",
  water:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/11.png",
  grass:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/12.png",
  electric:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/13.png",
  ice: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/15.png",
  fighting:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/2.png",
  poison:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/4.png",
  ground:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/5.png",
  flying:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/3.png",
  psychic:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/14.png",
  bug: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/7.png",
  rock: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/6.png",
  ghost:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/8.png",
  dragon:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/16.png",
  dark: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/17.png",
  steel:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/9.png",
  fairy:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/18.png",
  normal:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/1.png",
};

// Helper functions
const formatPokemonId = (id) => id.toString().padStart(3, "0");

const fetchPokemonsData = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=807");
    const { results: pokemons } = await response.json();

    const detailedPokemons = await Promise.all(
      pokemons.map(async ({ url }) => {
        const pokemonResponse = await fetch(url);
        const pokemonData = await pokemonResponse.json();
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();

        const flavorTextEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "es"
        );
        const genusEntry = speciesData.genera.find(
          (entry) => entry.language.name === "es"
        );

        return {
          id: pokemonData.id,
          name: pokemonData.name,
          gif: pokemonData.sprites.other.showdown.front_default,
          image: pokemonData.sprites.front_default,
          icon:
            pokemonData.sprites.versions["generation-vii"].icons
              .front_default || pokemonData.sprites.front_default,
          flavorText:
            flavorTextEntry?.flavor_text ||
            "No hay texto disponible en español",
          genus: genusEntry?.genus || "No hay género disponible en español",
          types: pokemonData.types.map(({ type }) => ({
            name: type.name,
            sprite:
              TYPE_SPRITES[type.name] || "https://example.com/default.png",
          })),
        };
      })
    );

    return detailedPokemons;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return [];
  }
};

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsHidden(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  useEffect(() => {
    (async () => {
      const pokemonsData = await fetchPokemonsData();
      setPokemons(pokemonsData);
    })();
  }, []);

  const handleImageClick = () => {
    if (!isClicked) {
      setIsClicked(true);
      setIsExpanded(true);
      setTimeout(() => setShowCards(true), 5);
    }
  };

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  return (
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
        {showCards && (
          <div className="cards-container">
            {pokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => openModal(pokemon)}
              />
            ))}
          </div>
        )}
        <Pokeball isClicked={isClicked} isHidden={isHidden} />
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
  );
}

export default App;
