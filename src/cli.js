#!/usr/bin/env node
const mdLinks = require('./index.js');
const [,, ...args] = process.argv
const route = args[0]

const options = {
  validate: false,
  stats: false,
};

if (args.length === 0) {
  console.log('ingresa un ruta ');
}
if (args[0] && args[1] === undefined) {
  options.validate = false;
  options.stats = false;
  mdLinks(route, options).then(response => {
    response.forEach(element => {
      console.log(element.file + ' ' + element.url + ' ' + element.text);
    });
  });
} else if (args[0] && args[1] === '--validate' && args[2] === '--stats') {
  options.validate = true;
  options.stats = true;
  mdLinks(route, options).then(response => {
    console.log(response);
  })
} else if (args[0] && args[1] === '--validate') {
  options.validate = true;
  mdLinks(route, options).then(response => {
    console.log(response);
  });
} else if (args[0] && args[1] === '--stats') {
  options.validate = false;
  options.stats = true;
  mdLinks(route, options).then(response => {
    console.log(response);
  })
}