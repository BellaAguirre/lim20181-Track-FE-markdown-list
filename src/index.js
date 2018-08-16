const fs = require('fs');
const path = require('path');

const route = 'README.md';
fs.lstat (route, (err, stats) => {
  if (stats.isFile()) {
    console.log('es file');
    if (path.extname(route) === '.md') {
      console.log('es md');
      fs.readFile(route,'utf8',(err, data) => {
        console.log(data);
      });
    }
  } else {
    console.log('es directorio')
  }
})
