<template>
    <div class="tm-t-sharing">
        <p>分享到:</p>
        <ul>
            <li class="tm-share-iconfont icon-weixin" 
                @click="sharing( 'weixin' )"
                v-if="wxable">
                <div v-el:qr v-show="qrShown">
                    <p>扫描二维码，分享你的数据</p>
                </div>
            </li>
            <li class="tm-share-iconfont icon-weibo" 
                @click="sharing( 'weibo' )"></li>
            <li class="tm-share-iconfont icon-qqzone" 
                @click="sharing( 'qqzone' )"></li>
            <li class="tm-share-iconfont icon-sqq" 
                @click="sharing( 'qq' )"></li>
        </ul>
    </div>
</template>
<script>
    // import QR from 'qrcanvas';
    // 使用浏览器版本
    let QR = require( 'qrcanvas/dist/qrcanvas.slim' );

    let qr = null;

    export default {
        props: {
            // 分享地址( 默认为当前URL )
            url: String,
            // 分享说明( 默认为‘3D造打印云平台’ )
            title: String,
            // 是否微信分享
            wxable: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                qrShown: false
            }
        },
        created() {
            this.init();
        },
        watch: {
            url() {
                this.init();
                // for re genater qr
                qr = null
            },
            title() {
                this.init();
            }
        },
        methods: {
            init() {
                this.query = 
                    '?url=' + ( this.url || window.location.href ) + 
                    '&title=' + ( this.title || '3D造打印云平台' );

                // gen weixin url
                let url = window.location.href;
                url = url.replace(/\.3d(ker|zao)/, '.m.3d$1').replace( 'www.', '' );

                // this.weixin = 'https://test.3dzao.cn/datas/detail/27434.html';
                this.weixin = this.url || url;
                this.weibo = 'http://service.weibo.com/share/share.php' + this.query;
                this.qqzone = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey' + this.query;
                this.qq = 'http://connect.qq.com/widget/shareqq/index.html' + this.query;
            },
            sharing( v ) {
                switch( v ) {
                    case 'weixin':
                        this.wx();
                        break;
                    case 'weibo':
                    case 'qqzone':
                    case 'qq':
                        window.open( this[ v ] );
                        break;
                }
            },
            wx() {
                if ( !qr ) {
                    qr = QR({ data: this.weixin, size: 140 });
                    this.$els.qr.appendChild( qr );
                }

                this.qrShown = !this.qrShown;
            }
        }
    };
</script>
<style lang="less">
    @import (less) "./assets/iconfont.css";

    .tm-t-sharing {
        display: flex; height: 30px; align-items: center;
        > p { margin-right: 10px; color: #999; }
        ul { display: flex; justify-content: space-between; }
        li { 
            height: 28px; width: 28px; border-radius: 50%;
            background: #4ab7ed; color: #fff; opacity: .5;
            line-height: 28px; text-align: center;
            position: relative; cursor: pointer;

            &:not(:last-child) { margin-right: 10px; }

            &:hover { opacity: 1; }

            div {
                position: absolute; left: -60px; top: 40px; 
                height: 240px; width: 240px; background: #fff;
                border: 1px solid #ccc; border-radius: 3px; padding: 0 20px;
                
                p { color: #666; padding: 20px 0; }
            }
        }
    }
</style>