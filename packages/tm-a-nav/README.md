## 使用方式

```
	index.vue
	
	<template>
		 	<backend-nav></backend-nav>
			<div class="backend-content">
				<router-view></router-view>
			</div>
	</template>
	
	import backendNav from 'tm-a-nav';
	
	export default {
		name: 'vue-page',
		components: { backendNav }
	};
	
	main.js
	
	Phoenix.createRouter({
	    '/': {
	        name: 'root',
	        component ( resolve ){
	            require(['./views/index.vue'], resolve);
	        },
	        subRoutes: {
	            '/xxx': {
	                name: 'xxx',
	                component( resolve ) {
	                    require(['./views/xxx'], resolve);
	                }
	            }
	        }
    });

    props:
		login: Boolean, 是否包含获取用户信息(获取不到，跳转登录), 开发时，可设置为false
		value: Array, 配置侧栏Menu对应页面的path地址（域名后面的路径）
				配置规则：
					'0.1.0:/datas'  ---> 运营推广 ( 一级菜单: 0 ) -> 内容管理 ( 二级菜单: '1' ) -> 数据管理  ( 三级菜单: '0' ) -> 菜单页面地址( '/datas' ) 
					
					'1.0.2:/prints' ---> 设备中心 ( 一级菜单: 1 ) -> 设备管理 ( 二级菜单: '0' ) -> 可操控设备 ( 三级菜单: '2' ) -> 菜单页面地址( '/prints' ) 

		switchTab( 废弃 ): Function, 点击顶栏按键执行该函数，便于清空内容区的DOM

	说明: 点击顶栏按键，切换时，默认跳转到其中的第一个menu对应的页面
```


1.0.33-1.0.35 store 存入 user_name、