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
          const dataFile = data.match(exp);
          dataFile.forEach(ele => {
            const initial = ele.indexOf('http');
            const final = ele.indexOf(')');
            console.log(ele.slice(initial,final));
          })

      });
    }
  } else {
    console.log('es directorio')
  }
})
