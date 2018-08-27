#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const async = require("async");
const mdLinks = require('./index.js');
const [,, ...args] = process.argv;
const route = args[0];

let options = {
  validate : false,
  stats: true,
}

/* const mdLinks = (route, options, arr) => {
  if (options.validate) {
    arr.forEach(link => {
      console.log(link.file + ' ' + link.url + ' ' + link.status )
    })
    options.validate = false;
  } else if (options.stats) {
    let count = 0;
    // console.log(arr.length + 'total ' + count  + 'unicos ') 
  }
} */


const mdObjectLinks = (arr) => {  
    if (args[1] === '--validate') {
      options.validate = true;
      mdLinks(route, options, arr)
    } else if (args[1] === '--stats') {
      
      options.stats = true;
      mdLinks(route, options, arr)
    }
    
  }