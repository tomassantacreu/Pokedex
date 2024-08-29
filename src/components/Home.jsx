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

  // Listado de sprites de tipos de Pokémon
  const [typeSprites, setTypeSprites] = useState({
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
    // Agrega más tipos aquí si es necesario
  });

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

            // Obtener la información de la especie
            const speciesRes = await fetch(pokemonData.species.url);
            const speciesData = await speciesRes.json();

            // Obtener el flavor_text en español
            const flavorTextEntry = speciesData.flavor_text_entries.find(
              (entry) => entry.language.name === "es"
            );
            const flavorText = flavorTextEntry
              ? flavorTextEntry.flavor_text
              : "No hay texto disponible en español";

            // Obtener el genus en español
            const genusEntry = speciesData.genera.find(
              (entry) => entry.language.name === "es"
            );
            const genus = genusEntry
              ? genusEntry.genus
              : "No hay género disponible en español";

            // Obtener los tipos y sus sprites
            const types = pokemonData.types.map((typeInfo) => ({
              name: typeInfo.type.name,
              sprite:
                typeSprites[typeInfo.type.name] ||
                "https://example.com/default.png", // Usa el sprite del estado
            }));

            return {
              id: pokemonData.id,
              name: pokemonData.name,
              gif: pokemonData.sprites.other.showdown.front_default,
              image: pokemonData.sprites.front_default,
              icon:
                pokemonData.sprites.versions["generation-vii"].icons
                  .front_default || pokemonData.sprites.front_default,
              flavorText: flavorText,
              genus: genus,
              types: types, // Añade los tipos y sprites aquí
            };
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemons();
  }, [typeSprites]);

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  // Function to format Pokémon ID with leading zeros
  const formatPokemonId = (id) => {
    return id.toString().padStart(3, "0"); // Asegúrate de que el ID tenga 3 dígitos
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
                  <p>{formatPokemonId(pokemon.id)}</p>{" "}
                  {/* Formatea el ID aquí */}
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
