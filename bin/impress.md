#!/usr/bin/env node

var impressmd = require('../');

if (!module.parent) {

  var argv = process.argv;

  process.title = 'impress.md';

  if(argv.length < 3) {
    console.log("Usage impress.md <file>");
    process.exit(1);
    return;
  }

  impressmd(process.argv[2])
    .then(function(html) {
      console.log(html)
      process.exit(0);
    }, function(err) {
      console.log(err)
      process.exit(2);
    });

} else {
  module.exports = impressmd;
}
