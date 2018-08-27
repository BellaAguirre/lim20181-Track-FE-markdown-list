#!/usr/bin/env node
const dir = require('./index.js');
const [,, ...args] = process.argv;
const route = args[0];

dir(route).then(response => {
    console.log(response);

});
