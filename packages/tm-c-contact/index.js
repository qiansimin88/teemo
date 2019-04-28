const util = require('./utils');
const path = require('path');
var files = util.jsFileList( path.resolve( __dirname, './lib' ) );
var methods = [];

files.forEach( file => methods.push( require( file ) ));

module.exports = Object.assign( util.collectMethods( methods ), { util });