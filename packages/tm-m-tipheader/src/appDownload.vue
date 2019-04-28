<template>
    <div>
        <m-header left="back" center="3D造"></m-header>
        <div v-show="isShow" class="download-contain" >
            <img :src="logoImg" class="download-contain-img"/>
            <button v-if="isAndroid" class="download-contain-btn btn-margin" @click="goDownload('android')"><i class="iconfont icon-android i-icon"></i>Android下载</button>
            <button v-if="isIphone" class="download-contain-btn btn-margin" @click="goDownload('ios')"><i class="iconfont icon-ios i-icon"></i>ios下载</button>
        </div>
    </div>
</template>
<script type='text/javascript'>
	import mHeader from 'ui-m-header';
	import AppHelpers from "../util/appHelper"
    import { resolveSearchToParams } from "../util/urlHelper"

	const schemePrefix = "dzao://dzao";

	export default {
		name: 'order',
		data() {
			return {
				logoImg: require("./assets/logo_slogan.png"),
				isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
				isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
				isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
				isShow: false
			};
		},
		components: {
			mHeader
		},
		ready() {
			this.init();
		},
		mounted (){
		    this.init();
        },
		watch: {},
		methods: {
			init() {
				const search = window.location.search;
				if (!search) {
					this.isShow = true;
				} else {
					let params = resolveSearchToParams();
					const referrer = params && params.referrer || "";
					const url = schemePrefix + referrer;
					AppHelpers.openApp(url, referrer, isOpen => {
						if (!isOpen) {
							this.isShow = true
						}
					})
				}
			},
			goDownload(type){
				const url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.shining3d";
				window.location.href = url
            }
		},
		head: {
			title: function () {
				return {
					inner: '3D造',
					separator: ' ',
					complement: ''
				};
			},
			meta: function () {
				return [{
					name: 'description',
					content: window.export_minas.GeneralDescription,
					id: 'meta-description'
				}, {
					name: 'keywords',
					content: window.export_minas.GeneralKeywords,
					id: 'meta-keywords'
				}];
			}
		}
	}
</script>
<style lang="less" scoped>
    .download {
        &-contain {
            display: flex;
            flex-direction: column;
            align-items: center;
            &-img {
                width: 2.74rem;
                margin-top: 1.98rem;
            }
            &-btn {
                background-color: #27a0ff;
                border: none;
                color: white;
                padding: .2rem 0;
                width: 5rem;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: .3rem;
                border-radius: 0.08rem;
                outline: none;
                &:active {
                    background: rgba(153, 153, 153, 0.20);
                }
            }
        }
    }

    .btn-margin {
        margin-top: .6rem;
    }

    .i-icon {
        color: #fff;
        margin-right: .1rem;
    }
</style>