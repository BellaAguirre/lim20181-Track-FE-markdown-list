const fs = require('fs');
const path = require('path');

const route = 'README.md';
fs.lstat (route, (err, stats) => {
  if (stats.isFile()) {
    console.log('es file');
    if (path.extname(route) === '.md') {
      console.log('es md');
    }
  }
})
