'use strict';
const fs = require('fs');
const Path = require('path');
const EventEmitter = require('events').EventEmitter;
const NODE_ENV = process.env.NODE_ENV;
var Models = require('./api');

var exports = {};

var files = listAllFiles(Path.resolve(__dirname, '../server/api'));

files.forEach(file => {
	var model = require(file);
	Object.keys(model).forEach(key => {
		exports[key] = model[key];
	});
});

function exportAllMethod() {
	Object.keys(Models).forEach(server => {
		if (Models[server] instanceof EventEmitter) {
			Object.keys(Models[server]).forEach(method => {
				if (['init', 'invoke', '_methods', 'namspace', '_events', '_eventsCount', '_maxListeners', 'domain'].indexOf(method) > -1) {
					return;
				}

				if (!exports[method]) {
					exports[method] = Models[server][method];
				}
			});
		} else {
			if(NODE_ENV === 'mock'){
				return ;
			}
			Object.getOwnPropertyNames(Models[server].constructor.prototype).forEach(method => {
				if(method === 'constructor'){
					return ;
				}

				if (!exports[method]) {
					exports[method] = Models[server][method];
				}
			});
		}
	});
}

function listAllFiles(path, cb) {
	var rs = [];
	var stat = fs.statSync(path);
	if (stat.isFile() && Path.extname(path) === '.js') {
		rs.push(path);
		return rs;
	}
	if (!stat.isDirectory()) throw new Error('path must be file or directory');
	var files = fs.readdirSync(path);
	var tpath;
	files.forEach(function (file) {
		tpath = Path.resolve(path, file);
		stat = fs.statSync(tpath);
		if (stat.isDirectory()) {
			rs = rs.concat(listAllFiles(tpath));
		}
		if (stat.isFile() && Path.extname(file) === '.js') {
			rs.push(tpath)
		}
	});
	return rs;
}

exportAllMethod();

module.exports = exports;