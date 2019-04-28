<template>
    <div class="hfloat-wrap-contain-content">
        <div id="hfloat">
            <!--<i @click.stop="changeFloatShow" :class="['iconfont-float','icon-float-yincang','footer-expand',!showFloat?'footer-expand-shrink':'']"></i>-->
            <ul v-if="showFloat" class="ul-list" transition="ulExpand">
                <div class="wrap-li">
                    <li class="ask" @click="showQidian" style="cursor: pointer;">
                        <div class="iconfontarea">
                            <i class="iconfont-float icon-float-kefu1"></i>
                        </div>
                    </li>
                    <li class="phone" style="cursor: pointer;">
                        <div class="iconfontarea">
                            <i class="iconfont-float icon-float-dianhua1"></i>
                        </div>
                    </li>
                    <div class="popup phone-popup">
                        <!-- <img :src="phone" /> -->
                        <div class="phone-area">
                            {{ servierMobile }}
                        </div>
                        <div class="text-area-show">
                            <p>工作日: {{ workDay }}</p>
                            <p>双休日: {{ weekend }}</p>
                        </div>
                        <div class="kailong"></div>
                    </div>
                    <li class="wechat" style="cursor: pointer;">
                        <div class="iconfontarea">
                            <i class="iconfont-float icon-float-weixin1"></i>
                        </div>
                    </li>
                    <div class="popup wechat-popup">
                        <img :src="erweima" />
                        <div class="kailong"></div>
                    </div>
                    <li class="order" style="cursor: pointer;">
                        <!-- /order/bought -->
                        <a href="/order/bought">
                            <div class="iconfontarea">
                                <i class="iconfont-float icon-float-dingdan1"></i>
                            </div>
                        </a>
                    </li>
                    <li class="order order-download" style="cursor: pointer;">
                        <a href="/order/download">
                            <div class="iconfontarea">
                                <i class="iconfont-float icon-float-down"></i>
                            </div>
                        </a>
                    </li>
                    <div class="popup download-popup">
                        <p class="download-text">扫一扫下载app</p>
                        <img :src="download" />
                        <div class="kailong"></div>
                    </div>
                </div>
            </ul>
        </div>
    </div>
</template>
<script>
    import {
        createView
    } from 'phoenix';
    import ERWEIMA from './assets/BitmapCopy6.png';
    import DOWNLOAD from './assets/BitmapCopy2.png';
    import Vue from 'vue';

    let qidianDiv = null;

    export default createView({
        name: 'floatlabel',
        props:{
            showAutoConsult: {
                type: [String, Boolean],
                default: true
            }
        },
        data() {
            return {
                download: DOWNLOAD,
                isLogin: false,
                loginBoxShow: false,
                status: false,
                toastText: '',
                lottery: null,
                newyear: {
                    end: false,
                    showResult: false,
                    info: {},
                    noCount: false,
                    boxShow: false,
                    userName: '',
                    mobileRe: /^[1][3-9]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/
                },
                showFloat:true,

                // limit > 1 byte
                // consult: consult,
                erweima: ERWEIMA,
                height:0,
                timer:'',
                timerQd: '',
                isRenderENv:'',//是否2。0服务端渲染模式
                servierMobile: '400 0799 660',
                workDay: '09:00-20:00',
                weekend: '10:00-17:00'
            };
        },
        created(){
            this.isRenderENv = this.isRender();
            if(this.isRenderENv) return;
            this.init();
            this.checkLogin();
        },
        methods: {
            checkLogin(cb) {
                this.api('getUserId').post().then( data => {
                    this.isLogin = !!(data && data !== '');
                });
            },
        	initQd() {
		        let qidianContain = document.querySelector('[id^=qidian_wpa]');
		        if( qidianContain ) {
			        qidianContain.style.cssText += "left:auto; right: 2.6vw; top: calc(40vh); display:none;";
			        qidianContain.onmouseout = () => {
				        if( qidianDiv ) {
					        qidianDiv.style.display = 'none';
				        }
			        };
			        qidianDiv = qidianContain;
		        } else {
			        this.delayQd( this.init );
		        }
            },
            init(){
                let qdContain = document.getElementById('qidianContain');
                qdContain && ( qdContain.style.display = 'block' );
                this.initQd();
            },
	        delayQd ( fn ){
		        clearTimeout( this.timerQd );
		        this.timerQd = setTimeout( fn, 1500);
	        },
            delay ( fn ){
                clearTimeout( this.timer );
                this.timer = setTimeout( fn, 1500);
            },
            loadAutoConsult(){//是否自动显示联系客服
                let autoConsult = document.querySelector('[id^=_QD_INVITE_IFRAME_ID_PREFIX]');
                if( autoConsult ){
                    autoConsult.style.display = "block";
                }else{
                    this.delay( this.loadAutoConsult );
                }
            },
            showQidian(){
                if ( !qidianDiv ) return;
	            qidianDiv.style.right = '2.6vw';
	            qidianDiv.style.bottom = 'calc(40vh + 15.5vw - 63px)';
                qidianDiv.style.display = 'block';
                // qidianDiv.height = this.height;
            },
            hiddenQidian(){
                if ( !qidianDiv ) return;
                qidianDiv.style.display = 'none';
                // qidianDiv.height = 0;
            },
            version2(){
                return Vue.version.split('.')[0] === '2';
            },
            isRender(){
                return this.version2() && process.env.VUE_ENV!=='client';
            },
            changeFloatShow(){
                this.showFloat = !this.showFloat;
                if(!this.showFloat) this.hiddenQidian();
            }
        }
    });
</script>
<style type="text/css" src="./assets/iconfont/iconfont.css"></style>
<style lang="less">
    iframe[src="about:blank"] {
        display: none;
    }
    .hfloat-wrap-contain-content{
        font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
        #hfloat {
            border-radius: 3px;
            position: fixed;
            bottom: 60vh;
            z-index: 20000;
            /*width: 42px;*/
            right: 0;
            display: block;
            .ulExpand-transition{
                display: block;
                transition: all .3s ease;
            }
            /* .expand-enter 定义进入的开始状态 */
            /* .expand-leave 定义离开的结束状态 */
            .ulExpand-enter, .ulExpand-leave {
                /*right: -90px;*/
                opacity: 0;
            }
            .ul-list{
                position: relative;
                .wrap-li{
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
            li {
                /*height: 65px;*/
                /*width: 45px;*/
                width: 2.6vw; height: 3.1vw;
                background:#0074ff;
                border-radius: 2px;
                position: relative;
                margin-top: 1px;
                z-index: 20000;
                &:hover {
                    background: #005ccc;
                }
                .iconfontarea {
                    position: absolute;
                    margin: auto;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    top: 0;
                    z-index: 2;
                    display: flex; justify-content: center; align-items: center;
                    .iconfont-float {
                        display: flex; width: 100%; height: 100%; justify-content: center; align-items: center;
                    }
                }
                .textbox {
                    font-size: 12px; color: #fff; line-height: 14px; text-align: center;
                }
                .iconfont-float {
                    color: #fff;
                    font-size: 1.6vw;
                    display: block;
                }
                >a {
                    font-size: 12px;
                    text-decoration: none;
                    color: #fff;
                }
            }
            .ask {

            }
            .wechat {
                img {
                    width: 90px;
                    height: 90px;
                }
            }
            .order {
                img {
                    width: 40px;
                    height: 40px;
                }
            }
            .bounce {
                animation: bounce 3s ease-in-out;
                animation-iteration-count: infinite;
                display: block;
            }

            @keyframes bounce {
                5% {
                    transform: translate3d( 0, -5px, 0);
                }
                15% {
                    transform: translate3d( 0, 5px, 0);
                }
                20% {
                    transform: translate3d( 0, 0, 0);
                }
            }
            .kailong{
                position: absolute;
                top: 0.7vw;
                right: -0.5vw;
                width:0;
                height:0;
                border-top: 0.5vw solid transparent;
                border-bottom: 0.5vw solid transparent;
                border-left: 0.5vw solid #005ccc;
            }
            .popup {
                /*display: none;*/
                position: absolute;
                left: 2.6vw;
                top: 0px;
                width: 9.8vw;
                /*min-width: 120px;*/
                /*height: 65px;*/
                background: #005ccc;
                transition: all .3s;
                z-index: -1;
                .phone-area {
                    color: #fff; font-size: 16px; font-weight: 900;
                    line-height: 1.7vw;
                }
                .text-area-show {
                    color: #fff;
                    p {
                        line-height: 1.3vw; font-size: 12px;
                    }
                }
            }

            .wechat-popup {
                width: 7.1vw; height: 7.1vw; padding: 5px; left: 0;
                top: 6.2vw;
                opacity: 0;
                z-index: -1 !important;
                img {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
            .wechat:hover + .wechat-popup{
                opacity: 1;
                left: -7.8vw;
            }
            .download-popup {
                width: 7.2vw; left: 0;
                top: 12.4vw;
                opacity: 0;
                z-index: -1 !important;
                img {
                    padding: 2px 5px 2px 5px;
                    width: 7.2vw !important;
                    height: 7.2vw !important;
                }
            }
            .order-download:hover + .download-popup{
                opacity: 1;
                left: -7.9vw;
            }
            .download-text {
                font-size: 14px;
                width: 100%;
                margin: 0.3vw 0;
                text-align: center;
            }
            .ask:hover {
                .popup {
                    display: inline-block;
                }
            }
            .phone-popup{
                min-width: 120px;
                padding: 0.5vw 0;
                text-align: center;
                top: 3.1vw !important;
                opacity: 0;
            }
            .phone:hover + .phone-popup{
                left: -10.5vw !important;
                opacity: 1;
            }

            .wechat:hover {
                .popup {
                    opacity: 1;
                    left: -7.8vw;
                    img {
                        width: 100% !important;
                        height: 100% !important;
                    }
                }
            }

            .order:hover {
                .popup {
                    display: inline-block;
                }
            }
            .footer-expand{
                position: fixed;
                z-index: 3000;
                right: 0;
                bottom: 210px;
                transition:all 0.5s;
                &-shrink{
                    right:10px;
                    transform:rotate(180deg);
                    /*-ms-transform:rotate(7deg); 	!* IE 9 *!*/
                    /*-moz-transform:rotate(7deg); 	!* Firefox *!*/
                    /*-webkit-transform:rotate(7deg); !* Safari 和 Chrome *!*/
                    /*-o-transform:rotate(7deg); 	!* Opera *!*/
                }
            }
            .icon-float-yincang{
                color: #ccc;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                font-size: 18px;
                cursor: pointer;
                margin-bottom: 33px;
            }
        }
        @media screen and (max-width : 1449px){
            .download-text{
                font-size: 12px !important;
            }
        }
        @media screen and (min-width : 1450px){
            .download-text{
                font-size: 14px !important;
            }
        }

    }
</style>
