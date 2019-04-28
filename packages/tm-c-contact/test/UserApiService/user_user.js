var contact;
const connect = require( 'node-dubbo-comsumer' );
require( '../config' );

describe( '', function() {
	before( function( done ) {
		connect.done( function() {
			contact = require( '../../index' );
			done();
		} );
	} );
	it( 'it should be success', function() {
		var data = {
			"id": "id",
			"result": {
				"success": true,
				"result": {
					"gmtCreate": 1467640504000,
					"gmtModified": 1493186354000,
					"isDeleted": "n",
					"creator": "15501619399",
					"modifier": "15501619399",
					"userId": "58da220b012b1200070b8fc9",
					"siteCode": "cn",
					"nickName": "preable",
					"realName": null,
					"realNameVerify": "n",
					"enterpriseVerify": "n",
					"avatar": "02d7e0efce96c89ffbd80a857dbffbbd",
					"email": null,
					"emailVerify": "n",
					"phone": "15501619399",
					"phoneVerify": "y",
					"password": "$2a$10$9xntRl9YtXK2zwonYJlby.YtxH04e2o0VEZNETKMEkgWWzcTmzBaa",
					"gender": "male",
					"signature": null,
					"storageUsed": 194352038,
					"storageAll": 5000000000,
					"work": 0,
					"followed": 0,
					"follow": 3,
					"phoneArea": "+86",
					"points": 6,
					"isImproved": "n",
					"dataCount": null,
					"roundSubjectCount": null,
					"articleCount": null,
					"favoriteCount": null,
					"id": 5949
				},
				"errCode": "",
				"errMsg": ""
			},
			"error": "",
			"meta": {}
		};

		return Promise.resolve( data ).then( contact.userId ).then( res => {
			if( !res ) throw new Error( 'res should be exist' );
			return true;
		} );
	} );
} );