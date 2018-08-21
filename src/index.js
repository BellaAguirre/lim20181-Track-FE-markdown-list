#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const [,, ...args] = process.argv;
const route = args[0];
// statusUrl(arr).then((respose)=>{})
const statusUrl = (arrayUrl) => {
  // return new Promise
 const arr = [];
  arrayUrl.map(objLink => {
   fetch(objLink.url)
    .then((response) => {
      const obj = {
        url: objLink.url,
        text: objLink.text,
        file: objLink.file,
        status: response.status
      }
        arr.push(obj)
      if(arr.length === arrayUrl.length){
        console.log(arr);
        return arr
      }
    }).then(()=>{

    })
    .catch((err) => {
      const obj = {
        url: objLink.url,
        text: objLink.text,
        file: objLink.file,
        status: 'fail'
      }
       arr.push(obj);
      // console.log(obj);
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
          // const initial = ele.indexOf('[');
          const final = ele.indexOf(']');
          const obj = {
            url: ele.slice(final + 2, ele.length - 1),
            text: ele.slice(1, final),
            file: path.resolve(routeFile)
          }
          arrayUrl.push(obj);
          // console.log(obj);
        });
       }
      statusUrl(arrayUrl); 
    });
  }
}
const readDir = (route) => {
  fs.readdir(route, (err, files) => {
    // console.log(files)
    if (err) throw err;
    for (const item of files) {
      // console.log(route+'/'+item)
      fs.stat ((route+'/'+item),(err, stats) => {
        if(stats.isFile()) {
          console.log('es file')
          readFileUrl(route+'/'+item);
        } 
        if(stats.isDirectory()) {
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
