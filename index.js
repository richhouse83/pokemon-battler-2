const inquirer = require("inquirer");
const coloers = require("colors");
const axios = require("axios");

const pokeapi = "https://pokeapi.co/api/v2/";

console.log("\nWelcome To Pokemon Battler!\n".magenta);

const getTypes = async () => {
  const types = await axios
    .get(pokeapi + "type")
    .then(({ data: { results } }) => results);

  return types;
};

getTypes()
  .then((types) => {
    return inquirer.prompt({
      name: "typeChoice",
      type: "list",
      message: `Which Type of Pokemon?`,
      choices: types,
    });
  })
  .then(({ typeChoice }) => {
    console.log(typeChoice);
    return axios.get(pokeapi + "type/" + typeChoice);
  })
  .then(({ data: { pokemon } }) => {
    const pokemonList = pokemon.map((pokemon) => {
      return { name: pokemon.pokemon.name, url: pokemon.pokemon.url };
    });
    const pokemonChoice = inquirer.prompt({
      name: "pokemonChoice",
      type: "list",
      message: "Choose Your Pokemon!",
      choices: pokemonList,
    });

    return Promise.all([pokemonChoice, pokemonList]);
  })
  .then((promiseArray) => {
    const chosenObj = promiseArray[1].filter(
      (pokemon) => promiseArray[0].pokemonChoice === pokemon.name
    )[0];
    return axios.get(chosenObj.url);
  })
  .then(({ data }) => {
    console.log(data);
    return { name: data.name, moves: data.moves };
  })
  .then((pokemon1) => {
    console.log(pokemon1, pokemon1.moves);
  });
