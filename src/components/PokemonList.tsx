//src.components.PokemonList.tsx
import React, { useEffect, useState } from 'react';
import { getPokemonList, Pokemon} from '../services/pokeApi';

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const list = await getPokemonList();
        setPokemonList(list);
      } catch (error) {
        console.error('Error fetching Pokemon list in component:', error);
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;