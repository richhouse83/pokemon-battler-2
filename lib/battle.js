const axios = require("axios");
const inquirer = require("inquirer");
const colors = require("colors");

const pokeapi = "https://pokeapi.co/api/v2/";

const battleRound = (player1, player2, player1Go = true) => {
  if (!player1.pokeball.length || !player2.pokeball.length) return;

  const attacker = player1Go ? player1 : player2;
  const defender = player1Go ? player2 : player1;

  console.log("\nLET'S BATTLE!!\n\n".magenta);

  inquirer
    .prompt({
      name: "chooseFighter",
      type: "list",
      message: `${attacker.name}: Your turn - choose Pokemon to attack`,
      choices: attacker.pokeball,
    })
    .then(({ chooseFighter }) => {
      return axios.get(pokeapi + `/pokemon/${chooseFighter}`);
    })
    .then(({ data: { moves } }) => {
      const movesList = [];

      for (let i = 0; i < 5; i++) {
        movesList.push(moves[i].move);
      }
      console.log(movesList);
    });
};

module.exports = battleRound;
