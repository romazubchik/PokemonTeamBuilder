// components/Select.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Pokemon } from '../services/pokeApi';
import Select, { MultiValue, ActionMeta } from 'react-select';

type FormValues = {
  firstName: string;
  lastName: string;
  pokemon: { name: string }[];
};

export interface SelectProps {
  register: UseFormRegister<FormValues>;
  setValue: (name: keyof FormValues, value: any, options?: Partial<{ shouldValidate: boolean }>) => void;
  onSelect: (data: FormValues) => Promise<void>;
}

const SelectComponent: React.FC<SelectProps> = ({ register, setValue, onSelect }) => {
  const { formState: { errors } } = useForm<FormValues>({ shouldFocusError: false })
  const [oldPokemonList, setOldPokemonList] = useState<Pokemon[]>([]);
  const [oldFilteredPokemon, setOldFilteredPokemon] = useState<Pokemon[]>([]);
  const [oldSearchTerm, setOldSearchTerm] = useState<string>('');
  const [selectedPokemon, setSelectedPokemon] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchOldPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
        setOldPokemonList(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    };

    fetchOldPokemonList();
  }, []);

  useEffect(() => {
    setOldFilteredPokemon(
      oldPokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(oldSearchTerm.toLowerCase())
      )
    );
  }, [oldPokemonList, oldSearchTerm]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOldSearchTerm(event.target.value);
    },
    []
  );

  const handleSelectChange = (selectedOptions: MultiValue<{ value: string; label: string }>, actionMeta: ActionMeta<{ value: string; label: string }>) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setSelectedPokemon(selectedValues.map(name => ({ name })));
    setValue('pokemon', selectedValues.map(name => ({ name })));
    onSelect({
      firstName: '',
      lastName: '',
      pokemon: selectedValues.map(name => ({ name })),
    });
  };

  return (
    <div className="max-w-xs mx-auto text-center">
      <div className="relative mt-2">
        <label htmlFor="pokemon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select or search Your Pokemon Team
        </label>
        <Select
          isMulti
          options={oldFilteredPokemon.map(pokemon => ({ value: pokemon.name, label: pokemon.name }))}
          onChange={handleSelectChange}
          className={`block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            errors.pokemon ? 'border-red-500' : '' 
          }`}
        />
        {errors.pokemon && (
          <span role="alert" className="text-red-500 text-sm mt-1 block">
            {errors.pokemon.message}
          </span>
        )}
        {selectedPokemon.length !== 4 && (
          <span className="text-red-500 text-sm mt-1 block">
            Please select exactly 4 Pokemon.
          </span>
        )}
      </div>
    </div>
  );
};

export default SelectComponent;
