// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const async = require("async");

const validateLink = (obj, callback) => {
  fetch(obj.url)
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        callback(null, {
          ...obj,
          valido: true,
          status: response.status,
        });
      } else {
        callback(null, {
          ...obj,
          valido: false,
          status: response.status,
        });
      }
    })
    .catch(() => {
      callback(null, {
        ...obj,
        valido: false,
        status: 404,
      });
    });
}

const statusLink = (arrayLinks) => {
  return new Promise((resolve, reject) => {
    async.map(arrayLinks, validateLink, (err, results) => {
      if (err) reject(err);
      resolve(results);
    })
  })
}

const readFileMd = (arrayFile) => {
  const arrayLink = [];
  for (const file of arrayFile) {
    if (path.extname(file) === '.md') {
      const read = fs.readFileSync(file, 'utf8');
      const exp = /\[(.*?)\]\(.*?\)/gm;
      const dataFile = read.match(exp);
      dataFile.forEach(ele => {
        const final = ele.indexOf(']');
        const obj = {
          url: ele.slice(final + 2, ele.length - 1),
          text: ele.slice(1, final),
          file: path.resolve(file)
        }
        arrayLink.push(obj);
      });
    }
  }
  return arrayLink;
}

const statPath = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      if (err) reject(err);
      resolve(stats.isFile());
    });
  });
}

const readDir = (route) => {
  return new Promise((resolve, reject) => {
    fs.readdir(route, (err, files) => {
      if (err) reject(err)
      resolve(files);
    })
  });
}

const flatten = (arrayFile) => {
  return arrayFile.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const dirOrFile = (route) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        statPath(route)
          .then(stat => {
            if (stat) return [route];
            return readDir(route)
              .then(files => files.map(file => dirOrFile(route + '/' + file)))
              .then(promises => Promise.all(promises))
              .then(arr => flatten(arr))
          })
      );
    } catch (err) {
      reject(err);
    }
  });
}

const mdLinks = (route, options) => {
  let broquen = 0;
  return new Promise((resolve, reject) => {
    if (options.validate && options.stats)
      dirOrFile(route)
      .then(response => readFileMd(response))
      .then(links => statusLink(links))
      .then(response => {
        const linkUnique = response.map(item => item.url).filter((value, index, self) => self.indexOf(value) === index);
        response.forEach(link => {
          if (!link.valido) broquen++;
        });
        resolve('total: ' + response.length + ' unique: ' + linkUnique.length + ' broquen: ' + broquen);
      });
    else if (options.validate) dirOrFile(route).then((response) => readFileMd(response)).then(status => resolve(statusLink(status)))
    else if (options.stats)
    dirOrFile(route)
    .then(response => readFileMd(response))
    .then(response => {
      const linkUnique = response.map(item => item.url).filter((value, index, self) => self.indexOf(value) === index);
      resolve('total: ' + response.length + ' unique: ' + linkUnique.length);
    });
    else dirOrFile(route).then(response => resolve(readFileMd(response)));
  });
}

module.exports = mdLinks;