<template>
	<div class="backend-navigation">
		<div class="backend-nav-header">
			<a href="/index" class="nav-brand">管理中心</a>
			<div class="nav-full-screen"></div>
			<div class="nav-header-menu-list">
				<span
					class="nav-header-menu-item"
					:class="{ active: selectedTab === i }"
					v-for="( i, v ) in tabs"
					@click="selectTab( i )">{{ v }}
				</span>
			</div>
			<div class="nav-header-profile">
				<img :src="user.avatar">
				<p>{{ user.name }}</p>
				<div class="btn-group nav-user-role" v-if="roles">
				  <button type="button" class="btn btn-default btn-xs">
				    {{ roles[ user.role ] }} <span class="caret"></span>
				  </button>
					<ul class="dropdown-menu">
						<li v-for="( i, v ) in roles">
							<a href @click.stop.prevent="switchRole( i )">
								{{ v }}
							</a>
						</li>
					</ul>
				</div>
				<div class="links">
					<a href="">刷新</a>
					<a href="http://3dker.cn">网站首页</a>
					<a href="" @click.prevent="logout">安全退出</a>
				</div>
			</div>
		</div>
		<div class="backend-nav-dropdown-list"
			v-for="( i, v ) in tabs"
			v-show="selectedTab === i" >
			<div class="nav-dropdown-item" v-for="( mI, mV ) in menus[ i ]">
				<div
					class="nav-menu-list-header"
					:class="{ active: !mV.expand }"
					@click="mV.expand = !mV.expand" >
					{{ mV.name }}
				</div>
				<div class="nav-menu-list-body">
					<a
						v-for="sm in submenus[ i + '.' + mI ]"
						class="nav-menu-item"
						:class="{ active: sm.path === selectedMenu }"
						:href="sm.path" >
						{{ sm.name }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="less">
	.backend-navigation { position: relative; }
	.backend-nav-header {
		width: 100%; height: 50px;
		position: relative;

		.nav-brand {
			position: absolute; left: 0;
			width: 200px;
			text-align: center; line-height: 50px;
			background-color: rgba(54, 127, 169, 1); color: #fff;
			font-size: 18px; font-weight: bold;
			text-decoration: none;
		}
		.nav-full-screen {
			position: absolute; left: 200px;
			width: 50px; height: 100%;
			background-color: rgba(60, 141, 188, 1);
		}
		.nav-header-menu-list {
			margin: 0 250px; height: 100%;
			overflow: auto;
			background-color: rgba(60, 141, 188, 1);
		}
		.nav-header-menu-item {
			display: inline-block; width: 12.5%;
			text-align: center; line-height: 50px;
			background-color: rgba(60, 141, 188, 1);
			color: #fff; cursor: pointer;

			&.active, &:hover {
				background-color: rgba(54, 127, 169, 1);
			}
		}
		.nav-header-profile {
			position: absolute; right: 0; top: 0;
			width: 280px; height: 100%;
			background-color: rgba(60, 141, 188, 1);
			color: #fff; font-size: 12px;

			.nav-user-role {
				margin: 5px 10px 0 0; position: relative;
				display: inline-block;vertical-align: middle;

				&:hover{
					.dropdown-menu { display: block; }
				}

				button {
					position: relative; float: left; min-width: 120px;
					border: 2px solid transparent; background-clip: padding-box;
					padding: 1px 5px; font-size: 12px;
					height: 24px;
					border-radius: 3px;
					color: #333; background-color: #fff;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					span {
						margin-left: 2px;
						display: inline-block; width: 0; height: 0;
						vertical-align: middle; border-top: 4px dashed;
						border-right: 4px solid transparent;
						border-left: 4px solid transparent;
					}
				}

				.dropdown-menu {
					position: absolute; top: 90%; left: 0; z-index: 1000;
					min-width: 120px; display: none; float: left;
					padding: 5px 0; margin: 2px 0 0;
					font-size: 14px; text-align: left; list-style: none;
					background-color: #fff; background-clip: padding-box;
					border: 1px solid rgba(0,0,0,.15);
					border-radius: 4px; box-shadow: 0 6px 12px rgba(0,0,0,.175);
				}

				a {
					display: block; padding: 3px 20px; clear: both;
					color: #333; font-weight: 400; line-height: 1.42857143;
					white-space: nowrap; text-decoration: none;
					background-color: transparent;

					&:hover { background-color: #f0f0f0;  }
				}

			}

			select {  color: #333; padding: 1px 10px; margin-left: 5px; }

			img, p, div { float: right; margin-top: 3px;}

			img { height: 40px; width: 40px; margin: 5px 5px 5px 10px;}

			p {
				padding-top: 7px;
				max-width: 85px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 0;
			}
			.links a { color: #fff; padding-bottom: 5px; margin-left: 8px; }

		}
	}
	.backend-nav-dropdown-list {
		position: absolute; left: 0; top: 50px;
		width: 200px;
		background-color: rgba(41, 48, 56, 1);

		.nav-menu-list-header {
			background-color: rgba(34, 40, 46, 1);
			color: #fff; font-size: 14px;
			height: 35px; line-height: 35px;
			padding-left: 35px; cursor: pointer;
			position: relative;
			user-select: none;

			&:before {
				content: '';
				height: 0; width: 0;
				border: 8px solid #fff; border-radius: 3px;
				border-color: #fff transparent transparent transparent;
				position: absolute; top: 7px; bottom: 0px; left: 12px;
				margin: auto;
			}

			&.active {
				&:before {
					top: 0; bottom: 10px;
					border-color: transparent transparent #fff transparent;
				}
				~.nav-menu-list-body { display: none; }
			}
		}
		.nav-menu-list-body {
			.nav-menu-item {
				height: 35px; line-height: 35px;
				padding-left: 35px;
				color: #ADBAC5; font-size: 12px;
				display: block; text-decoration: none;
				position: relative;

				&.active, &:hover {
					background-color: rgba(55, 66, 79, 1);
					color: #fff;
				}

				&.active:before {
					content: '';
					height: 100%; width: 4px;
					background-color: rgba(0, 153, 204, 1);
					position: absolute; left: 0;
				}
			}
		}
	}
	.backend-content { margin-left: 200px; padding: 25px; }
</style>
<script>
	import Phoenix from 'phoenix';
	import Vue from 'vue';
	import store from 'store';
	import oss from 'tm-c-oss';

	let OSS = oss.work ? oss.work : oss;

	let TABS = [
			'运营推广', '设备中心', '售卖中心', '财务中心',
			'运维中心'
			// , '统计分析', '内容管理', '帮助中心'
		];
	let MENUS = [
			// 运营推广
			Object.assign( {}, [
				{ expand: true, name: '内容管理' },
				{ expand: true, name: '推广管理' },
				{ expand: true, name: '审核管理' },
				{ expand: true, name: '用户管理' },
				{ expand: true, name: '基本设置' }
			]),
			// 设备中心
			Object.assign( {}, [
				{ expand: true, name: '设备管理' },
				{ expand: true, name: '基础参数' },
				{ expand: true, name: '设备资料' }
			]),
			// 售卖中心
			Object.assign( {}, [
				{ expand: true, name: '订单管理' },
				{ expand: true, name: '商品设置' },
				{ expand: true, name: '规则设置' }
			]),
			// 财务中心
			Object.assign( {}, [
				{ expand: true, name: '财务管理' },
				{ expand: true, name: '发票管理' }
			]),
			// 运维中心
			Object.assign( {}, [
				{ expand: true, name: '系统用户' },
				// { expand: true, name: '记录管理' },
				{ expand: true, name: '基本设置' }
			]),
			// 统计分析
			// Object.assign( {}, [
			// 	{ expand: true, name: '数据统计' },
			// 	{ expand: true, name: '内容管理' }
			// ])
			// 内容管理
			// 帮助中心
		];
	let SUBMENUS = {
			'0.0': [
				{ path: '/datas',                     name: '数据管理' },
				{ path: '/articles',                  name: '文章管理' },
				{ path: '/articles/seolist',          name: 'SEO专题管理'},
				{ path: '/community/groupmanage',     name: '圈子管理' },
				{ path: '/community/topicmanage',     name: '主题管理' },
				{ path: '/designer/demandmanage',     name: '设计需求管理' },
				{ path: '/settings/material/guide',   name: '材料指南' },
				{ path: '/settings/helping',          name: '帮助中心' },
				{ path: '/community/discussmanage',   name: '评论管理' },
				{ path: '/commodity/evaluate',   	  name: '评价管理' },
				{ path: '/community/reportmanage',    name: '举报管理' },
				{ path: '/order/aftersale',    		  name: '售后管理' }
			],
			// 推广管理
			'0.1': [
				{ path: '/designer/invitecode',       name: '邀请码' },
				{ path: '/settings/putin/position',   name: '投放管理' },
				{ path: '/activity/list',             name: '活动管理' },
				{ path: '/activity/singlepage/list',  name: '单页管理' },
				{ path: '/activity/register/list',    name: '报名管理' },
				{ path: '/activity/vote/list',        name: '投票管理' },
				{ path: '/settings/message',          name: '消息发送' }
			],
			//审核管理
			'0.2': [
				{ path: '/designer/realnamemanage',   name: '个人实名认证' },
				{ path: '/finance/user/corpAuth',     name: '企业实名认证' },
				{ path: '/designer/designermanage',   name: '设计师资格认证' },
				{ path: '/settings/material/filing',  name: '材料备案' },
				{ path: '/designer/partner',  		  name: '合伙人认证' }
			],
			// 用户管理
			'0.3': [
				{ path: '/user/member',               name: '会员管理' },
				{ path: '/user/partnermanner',        name: '城市合伙人管理' },
				{ path: '/user/trace',                name: '销售线索' },
				{ path: '/user/seller',               name: '销售人员管理'},
				{ path: '/user/organization',        name: '人员组织管理'},
				// { path: '/#',                         name: '微信用户' },
				{ path: '/user/points',               name: '积分管理' },
				{ path: '/user/goods/point',       name: '积分商品管理' },
				{ path: '/user/exchange/record',       name: '兑换记录' },
				{ path: '/order/coupon',              name: '优惠券管理' },
				// { path: '/#',                         name: '销售线索' },
			],
			// 基本设置
			'0.4': [
				{ path: '/settings/category',        name: '分类设置' },
				// { path: '/#',                         name: '标签设置' },
				{ path: '/community/seomanage',       name: '内链设置' },
				{ path: '/community/linksManage',     name: '友链设置' },
				// { path: '/#',                         name: 'SEO关键词设置' }
			],
			// 设备中心
			// 设备管理
			'1.0': [
				{ path: '/settings/printers',         name: '接单打印机' },
				{ path: '/prints',                    name: '可操控设备' }
			],
			//基础参数
			'1.1': [
				{ path: '/settings/material/catergory', name: '材料分类' },
				{ path: '/settings/materials',          name: '材料管理' },
				{ path: '/settings/device/vendor',      name: '设备供应商' },
				{ path: '/settings/printer/types',      name: '打印机型号管理' },
			],
			// // 设备资料
			// '1.2': [
			// 	{ path: '/device/custom',               name: '客户信息' },
			// 	{ path: '/device/type',                 name: '设备型号' },
			// 	{ path: '/device/factory',              name: '出厂信息' },
			// 	{ path: '/device/info',                 name: '设备资料' },
			// 	{ path: '/device/enabled',              name: '已激活设备' },
			// 	{ path: '/device/statistics',           name: '注册设备统计' }
			// ],
			// 售卖中心
			// 订单管理
			'2.0': [
				{ path: '/order/print',                 name: '打印订单' },
				{ path: '/order/handler',               name: '后处理订单' },
				{ path: '/order/commodity',             name: '商品订单' },
				{ path: '/order/design',             	name: '设计订单' },
				{ path: '/order/artificial',            name: '人工下单' }
			],
			'2.1': [
				{ path: '/commodity/goods/data',          name: '数据商品' },
				{ path: '/commodity/goods/device',        name: '设备商品' },
				{ path: '/commodity/goods/material',      name: '材料商品' },
				{ path: '/commodity/package/setting',     name: '套餐设置' },
				{ path: '/commodity/goods/materialpkg',   name: '服务包商品' },
				{ path: '/commodity/manager',   name: '商品管理' },
				{ path: '/commodity/goods/category',   	  name: '商品分类管理' }
			],
			'2.2': [
				// { path: '/#',                           name: '平台服务费' },
				{ path: '/order/dispachRule',           name: '派单规则' },
				{ path: '/order/monthly',               name: '月结账号配置' },
				{ path: '/order/freight',               name: '运费模版' }
			],

			// 财务中心
			// 财务管理
			'3.0': [
				{ path: '/finance/cash/surefund',       name: '线下付款确认' },
				{ path: '/finance/cash/monthly',        name: '月结确认' },
				{ path: '/finance/cash/audit',          name: '提现审核' },
				{ path: '/finance/cash/refund',         name: '退款记录' },
				{ path: '/finance/cash/flow',           name: '平台流水' },
				{ path: '/finance/cash/balance',        name: '用户余额' },
				{ path: '/finance/bank',        		name: '银行对账' }
				// { path: '/finance/distribution',        name: '个人结算' }
			],
			// 发票管理
			'3.1': [
				{ path: '/finance/invoice/special_audit',   name: '专票信息审核' },
				{ path: '/finance/invoice/audit',           name: '发票申请列表' }
                // { path: '/finance/invoice/wait',           name: '待开票处理' }  //隐藏
			],

			// 运维中心
			// 系统用户
			'4.0': [
				{ path: '/rpg/pms',                        name: '权限管理' },
				{ path: '/rpg/role',                       name: '角色管理' },
				{ path: '/rpg/assign/pms',                 name: '权限分配' },
				{ path: '/rpg/assign/role',                name: '角色分配' }
			],
			// // 记录管理
			// '4.1': [
			// 	{ path: '/#', name: '全站附件管理' }
			// ],
			// // 基本设置
			'4.1': [
				{ path: '/community/operatesetting',  name: '运维设置' },
				{ path: '/community/whitelist',       name: '圈子白名单' },
				{ path: '/user/redis/setting',        name: '缓存管理' },
				{ path: '/activity/theme/list',       name: '单页主题模板' }
			// 	{ path: '/#', name: '消息模板' }
			],

			// 统计分析
			// 数据统计
			// '5.0': [
			// 	{ path: '/#', name: '每日报告' },
			// 	{ path: '/#', name: '行为记录' }
			// ],
			// // 内容统计
			// '5.1': [
			// 	{ path: '/#', name: '模型统计' },
			// 	{ path: '/#', name: '材料统计' }
			// ]

			// 内容管理
			// 帮助中心
		};

	let MENUS_POS_MAP = {};

	let searchRE = /^\?[a-zA-Z]+/;

	export default Phoenix.createView({
		name: 'backendNav',
		// login & value for dev
		props: {
			login: {
				type: Boolean,
				default: true
			},
 			value: {
				type: Array,
				default: null
				// as: [ '0.0.0:/#', '0.0.1:/#' ]
			},
			strict: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				user: {
					name: '',
					avatar: '',
					role: ''
				},

				selectedTab: -1,
				selectedMenu: '*',

				tabs: {},
				menus: {},
				submenus: {},

				roles: null
			};
		},
		created() {
			// 开发时可以回避登录
			if ( this.login ) {
				this.api('getUserById')
					.post( store.get('user_id') )
					.then( (err, user) =>{
						if ( err || !user ) {
							window.location.href = "/i/login";
						} else {
							this.user.avatar = user.avatar ? OSS({ id: user.avatar, w: 50, h: 50 }) : '';
							this.user.name = user.realName || user.nickName || user.phone || user.email;
                            store.set('user_name', this.user.name)
						}
					});
			}

			// 开发时期，自定menu，且没有权限控制
			if ( this.value ) return this.generateMenusNoPms();

			this.user.role = store.get('role_id');

			// 统一添加尚未权限提示页面路由( 直接访问或者router跳转无权限页面 )
			// 注：后台项目中的页面都是root的子页面，子路由
			let rootHandler = this.$router._recognizer.names.root.handlers[0].handler;
			this.$router._addRoute(
				'/forbidden',
				{
					name: 'forbidden',
					component: {
						template: '<p>您没有权限访问该页面</p>'
					}
				},
				[{ path: rootHandler.path, handler: rootHandler }]
			);


			// 判断是否可以访问该页面( 项目中的子页面 & 直接由URL访问 )

			// 挂载在router.beforeEach上( 拦截项目中用vur-router的页面跳转 )
			// 由于该回调挂载的时间问题，只适用于情况：项目中的子页面
			this.$router.beforeEach( ({ next }) => {
				this.checkPagePms( next );
			});

			this.api('getPmsRoles')
				.post()
				.then( (err, data) => {
					// 没有设置角色，空的导航，不可访问任何页面，不再继续
					if (err) return this.processLoginOrPmsErr( err );

					let _v = {};
                    let _v2 = {};

					data.forEach( v => {
						_v[ v.roleId ] = v.roleNameCn;
                        _v2[ v.roleId ] = v.roleName;
                    });
                    this.allRoles = _v2;
					this.roles = _v;

					// 如果角色缺省，说明localstorage中尚未保存，第一次访问
					// 如果已经保存，则使用已经保存的，只由用户自己切换其角色
					if ( !this.user.role ) {
						this.user.role = data[0].roleId;
						// 保存在localstorage, 便于项目中判断button权限
						store.set('role_id', this.user.role);
                        store.set('role_name',  data[0].roleName);
					}else{
                        store.set('role_name',  _v2[this.user.role]);
                    }
				})
				.then( () => {

					// 如果直接由URL访问(或href跳转)，
					// 会在此拦截页面权限( 上述beforeEach还没来得及 )
					this.checkPagePms()

					// 计算出菜单位置映射表
					Object.keys( SUBMENUS ).forEach( pos => {
						SUBMENUS[ pos ].forEach( (v, i) => {
							MENUS_POS_MAP[ v.path ] = pos + '.' + i;
						});
					});

					// 获取可访问菜单 (该步骤与判断页面权限是并行的)
					this.generateMenus();
				});
		},
		methods: {
			selectTab( i ) {
				let menu = this.menus[ i ];
				let submenu = this.submenus[ i + '.' + Object.keys( menu )[0] ];

				submenu && ( submenu = submenu[ Object.keys( submenu )[0] ] );
				submenu && ( window.location.href = submenu.path );
			},
			logout() {
                store.remove('session_token');
                store.remove('role_id');
                store.remove('user_id');
                store.remove('role_name');
                store.remove('user_name');
                window.location.href = '/i/login';
			},
			generateMenusNoPms() {
				// no pms config
				this.tabs = TABS;
				this.menus = MENUS;
				this.submenus = SUBMENUS;

				let _v, _menu, _path;

				this.value && this.value.forEach( v => {
					_v = v.split(':');
					_menu = _v[ 0 ].split('.');
					_path = _v[ 1 ];

					this.submenus[ _menu[0] + '.' + _menu[1] ][ _menu[2] ].path = _path;
				});

				let pathname = window.location.pathname;
				if ( pathname === '/index' || pathname === '/' ) {
					this.selectedTab = parseInt( Object.keys( this.tabs )[ 0 ] );
				} else {
					Object.keys( this.submenus ).forEach( key => {
						this.submenus[key].forEach( m => {
							// 后台页面点击menu时，以href的方式跳转页面，所以使用pathname
							// 而后台页面不只是对应的menu的，可能是menu对应页面的子页面
							// 那么子页面的path名是在menu的path的后面增加子path的，
							// 如: /datas/pulished
							// 为了兼容在其子页面刷新浏览器，所以使用indexOf
							if ( pathname.indexOf( m.path ) === 0 ) {
								this.selectedMenu = m.path;
								this.selectedTab = parseInt( key.split('.')[0] );
							}
						});
					});
				}

				this.selectedTab === -1 && ( this.selectedTab = parseInt( Object.keys( this.tabs )[ 0 ] ) );
			},
			switchRole( v ) {
				this.user.role = v;
				store.set('role_id', v );
                store.set('role_name', this.allRoles[v]);
				// 已经保存角色值在本地，重新加载页面
				window.location.reload();
			},
			generateMenus() {
				// 每个项目的权限独立性( A项目中menu权限不会影响B项目中menu权限 )
				// 根据pathname的第一个路径判断当前nav所在的项目
				// 如果配置了menu权限的项目，则只显示该项目中有配置的menu，
				// 如果尚未配置menu权限的项目，则显示其所有menu

				this.api('getPmsMeuns')
					.post( this.user.role )
					.then( (err, data) => {
						if ( err ) return this.processLoginOrPmsErr( err );

						let mPos, mPath;
						let _p, _tab, _menu, _tabMenu, _submenu;

						let pathname = window.location.pathname;

						data.forEach( v => {
							mPos = MENUS_POS_MAP[ v ];

							if ( !mPos ) return;

							mPath = v;

							_p = mPos.split('.');
							_tab = _p[ 0 ];
							_menu = _p[ 1 ];
							_submenu = _p[ 2 ];
							_tabMenu = _tab + '.' + _menu;

							if ( !SUBMENUS[ _tabMenu ][ _submenu ] ||
								SUBMENUS[ _tabMenu ][ _submenu ].path !== mPath ) {
								return;
							}

							// 有页面URL定位当前menu
							if ( pathname.indexOf( mPath ) === 0 ) {
								this.selectedMenu = mPath;
								this.selectedTab = _tab;
							}

							Vue.set( this.tabs, _tab, TABS[ _tab ] );

							this.menus[ _tab ] || Vue.set( this.menus, _tab, {} );
							this.menus[ _tab ][ _menu ] = MENUS[ _tab ][ _menu ];

							this.submenus[ _tabMenu ] || Vue.set( this.submenus, _tabMenu, {} );
							this.submenus[ _tabMenu ][ _submenu ] = SUBMENUS[ _tabMenu ][ _submenu ];

							if ( pathname === '/index' || pathname === '/' || this.selectedTab === -1 ) {
								this.selectedTab = Object.keys( this.tabs )[ 0 ];
							}

						});
					})
					.then( () => {
						if ( this.strict ) return;

						// 未配置权限的项目, 非严格模式
						let pmsApps = new Set();

						this.api('getPermissionByConditions')
							.post({}, { pageIndex: 1, pageSize: 9999 })
							.then( (err, data) => {
								if (err) return console.log(err);

								if ( !data.result || data.result.length === 0 ) return;

								// debugger;

								data.result.forEach( v => {
									// 所有已经配置权限的项目
									pmsApps.add( v.name.split('/')[1] );
								});

								let appName, _tab, _menu;
								Object.keys( SUBMENUS ).forEach( tabMenu => {
									SUBMENUS[ tabMenu ].forEach( (submenu, i) => {
										appName = submenu.path.split('/')[1];

										// 已经配置了权限的项目，但是没有给用户配相关的权限项
										if ( pmsApps.has( appName ) ) return;

										[ _tab, _menu ] = tabMenu.split('.');

										this.tabs[ _tab ] || Vue.set( this.tabs, _tab, TABS[ _tab ] );

										this.menus[ _tab ] || Vue.set( this.menus, _tab, {} );
										this.menus[ _tab ][ _menu ] = MENUS[ _tab ][ _menu ];

										this.submenus[ tabMenu ] || Vue.set( this.submenus, tabMenu, {} );
										this.submenus[ tabMenu ][ i ] = submenu;
									});
								});

								// 定位首页
								let pathname = window.location.pathname;
								if ( pathname === '/index' || pathname === '/' || this.selectedTab === -1 ) {
									this.selectedTab = Object.keys( this.tabs )[ 0 ];
								}
							});
					});
			},
			checkPagePms( next ) {
				let pathname = window.location.pathname;
				let search = window.location.search;

				// 符合浏览器，兼容最后一位为‘/’的URL
				if ( pathname.slice(-1) === '/' ) {
					pathname = pathname.slice( 0, -1 );
				}

				// 首页默认都不需要权限认证
				if ( !pathname || pathname.indexOf('forbidden') > -1 ) {
					return next && next();
				}

				// 所有权限页面都不要带有query，可以使用不用URL对应同一个Vue页面
				// // URL中的query带有ignore(展示页面中自定义了query)，和pn(展示页中paging)
				// if (search.indexOf('ignore') > -1 ||
				// 	search.indexOf('pn') > -1 ) {
				// 	search = ''
				// }
				// // 区别同一URL对应的展示页和编辑页
				// else {
				// 	search = search && search.match( searchRE );
				// 	search = search && search[0];
				// }

				this.api('isPmsPage')
					.post( pathname, this.user.role )
					.then( (err, data) => {
						if ( err ) {
							return this.processLoginOrPmsErr( err );
						} else if ( !data ) {
							return this.forbiddenPage();
						}
						// vue-route
						next && next();
					});
			},
			processLoginOrPmsErr( err ) {
				switch( err.err_msg ) {
					case 'need_login':
						window.location.href = '/i/login';
						break;
					case 'permission_denied':
						this.forbiddenPage();
						break;
					default:
						console.log( err );
				}
			},
			forbiddenPage() {
				this.$router.replace({ name: 'forbidden' });
			},
			showElMsg( msg ) {
				contentEl || ( contentEl = document.querySelector('.backend-content') );

				while (contentEl.firstChild) {
					contentEl.removeChild(contentEl.firstChild);
				}

				contentEl.textContent = msg || '您没有权限访问该页面!';
			}
		}
	});
</script>
