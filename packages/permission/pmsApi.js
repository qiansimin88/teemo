// 查询用户访问Menu，Page，Button权限接口
// 请该对象Assign到自己的Node server api中

var Utils = require('../../server/utils');
var Api = require('../../build/api');

module.exports = {
	isPermissiblePage( path ) {
		var userId = Utils.get_user(this).userId;
		if(!userId) return Utils.error('need_login');

		path = 'page:' + path;

		return Api.RoleApiService.getUserRoleByConditions( 
					{ userId: userId }, 
					{ pageIndex: 1, pageSize: 1 } 
				)
				.then( data => {
					// 没有设置角色
					if ( !data || !data.result || !data.result.result || data.result.result.length === 0 ) {
						return Utils.error('permission_denied');
					}

					return data.result.result[0];
				}).then( data => {
					return Api.PermissionApiService.isUserExistPermission({ 
								userId: data.userId,
								roleId: data.roleId,
								permissionName: path
							})
							.then( function( data ) {
								if ( !data || !data.result || !data.result.result ) {
									return Utils.error('permission_denied');
								};

								return true;
							});
				});
	},
	getPermissibleMeuns( isBackend, siteCode ) {
		var userId = Utils.get_user(this).userId;
		if(!userId) return Utils.error('need_login');

		return Api.PermissionApiService.getMenuPremissionsByUserId( 
						userId, 
						isBackend || 'y', 
						siteCode || 'cn' 
					)
					.then( data => {
						if ( !data || !data.result || !data.result.result || data.result.result.length === 0 ) {
							return Utils.error('permission_denied');
						}

						data = data.result.result;

						return data.map( v => v.permissionName.split('menu:')[1] );
					});
	},
	isPermissibleBtn() {
		// TODO
	}
};