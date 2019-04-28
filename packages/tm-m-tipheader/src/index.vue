<template>
    <div class="tipHeader-contain" v-show="isShow">
        <div class="tipHeader-contain-left">
            <i class="icon ica icon-close" @click="close()"></i>
            <img :src="logoImg" class="tipHeader-contain-left-logo"/>
            <span>下载3D造APP</span>
        </div>
        <button class="tipHeader-contain-btn" @click.stop="open()">直接打开</button>
    </div>
</template>
<style lang="less" scoped>
    @import "../src/assets/icon/iconfont.css";

    .tipHeader {
        &-contain {
            position: fixed;
            z-index: 666;
            top: .92rem;
            width: 100%;
            height: 1.2rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 .35rem;
            align-items: center;
            background: #fff;
            opacity: 0.8;
            box-shadow: 0 2px 4px 0 rgba(102, 102, 102, 0.50);
            &-left {
                display: flex;
                flex-direction: row;
                align-items: center;
                &-logo {
                    margin: 0 .18rem 0 .23rem;
                    width: .74rem;
                    height: .74rem;
                    border-radius: .12rem;
                }
                i {
                    font-size: 20px;
                    color: #999;
                }
                span {
                    font-size: .3rem;
                    color: #333;
                }
            }
            &-btn {
                background-color: #27a0ff;
                color: #fff;
                border: 1px solid #27a0ff;
                border-radius: 0.08rem;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: .3rem;
                padding: 0;
                width: 1.5rem;
                height: .5rem;
                line-height: .5rem;
                outline: none;
                &:active {
                    background: rgba(153, 153, 153, 0.20);
                }
            }
        }
    }
</style>
<script>
	import AppHelpers from "../util/appHelper"
	import {resolveSearchToParams} from "../util/urlHelper"

	const schemePrefix = "dzao://dzao";
	export default {
		name: 'tipHeader',
		data() {
			return {
				isShow: true,
				logoImg: require('./assets/logo.png')
			}
		},
		ready() {

		},
		methods: {
			close() {
				this.isShow = false;
			},
			open() {
				const appLink = this.tranHrefToAppLink();
				const scheme = schemePrefix + appLink;
				AppHelpers.openApp(scheme, appLink, isOpen => {
					if (!isOpen) { // 去下载
						const url = window.location.origin + "/user/app/download";
						window.location.href = url;
					}
				})
			},
			// /community/detail/8708.html 帖子详情   /community/:id
			// /community/list.html?id=23 圈子列表   /community/groups/:id
			// /designer/perhome.html?userId=57a54583e76e08e0d6e98e27 个人主页  /personal/:userId
			tranHrefToAppLink() {
				const location = window.location;
				const pathName = location.pathname; // /community/list.html
				const params = resolveSearchToParams();
				let link;
				// handler path
				if (!pathName) {
					link = "";
				} else if (pathName.startsWith("/community/detail")) {
					let id = pathName.match(/\/+(\d+)\.html/) && RegExp.$1;
					link = id ? `/community/${id}` : "";
				} else if (pathName.startsWith("/designer/perhome.html")) {
					const userId = params && params.userId;
					link = userId ? `/personal/${userId}` : "";
				} else if (pathName.startsWith("/community/list.html")) {
					const id = params && params.id;
					link = id ? `/community/groups/${id}` : "";
				} else if (pathName.startsWith("/order/malldetail")) {
					let id = params["pid"];
					link = id ? `/shopping/${id}` : "";
				} else {
					link = "";
				}
				return link;
			}
		}
	}
</script>
