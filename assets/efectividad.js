/**
 * Recibe un tipo y devuelve su URL correspondiente de la pokeapi
 * @param {string} tipo 
 * @returns {string}
 */

function getURL(tipo){
    //Los tipos aquí están en español por consistencia con lo que se pide en la práctica
    //En la pokeapi están en inglés, por lo que aquí tienen asignados los mismos números 
    //que usa para acceder a ellos
    //De esta forma se podrá identificar cada tipo según su URL específica
    const tipos = {
        "normal": 1,
        "lucha": 2,
        "volador": 3,
        "veneno": 4,
        "tierra": 5,
        "roca": 6,
        "bicho": 7,
        "fantasma": 8,
        "acero": 9,
        "fuego": 10,
        "agua": 11,
        "planta": 12,
        "electrico": 13,
        "psiquico": 14,
        "hielo": 15,
        "dragon": 16,
        "siniestro": 17,
        "hada": 18
    };
    tipo = tipos[tipo];
    //Constante con las partes que no varían de la URL y un placeholder que
    //será sustituido por el número que corresponde
    const url = "https://pokeapi.co/api/v2/type/placeholder/";
    tipo = url.replace("placeholder", tipo.toString())
    return tipo;
};

/**
 * Recibe la url de un tipo y devuelve la sección con sus relaciones de daño
 * con otros tipos
 * @param {string} url 
 * @returns {any}
 */

async function getDamageRelations(url){
    //Debe ser asíncrona porque tanto fetch() como json() son también asíncronas y
    //es necesario que la función espere con "await" a que devuelvan el resultado
    let response = await fetch(url);
    let data = await response.json();
    return data["damage_relations"];
};

/**
 * Recibe un string con el nombre del tipo atacante y otro con el del tipo defensor
 * Los transforma a las URLs correspondientes y comprueba si en las relaciones del atacante
 * devueltas por la API aparece el tipo defensor para aplicar el modificador adecuado
 * @param {string} tipoATQ 
 * @param {string} tipoDEF 
 * @returns {number}
 */

async function efectividad(tipoATQ, tipoDEF){
    //Transforma los tipos en sus URLs de la pokeapi
    tipoATQ = getURL(tipoATQ);
    tipoDEF = getURL(tipoDEF);
    //Usa la URL del tipo atacante para ver qué interacciones tiene con otros tipos
    let relaciones = await getDamageRelations(tipoATQ);
    //Las formas de interactuar aparecen clasificadas en las propiedades de este objeto
    relaciones = {
     "muy_eficaz": relaciones["double_damage_to"],
     "poco_eficaz": relaciones["half_damage_to"],
     "inefectivo": relaciones["no_damage_to"]
    };
    //Si no encuentra ninguna interacción, el valor predeterminado es 1
    let efectividad = 1;
    //Recorre cada tipo de pokemon de cada tipo de interacción, comparando su URL con la 
    //del tipo defensor. Si alguna vez coincide, se asigna el modificador adecuado
    for(let tipo of relaciones["muy_eficaz"]){
        if(tipo.url === tipoDEF){
            efectividad = 2;
        };
    };
    for(let tipo of relaciones["poco_eficaz"]){
        if(tipo.url === tipoDEF){
            efectividad = 0.5;
        };
    };
    for(let tipo of relaciones["inefectivo"]){
        if(tipo.url === tipoDEF){
            efectividad = 0;
        };
    };
    return efectividad;
};

/**
 * Recibe objetos para un pokemon atacante y uno defensor. Calcula una cantidad de daño en base
 * sus atributos y un modificador asignado según la efectividad
 * @param {Object} atacante 
 * @param {Object} defensor 
 * @param {number} potencia 
 * @returns {number}
 */

async function golpe(atacante, defensor, potencia){
    const tipoAtaque = atacante.tipo;
    const tipoDefensa = (defensor.tipo);
    //La efectividad se obtiene con una función que hace una llamada a la pokeapi
    let modificador = await efectividad(tipoAtaque, tipoDefensa);
    //Calcula el daño del atacante
    let damage = (50 * (potencia / defensor.defensa) * modificador);
  return damage;
};

export {golpe};