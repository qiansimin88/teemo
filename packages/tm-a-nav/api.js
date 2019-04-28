// 查询用户访问Menu，Page，Button权限接口
// 请该对象Assign到自己的Node server api中

var Utils = require('../../server/utils');
var Api = require('../../build/api');

function isPms( pms, roleId ) {
    var userId = Utils.get_user(this).userId;
    if(!userId) return Utils.error('need_login');

    // 判断当前用户是否有该权限( page或button ), 搜索用户的所有角色下的权限
    return Api.PermissionApiService.isUserExistPermission({ 
                userId: userId,
                roleId: roleId,
                permissionName: pms
            })
            .then( function( data ) {
                if ( !data || !data.result || !data.result.result ) {
                    return Utils.error('permission_denied');
                };

                return true;
            });
}

module.exports = {
    // 判断当前用户是否有权限访问该URL的页面
    isPmsPage( path, role ) {
        return isPms.call( this, 'page:' + path, role );
    },
    // 判断当前用户是否有权限操作该button
    isPmsBtn( path, role ) {
        return isPms.call( this, 'btn:' + path, role );
    },
    // 判断当前用户是否有权限操作该button
    isPmsWidget( path, role ) {
        return isPms.call( this, 'widget:' + path, role );
    },
    // 获取当前用户所有可访问的菜单( 三级菜单即所有nav中的menu )
    getPmsMeuns( roleId, isBackend, siteCode, type ) {
        var userId = Utils.get_user(this).userId;
        if(!userId) return Utils.error('need_login');

        // 获取当前用户的所有角色下的所有menu权限
        return Api.PermissionApiService.getMenuPremissionsByUserId( 
                    userId,
                    roleId || '',
                    isBackend || 'y', 
                    siteCode || 'cn',
                    type || 'admin'
                )
                .then( data => {
                    if ( !data || !data.result || !data.result.result || data.result.result.length === 0 ) {
                        return Utils.error('permission_denied');
                    }

                    data = data.result.result;

                    return data.map( v => v.permissionName.split('menu:')[1] );
                });
    },
    getPmsRoles() {
        var userId = Utils.get_user(this).userId;
        if(!userId) return Utils.error('need_login');

        return Api.RoleApiService.getUserRoleByConditions( 
                    { userId: userId }, 
                    { pageIndex: 1, pageSize: 9999 } 
                )
                .then( data => {
                    // 没有设置角色
                    if ( !data || !data.result || !data.result.result || data.result.result.length === 0 ) {
                        return Utils.error('permission_denied');
                    }

                    return data.result.result;
                })
    }
};