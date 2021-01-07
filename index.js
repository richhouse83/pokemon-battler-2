const inquirer = require("inquirer");
const colors = require("colors");
const axios = require("axios");
const battleRound = require("./lib/battle");

const { choosePokemon } = require("./lib/choices");

const pokeapi = "https://pokeapi.co/api/v2/";

console.log("\nWelcome To Pokemon Battler!\n".magenta);

const player1 = {
  pokeball: [],
};
const player2 = {
  pokeball: [],
};
const types = {};

inquirer
  .prompt({
    name: "trainer1",
    type: "input",
    message: `Trainer 1: What's your name?`,
  })
  .then(({ trainer1 }) => {
    player1.name = trainer1;
    return;
  })
  .then(() => {
    return inquirer.prompt({
      name: "trainer2",
      type: "input",
      message: `Trainer 2: What's your name?`,
    });
  })
  .then(({ trainer2 }) => {
    player2.name = trainer2;
    return axios.get(pokeapi + "type");
  })
  .then(({ data: { results } }) => {
    types.list = results;

    console.log(`\n${player1.name}! - Time to choose your pokemon!`.yellow);
    return choosePokemon(player1, types);
  })
  .then(() => {
    console.log(`\n${player2.name}! - Time to choose your pokemon!`.yellow);
    return choosePokemon(player2, types);
  })
  .then(() => {
    battleRound(player1, player2);
  });
