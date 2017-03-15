#!/usr/bin/env node

var js_beautify = require('./lib/btjs').js;

console.log('/index.js');

module.exports = {
	js: js_beautify
}