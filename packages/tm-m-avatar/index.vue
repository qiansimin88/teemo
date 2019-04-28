<template>
	<span class="tm-m-avatar">
		<!--跳转个人中心-->
		<a :href="href">
			<!--头像-->
			<img :src="key | avatar" :alt="alt"><!--昵称--><span class="tm-m-avatar-nick-name" v-text="nick_name"></span>
			<!--设计师图标-->
			<span v-if="is_designer" class="tm-m-avatar-rz">
				<i class="teemo teemo-renzhengshejishi"></i>
			</span>

		</a>
		<!--圈主 + 楼主-->
		<span class="tm-m-avatar-group-owner" v-bind:class="{show: is_group_owner}">圈主</span>
		<!--这里不能空格或换行-->
		<span class="tm-m-avatar-theme-owner" v-bind:class="{show: is_theme_owner}">楼主</span>
	</span>
</template>
<script>
	import phoenix from 'phoenix';
	import {oss} from 'phoenix-tools';

	export default phoenix.createView({
		name: 'm-avatar',
		data(){
			return {
				cdn_host: process.env.CDN,
				cdn_key: '',
				avatar: '',
				href: 'javascript:void(0);'
			}
		},
		props: {
			alt: {
				type: String,
				required: false,
				twoWay: false
			},
			key: {
				type: String,
				twoWay: false
			},
			user_id: {
				type: String,
				required: true,
				twoWay: false
			},
			nick_name: {
				type: String,
				required: true,
				twoWay: false
			},
			is_designer: {
				type: Boolean,
				default: false
			},
			is_group_owner: {
				type: Boolean,
				default: false
			},
			is_theme_owner: {
				type: Boolean,
				default: false
			},
			default_avatar: {
				type: String,
				required: true
			}
		},
		ready(){
			if(this.user_id){
				this.href = '/designer/perhome?userId=' + this.user_id;
			}
			this.nick_name = this.nick_name || 'nickName';
		},
		components: {},
		filters: {
			avatar(cdn_key){
				return oss.loadAvatar(cdn_key, getSize(0.5), getSize(0.5), this.default_avatar);

				function getSize(rem) {
					let size = window.parseInt(window.document.getElementsByTagName('html')[0].style.fontSize);
					return rem * size;
				}
			}
		},
		created(){
		}
	});
</script>

<style type="text/css" src="./assets/iconfont.css"></style>
<style lang="less" src="./index.less"></style>