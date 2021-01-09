const axios = require("axios");
const inquirer = require("inquirer");
const colors = require("colors");

const pokeapi = "https://pokeapi.co/api/v2/";

const pickPokemon = (player) => {
  return inquirer
    .prompt({
      name: "chooseFighter",
      type: "list",
      message: `${player.name}: choose Pokemon`[player.colour],
      choices: player.pokeball,
    })
    .then(({ chooseFighter }) => {
      player.currentPokemon = player.pokeball.find(
        (pokemon) => pokemon.name === chooseFighter
      );
      return axios.get(pokeapi + `/pokemon/${chooseFighter}`);
    })
    .then(({ data: { moves } }) => {
      movesList = [];

      for (let i = 0; i < Math.min(moves.length, 5); i++) {
        movesList.push(moves[i].move);
      }
      //console.log(movesList);
      const movesDetails = movesList.map((move) => {
        return axios
          .get(move.url)
          .then(({ data: { name, accuracy, power, pp } }) => {
            return { name, accuracy, power, pp: Math.floor(pp / 5) };
          });
      });
      return Promise.all(movesDetails);
    })
    .then((promiseArray) => {
      console.log(promiseArray);
      player.currentPokemon.movesList = promiseArray;
      return player;
    });
};

const chooseMove = (player) => {
  const moveChoices = player.currentPokemon.movesList.map((move) => {
    return { name: `${move.name} (${move.pp})`, value: move.name };
  });
  return inquirer
    .prompt({
      name: "chosenMove",
      type: "list",
      message: `\n${player.name}Choose ${player.currentPokemon.name}\'s Move!`[
        player.colour
      ],
      choices: moveChoices,
    })
    .then(({ chosenMove }) => {
      player.currentMove = player.currentPokemon.movesList.find(
        (move) => chosenMove === move.name
      );
      return player;
    });
};

const determineOutcome = (attacker, defender) => {
  console.log(
    `\n\n${
      attacker.currentPokemon.name
    }'s ${attacker.currentMove.name.toUpperCase()}`[attacker.colour],
    `vs`,
    `${
      defender.currentPokemon.name
    }'s ${defender.currentMove.name.toUpperCase()}!\n\n`[defender.colour]
  );
  let chanceOfSuccess = Math.floor(Math.random() * 100);
  console.log(chanceOfSuccess, attacker.currentMove.accuracy);

  if (attacker.currentMove.accuracy >= chanceOfSuccess) {
    console.log(
      `${attacker.currentPokemon.name}`[attacker.colour],
      `lands a hit! `,
      `${defender.currentPokemon.name}`[defender.colour],
      ` loses ${attacker.currentMove.power} health.\n`
    );

    defender.currentPokemon.health -= attacker.currentMove.power;
    attacker.currentMove.pp--;

    console.log(
      `${defender.currentPokemon.name}`[defender.colour],
      ` now has`,
      ` ${
        defender.currentPokemon.health > 0 ? defender.currentPokemon.health : 0
      }`[defender.colour],
      ` health left\n`
    );
  } else {
    console.log(`${defender.currentPokemon.name} deflects the attack!\n`);
  }

  if (defender.currentPokemon.health < 0) {
    console.log(`${defender.currentPokemon.name} faints!\n`);
    defender.pokeball = defender.pokeball.filter(
      (pokemon) => pokemon.name != defender.currentPokemon.name
    );
    defender.currentPokemon = null;
  }

  if (attacker.currentMove.pp <= 0) {
    console.log(
      `${
        attacker.currentPokemon.name
      }'s ${attacker.currentMove.name.toUpperCase()}`[attacker.colour],
      " has used up all of it's Power Points and is no longer available!\n"
    );
    attacker.currentPokemon.movesList = attacker.currentPokemon.movesList.filter(
      (move) => move.name !== attacker.currentMove.name
    );
  }
};

const checkContinue = (player) => {
  let answer;
  if (player.currentPokemon && player.pokeball.length > 1) {
    answer = inquirer.prompt({
      name: "change",
      type: "confirm",
      message: `${player.name}: change Pokemon?`,
    });
  } else answer = { change: true };

  return Promise.all([answer]);
};

const battleRound = (player1, player2) => {
  if (!player1.pokeball.length || !player2.pokeball.length) {
    const winner = player1.pokeball.length ? player1 : player2;
    console.log(
      "\nBattle Over!\n".yellow,
      `${winner.name.toUpperCase()} WINS!!`[winner.colour]
    );
    return;
  }

  const attacker = player1;
  const defender = player2;

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
