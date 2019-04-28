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

	it( '$isDesigner-数组测试', function() {
		var data = {
			"id": "id",
			"result": {
				"success": true,
				"result": [ {
					"userId": ["575e111542ab7f1100dcb7c2", "577c686c521ece0e00f142c1"],
					"classify": [ "椅子", "电脑" ],
					"designerCertificates": "a76f1ccb3ef4cf897cfe2cce6b537106",
					"nickName": "圆圆",
					"avatar": "840044adce8e4cfb76061f0366211b7c",
					"prizes": "hongxing,hongdian,if",
					"prizesCertificate": "6d07d9dbd0c57e1cefc0e31c1999b9d6,ee1ba9cee2c3d1c73f7a48e0d4b55b4b,9f997fe9e6d65f0559527877a7724f96",
					"realName": "高圆圆",
					"successStory": "bf203af4834fe601694da9a17eb8192e",
					"superiority": "高圆圆，1979年10月5日出生于北京市，中国内地影视女演员、模特。1996年，高圆圆被广告公司发掘，随后拍摄大量的商业广告，在广告圈中崭露头；",
					"personalProfile": "开朗",
				} ],
				"errCode": null,
				"errMsg": null
			},
			"error": "",
			"meta": {}
		};

		return Promise.resolve( data )
			.then( contact.isDesigner )
			.then( res => {
				return util.traverse( res, '$isDesigner', function( parent, value ) {
					parent.hasOwnProperty( '$isDesigner' );
					return true;
				} );
			} );
	} );

	it( '$isDesigner-单个测试', function() {
		var data = {
			"id": "id",
			"result": {
				"success": true,
				"result": [ {
					"userId": "575e111542ab7f1100dcb7c2",
					"classify": [ "椅子", "电脑" ],
					"designerCertificates": "a76f1ccb3ef4cf897cfe2cce6b537106",
					"nickName": "圆圆",
					"avatar": "840044adce8e4cfb76061f0366211b7c",
					"prizes": "hongxing,hongdian,if",
					"prizesCertificate": "6d07d9dbd0c57e1cefc0e31c1999b9d6,ee1ba9cee2c3d1c73f7a48e0d4b55b4b,9f997fe9e6d65f0559527877a7724f96",
					"realName": "高圆圆",
					"successStory": "bf203af4834fe601694da9a17eb8192e",
					"superiority": "高圆圆，1979年10月5日出生于北京市，中国内地影视女演员、模特。1996年，高圆圆被广告公司发掘，随后拍摄大量的商业广告，在广告圈中崭露头；",
					"personalProfile": "开朗",
				}, {
					"userId": "577c686c521ece0e00f142c1",
					"classify": [ "模拟数据1" ],
					"designerCertificates": "264e3da1738d4f2c9df132ca63a2aaee",
					"nickName": "神威",
					"avatar": "05a5f0d8e4cec34ffbd6431381636529",
					"prizes": "hongxing,hongdian,if,idea",
					"prizesCertificate": "4c847841bda856154399df97f2442cdb",
					"realName": "周杰伦",
					"successStory": "73fd58896873019c1484ba5f454cd2db,a4e0943f3b5753793db4c00bc9427d1c",
					"superiority": "是吗",
					"personalProfile": "小明",
				} ],
				"pageInfo": {
					"pagesPerTime": 5,
					"pageSize": 20,
					"startIndex": 0,
					"rowCount": 2,
					"pageIndex": 1,
					"totalPage": 1,
					"orderByList": null,
					"pageCount": 1,
					"startPage": 1,
					"endPage": 1
				},
				"errCode": null,
				"errMsg": null
			},
			"error": "",
			"meta": {}
		};

		return Promise.resolve( data )
			.then( contact.isDesigner )
			.then( res => {
				return util.traverse( res, '$isDesigner', function( parent, value ) {
					parent.hasOwnProperty( '$isDesigner' );
					return true;
				} );
			} );
	} );
} );