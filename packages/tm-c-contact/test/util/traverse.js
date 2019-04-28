const util = require( '../../utils' );
const assert = require( 'assert' );

describe( 'traverse test', function() {
	it( '基本类型-不处理', function() {
		return util.traverse( 1, 'id', iterate ).then( data => {
			assert.ok( data, 1 );
		} );
	} );

	it( '基本类型的数组-不处理', function() {
		return util.traverse( [ 1, 2, 3 ], 'id', iterate ).then( data => {
			assert.deepEqual( data, [ 1, 2, 3 ] );
		} );
	} );

	it( '对象下的基本类型-处理', function() {
		return util.traverse( { id: 1 }, 'id', iterate ).then( data => {
			assert.deepEqual( data, { id: 1, $id: 1 } );
		} );
	} );

	it( '对象下的对象-不处理', function() {
		return util.traverse( { id: { id: 1 } }, 'id', iterate ).then( data => {
			assert.deepEqual( data, { id: { id: 1, $id: 1 }, $id: { id: 1, $id: 1 } } );
		} );
	} );

	it( '对象下的数组-处理', function() {
		return util.traverse( { id: [ 1, 2, 3 ] }, 'id', iterate ).then( data => {
			assert.deepEqual( data, { id: [ 1, 2, 3 ], $id: [ 2, 3, 4 ] } );
		} );
	} );

	it( '数组下的对象-处理', function() {
		return util.traverse( [ { id: 1 }, { id: 2 } ], 'id', iterate ).then( data => {
			assert.deepEqual( data, [ { id: 1, $id: 1 }, { id: 2, $id: 2 } ] );
		} );
	} );

	it( '数组下的基本类型、对象混合数组-处理', function() {
		return util.traverse( [ 1, { id: 1 }, { id: 2 } ], 'id', iterate ).then( data => {
			assert.deepEqual( data, [ 1, { id: 1, $id: 1 }, { id: 2, $id: 2 } ] );
		} );
	} );
} );


function iterate ( parent, value, key ) {
	return parent[ `$${ key }` ] = Array.isArray( value ) ? value.map( i => ++i ) : value;
}