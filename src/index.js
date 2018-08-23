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

// const  mdLinks = (url, {})

const mdLinks = (route, options, arr) => {
  if (options.validate) {
    arr.forEach(link => {
      console.log(link.file + ' ' + link.url + ' ' + link.status )
    })
    options.validate = false;
  } else if (options.stats) {
    let count = 0;
    // console.log(arr.length + 'total ' + count  + 'unicos ') 
  }
}

const mdObjectLinks = (arr) => {
  // console.log(arr);
  // console.log(args[1]);
  
  if (args[1] === '--validate') {
    options.validate = true;
    mdLinks(route, options, arr)
  } else if (args[1] === '--stats') {
    
    options.stats = true;
    mdLinks(route, options, arr)
  }
  
}

const validateLink = (obj, cb) => {
  fetch(obj.url)
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        cb(null, {
          ...obj,
          valido: true,
          status: response.status,
        })
      } else {
        cb(null, {
          ...obj,
          valido: false,
          status: response.status,
        })
      }
    })
  .catch((err) => {
    cb(null, {
      ...obj,
      valido: false,
      status: 404,
    });
  })
}

const statusLink = (arrayLinks) => {
  async.map(arrayLinks, validateLink, (err, results) => {
    // console.log(results)
    return results;
  })
}

const readFile = (arrayFile) => {
  const arrayLink = [];
  for (const file of arrayFile) {
    if (path.extname(file) === '.md') {
      const read = fs.readFileSync(file,'utf8');
      const exp = /\[(.*?)\]\(.*?\)/gm;
      const dataFile = read.match(exp);
      dataFile.forEach(ele => {
        // const initial = ele.indexOf('[');
        const final = ele.indexOf(']');
        const obj = {
          url:ele.slice(final + 2, ele.length - 1),
          text: ele.slice(1, final),
          file: path.resolve(file)
        }
        arrayLink.push(obj);
      });
    }
  }
  return arrayLink;
}

const readDir = (routeRead) => {
  let arr = [];
  const files = fs.readdirSync(routeRead, 'utf8');
  for (const file of files) {
    const stat = fs.statSync(routeRead + '/' + file);
    if (stat.isFile()) {
      arr.push(routeRead + '/' + file);
    } 
    if (stat.isDirectory()) {
      arr = arr.concat(readDir(routeRead + '/' + file));
    }
  }
  return arr
}


try {
  const arrayFile = [];
  const stat = fs.statSync(route);
  if (stat.isFile()) {
    arrayFile.push(route);
    const links = readFile(arrayFile);
    statusLink(links);
  }
  if (stat.isDirectory()) {
    const files = readDir(route);
    const links = readFile(files);
    statusLink(links);
    console.log(statusLink(links));
    
  }

} catch (err) {
  throw err.path + 'esta ruta no existe';
}

