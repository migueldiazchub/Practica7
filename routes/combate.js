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
    });
  combates.push(
    {
      id: asignarId(),
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
    });
  res.status(200);
  res.json({ status: "ok" });
  next();
});

router.get("/lista", (req, res) => {
  res.json({ combates: combates });
});

//función para comprobar si existe un combate, que devuelve false si no existe
//y devuelve los datos del combate si existe
function getCombate(id){
  let existe = false;
  for (let combate of combates) {
    if (combate.id == id) {
      existe = true;
      return combate;
    }
  }
  return existe;
}

router.get("/estado/:id", (req, res) => {
  const combate = getCombate(req.params.id);
  if(!combate){
    res.status(400);
    res.json({
      status: "error",
      motivo: "combate no encontrado",
    });
  } else {
    res.status(200);
    res.json({ combate: combate});
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

//función que recibe el nombre de un pokemon
//si existe devuelve un objeto con sus datos, si no devuelve un booleano false
function getDatosPokemon(nombrePokemon) {
  for (let pokemon of listaPokemon) {
    if (pokemon.nombre.toLowerCase() == nombrePokemon.toLowerCase()) {
      const datos = JSON.parse(JSON.stringify(pokemon));
      return datos;
    }
  }
  //si ha recorrido toda la lista sin encontrar coincidencias, devuelve false
  return false;
}

router.post("/nuevo", (req, res) => {
  const { pokemon1, pokemon2 } = req.body;
  let datosPokemon1 = getDatosPokemon(pokemon1);
  let datosPokemon2 = getDatosPokemon(pokemon2);

  //la función getDatosPokemon() devuelve false si el parámetro de nombre no coincide con 
  //ningún pokemon existente para poder hacer esta comprobación
  if (!datosPokemon1 || !datosPokemon2) {
    res.status(400);
    res.json({
      status: "error",
      motivo: "Uno de los pokemon no existe",
    });

  } else {
    const nuevoCombate = {
      id: asignarId(),
      pokemon1: {
        nombre: datosPokemon1.nombre,
        vida: datosPokemon1.vida,
      },
      pokemon2: {
        nombre: datosPokemon2.nombre,
        vida: datosPokemon2.vida,
      },
      turno: 1,
      ganador: null,
    };
    combates.splice((nuevoCombate.id - 1), 0, nuevoCombate);
    res.status(200);
    res.json({
      "status": "ok",
      "combate": nuevoCombate.id
    });
  }
});

router.post("/ataque/:id", (req, res) => {

});

export default router;
