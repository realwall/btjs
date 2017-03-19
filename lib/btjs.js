#!/usr/bin/env node

var js_beautify = require('js-beautify').js_beautify;
var cc = require('config-chain');

console.log('lib/btjs.js');

function js(str, cfg){
	debugger;
	var config = cc(cfg, {
		indent_size: 4
	}).snapshot;
	// console.log(process.env.process.env.npm_package_config_indent_size);
	// var indent_size = process.env.npm_package_config_indent_size || 4;
	return js_beautify(str, config);
}

module.exports = {
	js: js
}