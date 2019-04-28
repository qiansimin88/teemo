const contact = require( 'tm-c-contact' );

module.exports = {
	dataList(){
		return Promise.resolve( [
			{
				"dataId": 27435,
				"userId": "58d3f3ac468d5f000713108d",
				"name": "不知掉什么东西",
				"classifyId": 36
			},
			{
				"dataId": 27435,
				"userId": "58d3f3ac468d5f000713108d",
				"name": "不知掉什么东西",
				"classifyId": 36
			}
		] ).then( contact.user ).then( res => {
			res = [
				{
					"dataId": 27435,
					"userId": "58d3f3ac468d5f000713108d",
					"name": "不知掉什么东西",
					"classifyId": 36,
					"$user": {
						"userId": "561e542131d4d06001f11bd5",
						"siteCode": "cn",
						"nickName": "preable",
						"id": 5949
					}
				},
				{
					"dataId": 27435,
					"userId": "58d3f3ac468d5f000713108d",
					"name": "不知掉什么东西",
					"classifyId": 36,
					"$user": {
						"userId": "561e542131d4d06001f11bd5",
						"siteCode": "cn",
						"nickName": "preable",
						"id": 5949
					}
				}
			]
		} )
	}
};