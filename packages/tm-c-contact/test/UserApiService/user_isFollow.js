var contact;
const connect = require( 'node-dubbo-comsumer' );
const assert = require('assert');
const util = require('../../utils');
require( '../config' );

describe( '', function() {
	before( function( done ) {
		connect.done( function() {
			contact = require( '../../index' );
			done();
		} );
	} );

	it( '$isFollow-数组测试', function() {
		var data = {
			"id": "id",
			"result": {
				"success": true,
				"result": {
					"userId": [ '577c686c521ece0e00f142c1', '575e111542ab7f1100dcb7c2' ]
				},
				"errCode": "",
				"errMsg": ""
			},
			"error": "",
			"meta": {}
		};

		var order = data.result.result.userId;

		return Promise.resolve( data ).then( data => {
			return contact.isFollow( data, {
				loginUserId: '58da220b012b1200070b8fc9'
			} );
		} ).then( res => {
			return util.traverse( res, '$isFollow', function( parent, value ){
				if( Array.isArray( value ) ){
					value.forEach( ( item, index ) => {
						assert.ok( item.toUserId === order[ index ] );
					} );
				}else{
					assert.ok( value.toUserId === order );
				}

				return true;
			} );
		} );
	} );

	it( '$isFollow-单个测试', function() {
		var data = {
			"id": "id",
			"result": {
				"success": true,
				"result": {
					"userId": '577c686c521ece0e00f142c1'
				},
				"errCode": "",
				"errMsg": ""
			},
			"error": "",
			"meta": {}
		};

		var order = data.result.result.userId;

		return Promise.resolve( data ).then( data => {
			return contact.isFollow( data, {
				loginUserId: '58da220b012b1200070b8fc9'
			} );
		} ).then( res => {
			return util.traverse( res, '$isFollow', function( parent, value ){
				if( Array.isArray( value ) ){
					value.forEach( ( item, index ) => {
						assert.ok( item.toUserId === order[ index ] );
					} );
				}else{
					assert.ok( value.toUserId === order );
				}

				return true;
			} );
		} );
	} );
} );