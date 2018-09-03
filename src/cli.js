#!/usr/bin/env node
const mdLinks = require('./index.js');

const [,, ...args] = process.argv;
const route = args[0];

const options = {
  validate: false,
  stats: false,
};
/* eslint-disable no-console */
if (args.length === 0) {
  console.log('ingresa un ruta, ejemplo: md-links ./test/prueba \n');
}
if (args[0] && args[1] === undefined) {
  mdLinks(route, options).then((response) => {
    response.forEach((element) => {
      console.log(element.file, element.url, element.text);
    });
  });
} else if (args[0] && args[1] === '--validate' && args[2] === '--stats') {
  options.validate = true;
  options.stats = true;
  mdLinks(route, options).then((response) => {
    console.log('total: ', response.total, '\nunique: ', response.unique, '\nbroquen: ', response.broquen);
  });
} else if (args[0] && args[1] === '--validate') {
  options.validate = true;
  mdLinks(route, options).then((response) => {
    response.forEach((element) => {
      console.log(element.file, element.url, element.text, element.valido, element.status);
    });
  });
} else if (args[0] && args[1] === '--stats') {
  options.validate = false;
  options.stats = true;
  mdLinks(route, options).then((response) => {
    console.log('total: ', response.total, '\nunique: ', response.unique);
  });
} else if (args[1] !== '--validate' || args[2] !== '--stats') {
  console.log('ingresa opciones validas, ejemplo: \nmd-links ./test/prueba --validate \nmd-links ./test/prueba --stats \nmd-links ./test/prueba --validate --stats');
}
