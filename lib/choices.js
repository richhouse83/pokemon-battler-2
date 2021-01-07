const axios = require("axios");
const inquirer = require("inquirer");
const colors = require("colors");

const pokeapi = "https://pokeapi.co/api/v2/";

const choosePokemon = async (player, types) => {
  if (player.pokeball.length === 3) return;
  console.log(`\n${player.name}: Pokemon #${player.pokeball.length + 1}`.green);
  const pokemon = await inquirer
    .prompt({
      name: "typeChoice",
      type: "list",
      message: `Type?`,
      choices: types.list,
      loop: false,
    })
    .then(({ typeChoice }) => {
      console.log(typeChoice);
      return axios.get(pokeapi + "type/" + typeChoice);
    })
    .then(({ data: { pokemon } }) => {
      const pokemonList = [];

      for (let i = 0; i < 20; i++) {
        pokemonList.push({
          name: pokemon[i].pokemon.name,
          url: pokemon[i].pokemon.url,
        });
      }

      const pokemonChoice = inquirer.prompt({
        name: "pokemonChoice",
        type: "list",
        message: "Choose Your Pokemon!",
        choices: pokemonList,
        loop: false,
      });

      return Promise.all([pokemonChoice, pokemonList]);
    })
    .then((promiseArray) => {
      const chosenPokemon = promiseArray[1].find(
        (pokemon) => promiseArray[0].pokemonChoice === pokemon.name
      );
      player.pokeball.push({
        name: chosenPokemon.name,
        url: chosenPokemon.url,
        health: 1000,
      });
      return choosePokemon(player, types);
    })
    .catch((err) => console.log(err));
};

module.exports = { choosePokemon };
