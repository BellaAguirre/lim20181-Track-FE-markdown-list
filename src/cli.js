#!/usr/bin/env node

'use strict';

const mdLinks = require('./index.js');
const [,, ...args] = process.argv;
const route = args[0];

let options = {
  validate : false,
  stats: false,
}

if (args[0]) {
  mdLinks(route, options).then(response => {
    response.forEach(link => {
      console.log(link.file + ' ' + link.url + ' ' + link.status )
    })
  })
} else if (args[0] && args[1] !== undefined && args[1] === '--validate') {
  options.validate = true;
  mdLinks(route, options).then(response => {
    console.log(response);
  })
} else if (args[0] && args[1] !== undefined && args[1] === '--stats') {
  options.validate = false;
  options.stats = true;
  mdLinks(route, options).then(response => {
    console.log(response);
  })
} else if (args[0] && args[1] === '--validate' && args[2] === '--stats') {
  options.validate = true;
  options.stats = true;
  mdLinks(route, options).then(response => {
    console.log(response);
  })
}