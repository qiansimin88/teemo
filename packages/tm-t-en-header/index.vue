<template>
	<div class="teemo-header-wrap clearfix">
		<div class="header-top-wrap clearfix">
			<div class="header-top-root">
				<ul class="header-menu">
					<!--<li>
						<a href="/list/list">返回首页</a>
					</li>-->
					<!--<li>
						<a href="http://3dzao.cn" target="_blank">3D造打印</a>
					</li>-->
					<li>
						<a href="/datas/list">Home</a>
					</li>
					<li>
						<a href="/datas/publish">Issue 3D Models</a>
					</li>
					<li class="btn">
						<a href="/prints/device">My Device</a>
					</li>
					<li class="btn">
						<a href="/clouds">My Cloud</a>
					</li>
					<li v-if="!isLogin && !loginPage" class="btn">
						<a :href="'/i/login/?referrer=' + path">Sign In</a></li>
					<li v-if="!isLogin && !loginPage" class="btn">
						<a :href="'/i/login/?referrer=' + path">Join</a>
					</li>
					<li v-if="isLogin && usrInfo" class="usr" @mouseenter.stop="getUsrInfo">
						<span class="avatar">
							<img :src="usrInfo.avatar"/>
						</span>
						<span class="cursor">
							{{ usrInfo.name || usrInfo.nickName  }}
							<!--<i class="triangle"></i>-->
						</span>
						<!--<div class="usr-layer clearfix">-->
						<!--<div class="navlist-2 clearfix">-->
						<!--<ul>-->
						<!--<li><a href="/clouds">Cloud</a></li>-->
						<!--<li><a href="javascript:void(0);" @click="logout">Log out</a></li>-->
						<!--<li><a href="/prints/device">My Device</a></li>-->
						<!--</ul>-->
						<!--</div>-->
						<!--</div>-->
					</li>
					<li v-if="isLogin" class="btn">
						<a href="javascript:void(0);" @click="logout">Log out</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<toast :show.sync="status">{{ toastText }}</toast>
</template>
<script type="text/javascript">
	import phoenix from 'phoenix';
	import toast from 'phoenixUI/toast';
	import store from 'store';
	import defaultHead from './assets/defaulthead.png';
	import newIcon from './assets/new.png';
	import hotIcon from './assets/hot.png';

	export default phoenix.createView({
		name: 't-header',
		props: {
			navigation: {
				type: [String, Boolean],
				default: 'show'
			}
		},
		data() {
			return {
				logo: require('./assets/logo0.png'),
				serv: require('./assets/head-serv.png'),
				path: null,
				sv: null,
				isLogin: true,
				status: false,
				toastText: '',
				usrInfo: null,
				newIcon: newIcon,
				hotIcon: hotIcon,
				hideClass: true,
				loginPage: true
			};
		},
		components: [toast],
		created() {
			this.session_token = store.get('session_token');
			this.user_id = store.get('user_id');
			this.user_info = store.get('user_info');
			// this.isLogin = !!this.session_token && !!this.user_id;
			this.isLoginPage();
			this.api('islogin').post().then((err, data)=> {
				let isLogin = true;
				if (err) {
					err = err.message || err;
					err = err.err_msg || err;
					if(err==='need_login') isLogin = false;
				} else {
					isLogin = true;
				}
				return Promise.resolve(isLogin);
			}).then(data=> {
				this.isLogin = data
				if (this.isLogin) {
					try {
						let nk = this.user_info.profile.nickname;
						//如果不报错，是从localStorage中取的user_info
						//cache设为true,当hover上去，还是要发请求查看具体数据的
						//没有获取到avatar也会重服务端获取头像
						if (this.user_info.profile.avatar) {
							let avt = this.computedCDN(this.user_info.profile.avatar);
							avt = window.export_minas.cdn_host + '/statics/img/default_avatar.png';
							this.usrInfo = {
								name: nk,
								avatar: avt,
								cache: true
							}
						} else {
							this.queryUserFromOnline();
						}
					} catch (e) {
						this.queryUserFromOnline();
					}
				}
			});
		},
		ready() {
			this.path = this.$route.path;
		},
		methods: {
			checkIn() {
				this.api('sign').post(this.user_id).then((err, data) => {
					this.status = true;
					if (err) {
						this.toastText = '网络错误, 请稍后重试!';
						return;
					}
					this.toastText = '签到成功！积分＋3';
					//改为不可签到属性
					this.dataset('hasSignNowDay', false);
				});
			},
			logout() {
				store.remove('session_token');
				store.remove('user_id');
				store.remove('user_info');
				location.reload();
			},
			//获取用户当前优惠券, 只获取一次
			getUsrInfo() {
				//缓存的数据，重新获取
				if (this.usrInfo.cache) {
					this.queryUserFromOnline();
				}
			},
			queryUserFromOnline() {
				this.api('queryUserByUserId').post(this.user_id).then((err, data) => {
					//重新赋值，cache就不存在，不会重复触发
					this.usrInfo = data ? data.result : {};
					this.usrInfo.avatar = !!this.usrInfo.avatar ? this.computedCDN(this.usrInfo.avatar) : defaultHead;
				});
				this.api('queryCouponCountByUserId').post(this.user_id).tpl();
				this.api('hasSignNowDay').post(this.user_id).tpl();
			},
			search() {
				location.href = "/datas/list?keyword=" + this.sv;
			},
			computedCDN(path) {
				return window.export_minas.cdn_host || process.env.CDN + '/' + path + '@40w_40h_100q_4e_238-238-238bgc.jpg'
			},
			showTalk() {
				this.hideClass = false;
			},
			hideTalk() {
				this.hideClass = true;
			},
			isLoginPage(){
				if (window.location.pathname === '/i/login' || window.location.pathname === '/i/forgot' || window.location.pathname === '/i/register') {
					this.loginPage = true;
				} else {
					this.loginPage = false;
				}
			}
		}
	});
</script>
<style type="text/css" src="./assets/iconfont.css"></style>
<style lang="less" scoped src="./index.less"></style>
