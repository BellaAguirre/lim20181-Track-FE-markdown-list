const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const async = require('async');

const validateLink = (obj, callback) => {
  fetch(obj.url)
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        callback(null, {
          ...obj,
          valido: response.statusText,
          status: response.status,
        });
      }
    })
    .catch(() => {
      callback(null, {
        ...obj,
        valido: 'fail',
        status: 404,
      });
    });
};

const statusLink = (arrayLinks) => {
  const promise = new Promise((resolve, reject) => {
    async.map(arrayLinks, validateLink, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
  return promise;
};

const readFileMd = (arrayFile) => {
  const arrayLink = [];
  const fileMd = arrayFile.filter(file => path.extname(file) === '.md');
  if (fileMd.length !== 0) {
    fileMd.forEach((file) => {
      const read = fs.readFileSync(file, 'utf8');
      const exp = /\[(.*?)\]\(.*?\)/gm;
      const dataFile = read.match(exp);
      if (dataFile !== null) {
        dataFile.forEach((element) => {
          const final = element.indexOf(']');
          const obj = {
            url: element.slice(final + 2, element.length - 1),
            text: element.slice(1, final),
            file: path.resolve(file),
          };
          arrayLink.push(obj);
        });
      }
    });
  }
  return arrayLink;
};

const statPath = (route) => {
  const promise = new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      try {
        resolve(stats.isFile());
      } catch (e) {
        reject(err);
      }
    });
  });
  return promise;
};

const readDir = (route) => {
  const promise = new Promise((resolve, reject) => {
    fs.readdir(route, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
  return promise;
};

const flatten = (arrayFile) => {
  const newArray = arrayFile.reduce((flat, toFlatten) => {
    const flatArray = flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    return flatArray;
  }, []);
  return newArray;
};

const dirOrFile = (route) => {
  const promise = new Promise((resolve, reject) => {
    try {
      resolve(
        statPath(route)
          .then((stat) => {
            if (stat) return [route];
            return readDir(route)
              .then(files => files.map(file => dirOrFile(path.join(route, file))))
              .then(promises => Promise.all(promises))
              .then(arr => flatten(arr));
          }),
      );
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const mdLinks = (route, options) => {
  let broque = 0;
  return new Promise((resolve, reject) => {
    try {
      if (options.validate && options.stats) {
        dirOrFile(route)
          .then(response => readFileMd(response))
          .then(links => statusLink(links))
          .then((response) => {
            const linkUnique = response.map(item => item.url)
              .filter((value, index, self) => self.indexOf(value) === index);
            response.forEach((link) => {
              if (link.valido === 'fail') {
                broque = 1 + broque;
              }
            });
            resolve({ total: response.length, unique: linkUnique.length, broquen: broque });
          });
      } else if (options.validate) {
        dirOrFile(route)
          .then(response => readFileMd(response))
          .then(status => resolve(statusLink(status)));
      } else if (options.stats) {
        dirOrFile(route)
          .then(response => readFileMd(response))
          .then((response) => {
            const linkUnique = response.map(item => item.url)
              .filter((value, index, self) => self.indexOf(value) === index);
            resolve({ total: response.length, unique: linkUnique.length });
          });
      } else dirOrFile(route).then(response => resolve(readFileMd(response)));
    } catch (err) {
      reject(err.message);
    }
  });
};

module.exports = mdLinks;
