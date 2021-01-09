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

      for (let i = 0; i < Math.min(moves.length, 5); i++) {
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

const determineOutcome = (attacker, defender) => {
  console.log(
    `\n\n${
      attacker.currentPokemon.name
    }'s ${attacker.currentMove.name.toUpperCase()} vs ${
      defender.currentPokemon.name
    }'s ${defender.currentMove.name.toUpperCase()}!\n\n`
  );
  let chanceOfSuccess = Math.floor(Math.random() * 100);
  console.log(chanceOfSuccess, attacker.currentMove.accuracy);

  if (attacker.currentMove.accuracy >= chanceOfSuccess) {
    console.log(
      `${attacker.currentPokemon.name} lands a hit! ${defender.currentPokemon.name} loses ${attacker.currentMove.power} health.`
    );
    defender.currentPokemon.health -= attacker.currentMove.power;
    console.log(
      `${defender.currentPokemon.name} now has ${
        defender.currentPokemon.health > 0 ? defender.currentPokemon.health : 0
      } health left`
    );
  } else {
    console.log(`${defender.currentPokemon.name} deflects the attack!`);
  }
  if (defender.currentPokemon.health < 0) {
    console.log(`${defender.currentPokemon.name} faints!`);
    defender.pokeball = defender.pokeball.filter(
      (pokemon) => pokemon.name != defender.currentPokemon.name
    );
    defender.currentPokemon = null;
  }
};

const checkContinue = (player) => {
  let answer;
  if (player.currentPokemon) {
    answer = inquirer.prompt({
      name: "change",
      type: "confirm",
      message: `${player.name}: change Pokemon?`,
    });
  } else answer = { change: true };

  return Promise.all([answer]);
};

const battleRound = (player1, player2, player1Go = true) => {
  if (!player1.pokeball.length || !player2.pokeball.length) {
    console.log("Battle Over");
    return;
  }

  const attacker = player1Go ? player1 : player2;
  const defender = player1Go ? player2 : player1;

  console.log("\nLET'S BATTLE!!".bgMagenta);
  return checkContinue(attacker)
    .then(([{ change }]) => {
      let answer;
      if (change) {
        answer = pickPokemon(attacker);
      } else answer = "continue";
      return Promise.all([answer]);
    })
    .then(() => {
      return checkContinue(defender);
    })
    .then(([{ change }]) => {
      let answer;
      if (change) {
        answer = pickPokemon(defender);
      } else answer = "continue";
      return Promise.all([answer]);
    })
    .then(() => {
      return chooseMove(attacker);
    })
    .then(() => {
      return chooseMove(defender);
    })
    .then(() => {
      determineOutcome(attacker, defender);
      if (defender.currentPokemon) {
        determineOutcome(defender, attacker);
      }
      return battleRound(defender, attacker);
    })
    .catch((err) => {
      console.log("Error in game, please try again", err);
    });
};

module.exports = battleRound;
