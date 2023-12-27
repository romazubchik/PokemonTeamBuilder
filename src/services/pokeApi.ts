// src/services/pokeApi.ts
import axios from 'axios';

export interface Pokemon {
  url: string;
  name: string;
}

interface ApiResponse {
  results: Pokemon[];
}

export const getPokemonList = async (): Promise<Pokemon[]> => {
  try {
    const response = await axios.get<ApiResponse>('https://pokeapi.co/api/v2/pokemon');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

export interface PokemonDetailsResponse {
  sprites: {
    front_default: string;
  };
}

export const getPokemonDetails = async (name: string): Promise<PokemonDetailsResponse> => {
  try {
    const response = await axios.get<PokemonDetailsResponse>(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon details for ${name}:`, error);
    throw error;
  }
};