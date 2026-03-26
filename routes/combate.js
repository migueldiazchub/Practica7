import { Router } from "express";
const router = Router();

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

export default router;
