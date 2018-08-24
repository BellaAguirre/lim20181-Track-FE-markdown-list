#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const async = require("async");
const [,, ...args] = process.argv;
const route = args[0];

let options = {
  validate : false,
  stats: false,
}
let arrayFile = [];
const readRoute = (route) => {
 /*  return new Promise((resolve, reject)=> {

  }) */
  fs.stat(route, (err, stats) => {
    if (err) throw err;
    if (stats.isFile()) {
      arrayFile.push(route);
      console.log(arrayFile);
      
    } else if (stats.isDirectory()) {
       fs.readdir(route, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
          readRoute(route + '/' + file);
        })
      })
    }
  })

}

readRoute(route)