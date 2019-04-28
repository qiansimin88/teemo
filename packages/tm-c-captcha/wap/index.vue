<template>
    <div class="tm-t-captcha-window" v-show="shown">
        <div class="tm-t-captcha-mask"></div>
        <div class="tm-t-captcha-layer">
            <div class="tm-t-captcha">
                <div class="captcha-header" v-el:header>
                    <i class="tm-captcha-iconfont icon-safe">
                        <span>安全验证</span>
                    </i>
                    <i class="tm-captcha-iconfont icon-shanchu" @click="shown = false"></i>
                </div>
                <div class="captcha-view" 
                    :class="{ active: startable }" 
                    :style="{ width: width + 'px', height: height + 'px' }">
                    <img class="captcha-croped" :src="captcha.croped">
                    <img class="captcha-orignal" :src="captcha.orignal">
                    <img class="captcha-croping" 
                        :src="captcha.croping" 
                        :style="{ 
                            width: cWidth + 'px',
                            height: cHeight + 'px',
                            left: left + 'px', 
                            top: top + 'px' 
                        }">
                    <div class="captcha-checked" v-if="checked">
                        <span class="tm-captcha-iconfont icon-gantan"></span>
                        <p>验证成功</p>
                    </div>
                    <span 
                        class="tm-captcha-iconfont icon-shuaxin" 
                        @click.stop="generate"
                        v-else >
                    </span>
                </div>
                <div v-if="!checked" class="captcha-control" :style="{ width: width + 'px' }">
                    <div class="captcha-slide" v-text="msg"></div>
                    <button 
                        class="captcha-btn tm-captcha-iconfont icon-shenglvehao"
                        :style="{ left: mLeft + 'px' }"
                        @touchstart.stop.prevent="mousedown"
                        @touchend.stop.prevent="mouseup"
                        @touchmove.stop.prevent="mousemove">
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Phoenix from 'phoenix';

    let pos = 0;
    let msg = [ '请向右拖动滑块完成拼图', '验证错误，请重试' ];
    let timer = null;

    export default Phoenix.createView({
        props: {
            checked: {
                type: Boolean,
                twoWay: true
            },
            // 验证成功后，消失的timeout时间
            duration: {
                type: Number,
                default: 800
            }
        },
        data() {
            return {
                captcha: {
                    orignal: '',
                    croped: '',
                    croping: ''
                },
                left: 0,
                top: 0,

                oLeft: 0, // 原始x位置
                mLeft: 0, // btn位置

                startable: false,

                msg: msg[0],

                width: 300,
                height: 100,

                cWidth: 40,
                cHeight: 40,

                mWidth: 250,

                shown: false
            };
        },
        watch: {
            shown( v ) {
                if ( !v ) return;

                this.showing();
            }
        },
        methods: {
            generate() {
                this.api('genCaptcha')
                    .post()
                    .then( (err, data ) => {
                        if ( err ) return console.log(err);

                        this.captcha.orignal = data.orignal;
                        this.captcha.croped = data.croped;
                        this.captcha.croping = data.croping;

                        this.left = this.oLeft = data.pos.x;
                        // 由size计算top位置
                        this.top = data.pos.y * this.size;

                        this.token = data.token;

                        this.msg = msg[0];
                    });
            },
            reset() {
                this.generate();
                this.mLeft = 0;
                // 重置之后，图片分布为原始状态
                this.startable = false;
                this.checked = false;
            },
            sizing() {
                let styles = window.getComputedStyle( this.$els.header );
                this.size = parseFloat( styles.getPropertyValue('width').slice(0, -2) / 300 );

                // 图片的尺寸
                this.width = 300 * this.size;
                this.height = 100 * this.size;

                // 截图的尺寸
                this.cWidth = 40 * this.size;
                this.cHeight = 40 * this.size;

                // btn滑动的尺寸
                this.mWidth = 250 * this.size;
            },
            showing() {
                // 只计算一次
                if ( this.size ) {
                    this.reset();
                } else {
                    this.$nextTick( () => {
                        this.sizing();
                        this.reset();
                    });
                }
            },
            show() {
                this.shown = true;
            },
            hide() {
                this.shown = false;
            },
            mousedown( e ) {
                if ( this.checked ) return;

                this.mLeft = 0;
                this.startable = true;
                pos = e.touches[ 0 ].clientX;
            },
            mousemove( e ) {
                if ( !this.startable ) return;

                let v = e.touches[ 0 ].clientX - pos;
                v < 0 && ( v = 0 );
                v > this.mWidth && ( v = this.mWidth );
                
                this.mLeft = v;
                this.left = this.oLeft + v;
            },
            mouseup( e ) {
                this.mLeft = 0;
                this.startable = false;

                this.check();
            },
            check() {
                let pos = { x: this.left / this.size, y: this.top / this.size };

                this.api('checkCaptcha')
                    .post( this.token, pos )
                    .then( (err, data) => {
                        if ( err ) {
                            console.log( err );
                            this.$emit( 'change', null );
                            this.msg = msg[ 1 ];

                            // 验证失败，重新获取验证码
                            timer && clearTimeout( timer );
                            timer = setTimeout( this.reset, 300 );
                        } else {
                            this.checked = true;
                            this.$emit( 'change', {
                                token: this.token,
                                pos: pos
                            });

                            // 只显示原图，标识已经匹配
                            this.startable = false;
                             // 默认500毫秒后自动消失
                            this.duration && setTimeout( () => {
                                this.shown = false;
                            }, this.duration );
                        }
                    });
            }
        }
    });
</script>
<style lang="less">
    @import (less) "./assets/iconfont.css";

    .tm-t-captcha {
        &-window { 
            width: 100%; height: 100%; 
            position: fixed; left: 0; right: 0; top: 0; bottom: 0;
        }
        &-mask {
            height: 100%; width: 100%;
            position: fixed; left: 0; right: 0; top: 0; bottom: 0;
            background: rgba(55,55,55,.6); z-index: 665;
        }
        &-layer {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; 
            height: 100%; z-index: 666;
        }

        display: flex; flex-direction: column; z-index: 666;
        justify-content: flex-end; align-items: center; width: 92%;
        padding: .1rem .2rem .2rem; background: #fff; border-radius: .05rem;

        .captcha {
            &-header {
                height: .6rem; width: 100%; margin-bottom: .08rem;
                display: flex; justify-content: space-between;
                i:first-child { color: #4ab7ed; font-size: .36rem; }
                i:last-child { color: #999; font-size: .36rem; }
                span { font-size: .3rem; }
            }
            &-view { 
                height: 100px; width: 100%; position: relative; 
                > span { 
                    position: absolute; right: .1rem; bottom: 0;
                    font-size: .5rem; color: #ffff00; cursor: pointer;
                }

                &.active {
                    .captcha-orignal { display: none; }
                    .captcha-croping { display: block; }
                }
            }
            &-orignal, &-croped { height: 100%; width: 100%; position: absolute; }
            &-croping { position: absolute; display: none; }

            &-control {
                width: 100%; height: .7rem; margin-top: .2rem; position: relative;
            }

            &-checked {
                position: absolute; bottom: 0; width: 100%; height: .7rem;
                background: transparent; color: #fff;
                font-size: .26rem; text-align: center;
                display: flex; align-items: center;
                padding-left: .2rem;

                &:before {
                    content: ''; width: 100%; height: 100%;
                    background: #000; opacity: .6;
                    position: absolute; left: 0; z-index: 1;
                }

                span { margin-right: .2rem; font-size: .4rem; z-index: 2; color: #00dab9; }
                p { z-index: 2; }
            }

            &-slide {
                position: absolute; height: 100%; width: 100%;
                border-radius: .05rem; text-align: center; line-height: .7rem;
                // background: #e8f1ff; color: #1a79ff;
                background: #f0f0f0; color: #4ab7ed; font-size: .26rem;
            }
            &-btn {
                position: absolute; height: 100%; width: .9rem;
                border-radius: .05rem; border: none; padding: .12rem;
                box-shadow: 0 0 .1rem #999; font-size: .4rem;
                background: #f8f8f8; color: #4ab7ed;
                outline: none; user-select: none;
            }

        }
    }
</style>