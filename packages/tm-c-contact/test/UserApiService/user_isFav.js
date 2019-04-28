var contact;
const connect = require( 'node-dubbo-comsumer' );
const assert = require( 'assert' );
const util = require( '../../utils' );
require( '../config' );

describe( '', function() {
	before( function( done ) {
		connect.done( function() {
			contact = require( '../../index' );
			done();
		} );
	} );

	it( '$isFav-数组测试', function() {
		var data = {
			"id": "id",
			"result": {
				"dataDetailRet": {
					"dataId": [ 1000195, 1000188 ],
					"gmtModified": 1490322408000,
					"userId": "55eb99333ef3872500ec706b",
					"name": "你的拖鞋最美商品2",
					"classifyId": 68
				}
			},
			"error": "",
			"meta": {}
		};

		var order = data.result.dataDetailRet.dataId;

		return Promise.resolve( data ).then( data => {
			return contact.isFav( data, {
				loginUserId: '58da220b012b1200070b8fc9'
			} );
		} ).then( res => {
			return util.traverse( res, '$isFav', function( parent, value ) {
				if ( Array.isArray( value ) ) {
					value.forEach( ( item, index ) => {
						if( item ) assert.ok( item.objectId === order[ index ] );
					} );
				} else {
					assert.ok( value.objectId === order );
				}

				return true;
			} );
		} );
	} );

	it( '$isFav-单个测试', function() {
		var data = {
			"id": "id",
			"result": {
				"dataDetailRet": {
					"dataId": 1000195,
					"gmtModified": 1490322408000,
					"userId": "55eb99333ef3872500ec706b",
					"name": "你的拖鞋最美商品2",
					"classifyId": 68
				}
			},
			"error": "",
			"meta": {}
		};

		var order = data.result.dataDetailRet.dataId;

		return Promise.resolve( data ).then( data => {
			return contact.isFav( data, {
				loginUserId: '58da220b012b1200070b8fc9'
			} );
		} ).then( res => {
			return util.traverse( res, '$isFav', function( parent, value ) {
				if ( Array.isArray( value ) ) {
					value.forEach( ( item, index ) => {
						if( item ) assert.ok( item.objectId === order[ index ] );
					} );
				} else {
					assert.ok( value.objectId === order );
				}

				return true;
			} );
		} );
	} );
} );