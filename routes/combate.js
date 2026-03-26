import { Router } from "express";
const router = Router();

import { listaPokemon } from "./pokemon.js";

// Tendremos un objeto declarado como constante en nuestro backend (lo podremos añadir a
// req como req.combates en un middleware)
// const combates = [];
// Aquí guardaremos una lista de los combates simultáneos que están teniendo lugar para
// poder mantenerlos organizados. Es importante que cada combate tenga un identificador
// único.

const combates = [];

//método para introducir valores de combate de ejemplo en la lista
router.use("/ejemplo", (req, res, next) => {
  combates.push(
    {
      id: 1,
      pokemon1: {
        nombre: "Pikachu",
        vida: 100,
      },
      pokemon2: {
        nombre: "Charmander",
        vida: 90,
      },
      turno: 1,
      ganador: null,
    },
    {
      id: 2,
      pokemon1: {
        nombre: "Bulbasaur",
        vida: 120,
      },
      pokemon2: {
        nombre: "Squirtle",
        vida: 100,
      },
      turno: 1,
      ganador: null,
    },
  );
  res.status(200);
  res.json({ status: "ok" });
  next();
});

router.get("/lista", (req, res) => {
  res.json({ combates: combates });
});

router.get("/estado/:id", (req, res) => {
  let existe = false;
  for (let combate of combates) {
    if (combate.id == req.params.id) {
      existe = true;
      res.status(200);
      res.json({ combate: combate });
    }
  }
  if (!existe) {
    res.status(400);
    res.json({
      status: "error",
      motivo: "combate no encontrado",
    });
  }
});

//función que devuelve el número más bajo que no esté cogido de entre las ids de la lista de combates
function asignarId() {
  let id = 1;
  //booleano declarado como false para que el bucle pueda empezar
  //cuando el id esté disponible, el booleano será true y devolverá el id
  let asignar = false;
  while (!asignar) {
    //por defecto cambia a true
    asignar = true;

    //recorre la lista de combates, si el id propuesto ya existe vuelve a cambiar "asignar" a false
    //para que vuelva a probar con un nuevo id
    for (let combate of combates) {
      //si el id no existe, este if no se activa y "asignar" queda como true
      if (combate.id == id) {
        asignar = false;
        break;
      }
    }

    if (asignar) {
      return id;
    } else {
      id++;
    }
  }
}

//función que recibe un nombre de pokemon como parámetro y comprueba si existe en la lista
function comprobarPokemon(pokemon) {
  let existe = false;
  for (let pokemon of listaPokemon) {
    if (pokemon.nombre.toLowerCase() == pokemon.toLowerCase()) {
      existe = true;
      break;
    }
  }
  return existe;
}

function getDatosPokemon(pokemon) {}

router.post("/nuevo", (req, res) => {
  const { pokemon1, pokemon2 } = req.body;
  if (!comprobarPokemon(pokemon1) || !comprobarPokemon(pokemon2)) {
    res.status(400);
    res.json({
      status: "error",
      motivo: "Uno de los pokemon no existe",
    });
  }

  const nuevoCombate = {
    id: asignarId(),
    pokemon1: {
      nombre: "Pikachu",
      vida: 100,
    },
    pokemon2: {
      nombre: "Charmander",
      vida: 90,
    },
    turno: 1,
    ganador: null,
  };
});

export default router;
