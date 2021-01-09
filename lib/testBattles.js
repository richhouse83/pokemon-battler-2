const battleRound = require("./battle");

const player1 = {
  name: "player1",
  pokeball: [
    {
      name: "pidgeot",
      url: "https://pokeapi.co/api/v2/pokemon/18/",
      health: 10,
    },
    {
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
      health: 10,
    },
    {
      name: "venusaur",
      url: "https://pokeapi.co/api/v2/pokemon/3/",
      health: 10,
    },
  ],
};
const player2 = {
  name: "player2",
  pokeball: [
    {
      name: "pidgeotto",
      url: "https://pokeapi.co/api/v2/pokemon/17/",
      health: 1000,
    },
    {
      name: "weedle",
      url: "https://pokeapi.co/api/v2/pokemon/13/",
      health: 1000,
    },
    {
      name: "primeape",
      url: "https://pokeapi.co/api/v2/pokemon/57/",
      health: 1000,
    },
  ],
};

battleRound(player1, player2);
