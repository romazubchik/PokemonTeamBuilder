// App.tsx
import React, { useState } from 'react';
import Select from './components/Select';
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { Pokemon, getPokemonDetails, PokemonDetailsResponse } from './services/pokeApi';
import Modal from 'react-modal';

export interface FormValues {
  firstName: string;
  lastName: string;
  pokemon: { name: string }[];
}

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<FormValues['pokemon']>([]);
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPokemonImages, setSelectedPokemonImages] = useState<string[]>([]);
  const [trainerInfo, setTrainerInfo] = useState({ firstName: '', lastName: '' });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.pokemon.length !== 4) {
      // Встановлюємо помилку для поля pokemon, яка буде показана в SelectComponent
      setValue('pokemon', [], { shouldValidate: true });
      return;
    }

    setTrainerInfo({
      firstName: data.firstName,
      lastName: data.lastName,
    });

    await handleSelect(data);
    setModalIsOpen(true);
  };

  const handleSelect = async (selectedValues: FormValues) => {
    try {
      const images: string[] = await Promise.all(
        selectedValues.pokemon.map(async (pokemon) => {
          const details: PokemonDetailsResponse = await getPokemonDetails(pokemon.name);
          return details.sprites.front_default;
        })
      );
      setSelectedPokemonImages(images);
      setSelectedPokemon(selectedValues.pokemon);
    } catch (error) {
      console.error('Error fetching details for selected Pokemon:', error);
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="bg-gray-800 text-gray-200 p-4 min-h-screen flex flex-col items-center justify-center">
      <p className="text-2xl font-bold mb-4">Luna Edge</p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-8 rounded shadow-lg">
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name:
          </label>
          <input
            {...register('firstName', {
              required: 'This field is required',
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
              maxLength: {
                value: 12,
                message: 'Must be no more than 12 characters',
              },
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: 'Must contain only letters',
              },
            })}
            id="firstName"
            type="text"
            placeholder="Enter first name"
            className="input input-bordered input-info w-full p-2 rounded border border-gray-300"
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name:
          </label>
          <input
            {...register('lastName', {
              required: 'This field is required',
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
              maxLength: {
                value: 12,
                message: 'Must be no more than 12 characters',
              },
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: 'Must contain only letters',
              },
            })}
            id="lastName"
            type="text"
            placeholder="Enter last name"
            className="input input-bordered input-info w-full p-2 rounded border border-gray-300"
          />
          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
        </div>

        <Select register={register} setValue={setValue} onSelect={handleSelect} />

        <button
          type="button"
          onClick={() => handleSubmit(onSubmit)()}
          className="btn btn-info w-full p-3 mt-4 h-10 bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Next
        </button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        contentLabel="Trainer Info and Pokemon Images"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-4 p-4 bg-white rounded shadow-md"
        overlayClassName="fixed inset-0 bg-black opacity-100 flex items-center justify-center"
      >
        <div className="mb-4">
        <h1 className="text-center text-3xl font-bold">The Battle Tower</h1>
          <h2 className="text-2xl font-bold">Trainer Info</h2>
          <p>First Name: {trainerInfo.firstName}</p>
          <p>Last Name: {trainerInfo.lastName}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold">Selected Pokemon </h2>
          <div className="flex">
            {selectedPokemonImages.map((image, index) => (
              <img key={index} src={image} alt={`Pokemon ${index + 1}`} className="mr-2" />
            ))}
          </div>
        </div>

        <button onClick={handleModalClose} className="absolute top-0 right-0 m-4 text-3xl font-bold cursor-pointer">
          &times;
        </button>
      </Modal>
    </div>
  );
}

export default App;
