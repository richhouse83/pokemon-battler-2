const axios = require("axios");
const inquirer = require("inquirer");
const colors = require("colors");

const pokeapi = "https://pokeapi.co/api/v2/";

const pickPokemon = (player) => {
  return inquirer
    .prompt({
      name: "chooseFighter",
      type: "list",
      message: `${player.name}: choose Pokemon`,
      choices: player.pokeball,
    })
    .then(({ chooseFighter }) => {
      player.currentPokemon = player.pokeball.find(
        (pokemon) => pokemon.name === chooseFighter
      );
      return axios.get(pokeapi + `/pokemon/${chooseFighter}`);
    })
    .then(({ data: { moves } }) => {
      player.currentPokemon.movesList = [];

      for (let i = 0; i < 5; i++) {
        player.currentPokemon.movesList.push(moves[i].move);
      }
      return player;
    });
};

const chooseMove = (player) => {
  return inquirer
    .prompt({
      name: "chosenMove",
      type: "list",
      message: `\n${player.name}Choose ${player.currentPokemon.name}\'s Move!`,
      choices: player.currentPokemon.movesList,
    })
    .then(({ chosenMove }) => {
      player.currentMove = player.currentPokemon.movesList.find(
        (move) => chosenMove === move.name
      );
      return axios.get(player.currentMove.url);
    })
    .then(({ data }) => {
      player.currentMove.power = data.power;
      player.currentMove.accuracy = data.accuracy;
      player.currentMove.pp = data.pp;
      return player;
    });
};

const battleRound = (player1, player2, player1Go = true) => {
  if (!player1.pokeball.length || !player2.pokeball.length) {
    console.log("Battle Over");
    return;
  }

  const attacker = player1Go ? player1 : player2;
  const defender = player1Go ? player2 : player1;

  console.log("\nLET'S BATTLE!!\n\n".bgmagenta);
  return pickPokemon(attacker)
    .then(() => {
      return pickPokemon(defender);
    })
    .then(() => {
      return chooseMove(attacker);
    })
    .then(() => {
      return chooseMove(defender);
    })
    .then(() => {
      console.log(
        `\n\n${
          attacker.currentPokemon.name
        }'s ${attacker.currentMove.name.toUpperCase()} vs ${
          defender.currentPokemon.name
        }'s ${defender.currentMove.name.toUpperCase()}!\n\n`
      );

      return;
    });
};
module.exports = battleRound;
