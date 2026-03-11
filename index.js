const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pokemonRuta = require("./routes/pokemon");
app.use("/pokemon", pokemonRuta);

const combateRuta = require("./routes/combate");
app.use("/combate", combateRuta);
