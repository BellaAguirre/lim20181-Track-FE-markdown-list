#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const async = require("async");
const [,, ...args] = process.argv;
const route = args[0];
// statusUrl(arr).then((respose)=>{})
const linksStatus = (arr) => {
  // console.log(arr);
  
}
const statusUrl = (objet) => {
  // return new Promise
let arr = [];
objet.map(obje => {
  fetch(obje.url)
  .then((response) => {
    const obj = {
      url: obje.url,
      text: obje.text,
      file: obje.file,
      status: response.status
    }
    arr.push(obj);
    if (objet.length === arr.length)
    // console.log(arr)
    linksStatus(arr);
    return (arr);
  })
  .catch((err) => {
    const obj = {
      url: obje.url,
      text: obje.text,
      file: obje.file,
      status: 'fail'
    }
      arr.push(obj);
  })
})
  
}

const readFileUrl = (routeFile) => {
  const arrayUrl = [];
  if (path.extname(routeFile) === '.md') {
    console.log('es md');
    fs.readFile(routeFile,'utf8',(err, data) => {
      if (err) throw err;
      const exp = /\[(.*?)\]\(.*?\)/gm;
      const dataFile = data.match(exp);
      if(dataFile !== null) {
        dataFile.forEach(ele => {
          const final = ele.indexOf(']');
          const obj = {
            url: ele.slice(final + 2, ele.length - 1),
            text: ele.slice(1, final),
            file: path.resolve(routeFile)
          }
          arrayUrl.push(obj);
        });
       }
      // statusUrl(arrayUrl);
    });
  }
}
const readDir = (route) => {
  fs.readdir(route, (err, files) => {
    if (err) throw err;
    for (const item of files) {
      fs.stat ((route+'/'+item),(err, stats) => {
        if(stats.isFile()) {
          console.log('es file')
          readFileUrl(route+'/'+item);
        } else if(stats.isDirectory()) {
          console.log('es directorio')
          readDir(route+'/'+item);
        }
      })
    }
  });
}
fs.stat (route, (err, stats) => {
  if (err) {
    console.log(err);
  } else if (stats.isFile()) {
    console.log('es file');
    readFileUrl(route);
  } else {
    console.log('es directorio');
    readDir(route)
  }
})
