#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const [,, ...args] = process.argv;
const route = args[0];

fs.lstat (route, (err, stats) => {
  if (err) throw err;
  if (stats.isFile()) {
    console.log('es file');
    if (path.extname(route) === '.md') {
      console.log('es md');
      fs.readFile(route,'utf8',(err, data) => {
        const exp = /\[(.*?)\]\(.*?\)/gm;
          const dataFile = data.match(exp);
          dataFile.forEach(ele => {
            const initial = ele.indexOf('[');
            const final = ele.indexOf(']');
            const obj = {
              url:ele.slice(final + 2, ele.length - 1),
              text: ele.slice(1, final),
              file: path.resolve(route)
            }
            console.log(obj);
            
          });
      });
    }
  } else {
    console.log('es directorio')
  }
})
