import { Router } from "express";
const router = Router();

//este archivo contiene funciones de la Práctica 4 usadas para conseguir
//las relaciones entre los tipos gracias a la pokeapi
import { golpe } from "../assets/efectividad.js";

//se tiene que importar la lista de la ruta de pokemon.js porque se actualiza
//otra posibilidad sería tener métodos que reescriben sobre el json de los pokemon
import { listaPokemon } from "./pokemon.js";

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

/**
 * Recibe el int de id de un combate y devuelve dicho combate si existe o un booleano false si no existe
 * @param {number} id 
 * @returns {(Object|boolean)}
 */

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
  
  //este tipo de comprobación es el motivo por el que la función getCombate() puede devolver un false
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

/**
 * Crea un int que va incrementando tras recorrer la lista de combates.
 * Devuelve el número más bajo que no esté siendo utilizado actualmente 
 * como id para un combate
 * @returns {number} 
 */

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

/**
 * Recibe un string con el nombre de un pokemon y comprueba si existe un pokemon con ese nombre.
 * Si existe devuelve el objeto para ese pokemon y si no existe devuelve un booleano false
 * @param {string} nombrePokemon 
 * @returns {(Object|boolean)}
 */

function getDatosPokemon(nombrePokemon) {
  for (let pokemon of listaPokemon) {
    if (pokemon.nombre.toLowerCase() == nombrePokemon.toLowerCase()) {
      return pokemon;
    }
  }
  return false;
}

router.post("/nuevo", (req, res) => {
  const { pokemon1, pokemon2 } = req.body;
  let datosPokemon1 = getDatosPokemon(pokemon1);
  let datosPokemon2 = getDatosPokemon(pokemon2);

  if (!datosPokemon1 || !datosPokemon2) {
    res.status(400);
    res.json({
      status: "error",
      motivo: "uno de los pokemon no existe",
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

router.post("/ataque/:id", async (req, res) => {
  const {ataque} = req.body;
  const combate = getCombate(req.params.id);

  //declarado el índice del combate para poder actualizarlo con splice más adelante
  const indiceCombate = combates.indexOf(combate);

  if (!combate) {
    res.status(400);
    res.json({
      status: "error",
      motivo: "combate no encontrado",
    });

  } else if(combate.turno == null){
    res.status(400);
    res.json({
      status: "error",
      motivo: "el combate ha terminado",
    });

  } else {
    let atacante; let defensor;
    if(combate.turno == 1) {
      atacante = getDatosPokemon(combate.pokemon1.nombre);
      defensor = getDatosPokemon(combate.pokemon2.nombre);
    } else {
      atacante = getDatosPokemon(combate.pokemon2.nombre);
      defensor = getDatosPokemon(combate.pokemon1.nombre);
    }

    let ataqueExiste = false;
    let potenciaAtaque = 0;
    for(let ataquePokemon of atacante.ataques){
      if(ataquePokemon.nombre.toLowerCase() == ataque.toLowerCase()){
        ataqueExiste = true;
        potenciaAtaque = ataquePokemon.potencia;
        break;
      }
    }

    if(!ataqueExiste){
      res.status(400);
      res.json({
        status: "error",
        motivo: "ataque no encontrado",
      });

    } else {
      let damage = await golpe(atacante, defensor, potenciaAtaque);

      //cambia el turno para siguientes ataques y resta la vida al pokemon defensor
      if(combate.turno == 1){
        combate.turno = 2;
        combate.pokemon2.vida -= damage;
        if(combate.pokemon2.vida <= 0){
          //si la vida baja a 0 o menos, la pone en 0 como mínimo
          combate.pokemon2.vida = 0;

          //también declara al atacante como ganador y pone el turno en null porque
          //no habrá una siguiente ronda
          combate.ganador = combate.pokemon1.nombre;
          combate.turno = null;
        }
      } else {
        combate.turno = 1;
        combate.pokemon1.vida -= damage;
        if(combate.pokemon1.vida <= 0){
          combate.pokemon1.vida = 0;

          combate.ganador = combate.pokemon2.nombre;
          combate.turno = null;
        }
      }

      //actualiza el objeto en la lista de combates
      combates.splice(indiceCombate, 1, combate);

      res.status(200);
      res.json({
        "status": "ok",
        "golpe": damage
      });
    }
  }
});

//en la práctica pone post, pero delete parecía más apropiado
router.delete("/borrar/:id", (req, res) => {
  const combate = getCombate(req.params.id);
  const indiceCombate = combates.indexOf(combate);

  if(!combate){
    res.status(400);
    res.json({
      status: "error",
      motivo: "combate no encontrado",
    });

  } else {
    combates.splice(indiceCombate, 1);

    res.status(200);
    res.json({ "status": "ok"});
  }
})

export default router;
