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
const statusLink = (arrayLinks) => {
  // console.log(arrayLinks);
  let arr = [];  
  arrayLinks.forEach(link => {
  fetch(link.url)
    .then((response) => {
      const obj = {
        url: link.url,
        text: link.text,
        file: link.file,
        status: response.status + ' ok'
        // ok: 'ok'
      }
      arr.push(obj);
      if (arr.length === arrayLinks.length) {
        // console.log(arr);
        mdObjectLinks(arr);
      }
      return obj;
    })
    .catch((err) => {
      const obj = {
        url: link.url,
        text: link.text,
        file: link.file,
        status: 'fail'
      }
      arr.push(obj);
      return obj;
    })
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
        const initial = ele.indexOf('[');
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
    const aa = statusLink(links);
    console.log(aa);
    
  }

} catch (err) {
  throw err.path + 'esta ruta no existe';
}

