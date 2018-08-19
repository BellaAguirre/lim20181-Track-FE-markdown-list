#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const [,, ...args] = process.argv;
const route = args[0];
const readFileUrl = (routeFile) => {
  if (path.extname(routeFile) === '.md') {
    console.log('es md');
    fs.readFile(routeFile,'utf8',(err, data) => {
      const exp = /\[(.*?)\]\(.*?\)/gm;
        const dataFile = data.match(exp);
        dataFile.forEach(ele => {
          const initial = ele.indexOf('[');
          const final = ele.indexOf(']');
          const obj = {
            url:ele.slice(final + 2, ele.length - 1),
            text: ele.slice(1, final),
            file: path.resolve(routeFile)
          }
          console.log(obj);
        });
    });
  }
}
fs.stat (route, (err, stats) => {
  if (err) {
    console.log(err);
  } else if (stats.isFile()) {
    console.log('es file');
    readFileUrl(route);
  } else {
    console.log('es directorio')
  }
})
