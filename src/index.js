#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [,, ...args] = process.argv;
const route = args[0];
fs.lstat (route, (err, stats) => {
  if (stats.isFile()) {
    console.log('es file');
    if (path.extname(route) === '.md') {
      console.log('es md');
      fs.readFile(route,'utf8',(err, data) => {
        const exp = /\[(.*?)\]\(.*?\)/gm;
        // console.log(data)
          const dataFile = data.match(exp);
          console.log(dataFile)

      });
    }
  } else {
    console.log('es directorio')
  }
})
