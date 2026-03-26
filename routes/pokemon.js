import { Router } from "express";
const router = Router();

import listaPokemon from "../assets/pokemon.json" with { type: "json" };

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

/**
 * Recibe el json enviado por el req.body de la petición y comprueba si tiene exactamente las
 * mismas claves que uno de los objetos de la lista de pokemon.json
 * @param {JSON} nuevoPokemon
 * @returns {Boolean}
 */

function compararClavesBody(nuevoPokemon) {
  //Object.keys() devuelve las claves del objeto introducido, .sort() está
  //para que el orden de las claves sea irrelevante
  const clavesReferencia = Object.keys(listaPokemon[0]).sort();
  const clavesNuevo = Object.keys(nuevoPokemon).sort();

  return JSON.stringify(clavesReferencia) === JSON.stringify(clavesNuevo);
}

router.post("/nuevo", (req, res) => {
  const nuevoPokemon = { ...req.body };

  if (compararClavesBody(nuevoPokemon)) {
    listaPokemon.push(nuevoPokemon);
    res.status(200);
    res.json({ status: "ok" });
  } else {
    res.status(400);
    res.json({
      status: "error",
      motivo: "los datos introducidos no son correctos",
    });
  }
});

export default router;
export { listaPokemon };
