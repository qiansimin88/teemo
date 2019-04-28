const Path = require( 'path' );
const fs = require( 'fs' );

function traverse ( data, key, func ) {
	// 不是有效的格式，放弃解析
	if ( !data ) return Promise.resolve( data );

	return Promise.all( parser( data, key ).map( iterate => func( iterate.parent, iterate.value, iterate.key ) ) ).then( ( res ) => data );
}

function parser ( target, key ) {
	var collect = [];

	if ( !target || typeof target !== 'object' ) return collect;

	collect = Array.isArray( target ) ? parserArray( target, key ) : parserObject( target, key );

	return collect;
}

function parserArray ( target, key ) {
	return target.reduce( ( collect, item ) => collect.concat( parser( item, key, target ) ), [] );
}

function parserObject ( target, key ) {
	var collect = [];

	if ( target.hasOwnProperty( key ) ) collect.push( formatRes( target, key ) );

	return collect.concat( Object.keys( target ).reduce( ( collect, prop ) => collect.concat( parser( target[ prop ], key, target ) ), [] ) );
}

function formatRes ( target, key ) {
	return {
		parent: target,
		key: key,
		value: target[ key ]
	};
}

function isBasic ( target ){
	var type = typeof target;
	return ( type !== 'object' || target === null ) && type !== 'function';
}

function jsFileList ( path ) {
	var rs = [];
	var stat = fs.statSync( path );

	if ( stat.isFile() ) {
		if ( Path.extname( path ) === '.js' ) rs.push( path );

		return rs;
	}

	if ( !stat.isDirectory() ) throw new Error( 'path must be file or directory' );

	var files = fs.readdirSync( path );
	var tpath;

	files.forEach( function( file ) {
		tpath = Path.resolve( path, file );
		rs = rs.concat( jsFileList( tpath ) );
	} );

	return rs;
}

exports.collectMethods = function( target ) {
	var collect = {};
	target = Array.isArray( target ) ? target : [ target ];

	target.forEach( obj => {
		Object.keys( obj ).forEach( key => {
			if ( collect[ key ] ) console.log( `warn: duplicate methods ${ key }` );

			collect[ key ] = obj[ key ];
		} );
	} );

	return collect;
};

exports.colors = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",

	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
};

exports.checkDepend = function( caller, dependence ) {
	var lack = [];
	dependence = dependence || [];
	dependence = Array.isArray( dependence ) ? dependence : [ dependence ];

	if ( !global || !global.$config || !global.$config.services || !global.$config.services ) return Promise.reject( 'global.$config.services should be exist' );

	dependence.forEach( service => {
		if ( !global.$config.services[ service ] ) lack.push( service );
	} );

	if ( lack.length ) {
		var msg = `contact.${ caller } require ${ lack.join( ', ' ) }`;
		console.log( exports.colors.FgRed, msg );
		return Promise.reject( msg );
	}

	return Promise.resolve();
};

exports.default = function( name, dependence, defaultOptions, func ) {
	return Promise.resolve( function( data, options ) {
		return exports.checkDepend( name, dependence )
			.then( () => {
				var $func = func;

				options = Object.assign( {}, defaultOptions, options );

				func = function(){
					var args = Array.prototype.slice.call( arguments );
					args[2] = options;

					return $func.apply( this, args );
				};

				return exports.traverse( data, options.keyword, func );
			} );
	} );
};

/*
* rule: [ 1, 3, 2 ]
* keyword: id,
* source: [ { id: 2}, { id: 3 }, { id: 1 } ] => [ { id: 1 }, { id: 3 }, { id: 2 } ]
* */
exports.order = function( source, rule, keyword ){
	var $source = source.slice();

	rule.forEach( ( key, index ) => {
		var targetIndex = $source.findIndex( item => item && item[ keyword ] === key );
		source[ index ] = targetIndex === -1 ? null : $source[ targetIndex ];
	} );

	return Promise.resolve( source.slice(0) );
};

exports.traverse = traverse;
exports.jsFileList = jsFileList;
