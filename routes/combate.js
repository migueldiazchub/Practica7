const express = require("express");
const router = express.Router();

// Tendremos un objeto declarado como constante en nuestro backend (lo podremos añadir a
// req como req.combates en un middleware)
// const combates = [];
// Aquí guardaremos una lista de los combates simultáneos que están teniendo lugar para
// poder mantenerlos organizados. Es importante que cada combate tenga un identificador
// único.

const combates = [];

// Los combates serán objetos con el siguiente formato:
// {
// "id": 1,
// "pokemon1": {
//      "nombre": "Pikachu",
//      "vida": 100
// },
// "pokemon2": {
//      "nombre": "Charmander",
//      "vida": 100
// },
// "turno": 1,
// "ganador": null
// }

module.exports = router;
