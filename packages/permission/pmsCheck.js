// 页面进入和Vue-router跳转之前，查询权限配置，附带登录判断
// 此方法将会加到Vue-router的beforeEach中

var phoenix = require('phoenix');
var gateway = require('phoenix/dist/core/gateway');

var pmsApi = new gateway.default('isPermissiblePage');

module.exports = function() {
	phoenix.before( ({ from, to, next }) => {
		pmsApi.post( to.path ).then( (err, data) => {
			if ( err ) {
				switch( err.err_msg ) {
					case 'need_login':
						return window.location.href = '/login.html';
					case 'permission_denied':
						return window.document.write('您没有权限访问该页面!');
					default:
						return console.log( err );
				}
			} else if ( !data ) {
				return window.document.write('您没有权限访问该页面!');
			}
			next();
		});
	});
}