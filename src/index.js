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
  .catch((err) => {
    callback(null, {
      ...obj,
      valido: false,
      status: 404,
    });
  })
}

const statusLink = (arrayLinks) => {
  async.map(arrayLinks, validateLink, (err, results) => {
    console.log(results);
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
const dirOrFile = (route) => {
  return new Promise((resolve, reject) => {
    resolve(
      statPath(route)
      .then(stat => {
        if (stat) return [route];
        return readDir(route)
        .then(files => files.map(file => dirOrFile(route + '/' + file)))
        .then(promises =>Promise.all(promises))
        .then(arr => flatten(arr))
      })
    );
  });
}

const  mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
    if (options.validate && options.stats) resolve(dirOrFile(route).then((response) => readFile(response)))
    else if (options.validate) resolve(dirOrFile(route).then((response) => readFile(response)).then(status => statusLink(status)))
    else if (options.stats) resolve(dirOrFile(route).then(response => readFile(response)))
  })
}

mdLinks(route, options).then(response => {
  console.log(response);
})

const flatten = (arrayFile) => {
  return arrayFile.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
module.exports = mdLinks;