const express = require("express");
const router = express.Router();

const listaPokemon = require("../assets/pokemon.json");

//metodo extra para ver el json completo
router.get("/", (req, res) => {
  res.json(listaPokemon);
});

router.get("/lista", (req, res) => {
  const lista = {
    pokemon: [],
  };
  for (let pokemon of listaPokemon) {
    lista["pokemon"].push(pokemon.nombre);
  }
  res.json(lista);
});

function comprobarBodyNuevo(nuevo) {
  let mismasClaves = true;
  const referencia = listaPokemon[0];
  let numeroPropiedadReferencia = 0;

  for (let propiedad in referencia) {
  }
}

comprobarBodyNuevo();

router.post("/nuevo", (req, res) => {
  const nuevoPokemon = { ...req.body };
  listaPokemon.push(nuevoPokemon);
  res.status(200);
  res.json({ status: "ok" });
});

module.exports = router;
