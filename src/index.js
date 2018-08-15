const fs = require('fs');
fs.lstat ('README.md',(err,stats) => {
  console.log(stats.isFile())
})
