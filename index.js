import express, { json, urlencoded } from "express";
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

import pokemonRuta from "./routes/pokemon.js";
app.use("/pokemon", pokemonRuta);

import combateRuta from "./routes/combate.js";
app.use("/combate", combateRuta);

app.listen(
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  }),
);
