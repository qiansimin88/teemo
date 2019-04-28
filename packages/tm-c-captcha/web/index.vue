<template>
	<div class="tm-t-captcha-window" v-if="shown">
		<div class="tm-t-captcha-mask"></div>
		<div class="tm-t-captcha-layer">
			<div class="tm-t-captcha">
				<div class="captcha-header" v-el:header>
					<i class="tm-captcha-iconfont icon-safe"></i>
					<span>安全验证</span>
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
							v-else>
            </span>
				</div>
				<div v-if="!checked" class="captcha-control" :style="{ width: width + 'px' }">
					<div class="captcha-slide" v-text="msg"></div>
					<button
							class="captcha-btn tm-captcha-iconfont icon-shenglvehao"
							:style="{ left: mLeft + 'px' }"
							@mousedown="mousedown"
							@mouseup="mouseup"
							@mousemove="mousemove">
					</button>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
    import Phoenix from 'phoenix';

    let pos = 0;
    let msg = ['请向右拖动滑块完成拼图', '验证错误，请重试'];
    let timer = null;

    export default Phoenix.createView({
        props: {
            checked: {
                type: Boolean,
                twoWay: true
            },
            // 小数表示尺寸比例
            size: {
                type: Number,
                default: 1
            },
            shown: {
                type: Boolean,
                twoWay: true,
	            default: false
            },
            // 验证成功后，消失的timeout时间
            duration: {
                type: Number,
                default: 800
            },
	        sucFun: {
                type: Function,
		        default: null
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

                oLeft: 0,

                mLeft: 0,
                startable: false,

                msg: msg[0],

                width: 300,
                height: 100,

                cWidth: 40,
                cHeight: 40,

                mWidth: 250
            };
        },
        created() {
            this.generate();

            // 图片的尺寸
            this.width *= this.size;
            this.height *= this.size;

            // 截图的尺寸
            this.cWidth *= this.size;
            this.cHeight *= this.size;

            // btn滑动的尺寸
            this.mWidth *= this.size;
        },
        methods: {
            generate() {
                this.api('genCaptcha')
                    .post()
                    .then((err, data) => {
                        if (err) return console.log(err);

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

                this.$emit('input', this.checked = false);
            },
            mousedown(e) {
                if (this.checked) return;

                this.mLeft = 0;
                this.startable = true;
                pos = e.clientX;

                window.document.body.addEventListener('mousemove', this.mousemove);
                window.document.body.addEventListener('mouseup', this.mouseup);
            },
            mousemove(e) {
                if (!this.startable) return;

                let v = e.clientX - pos;
                v < 0 && ( v = 0 );
                v > this.mWidth && ( v = this.mWidth );

                this.mLeft = v;
                this.left = this.oLeft + v;
            },
            mouseup(e) {
                this.mLeft = 0;
                this.startable = false;

                window.document.body.removeEventListener('mousemove', this.mousemove);
                window.document.body.removeEventListener('mouseup', this.mouseup);

                this.check();
            },
            check() {
                let pos = {x: this.left / this.size, y: this.top / this.size};

                this.api('checkCaptcha')
                    .post(this.token, pos)
                    .then((err, data) => {
                        if (err) {
                            this.$emit('change', null);
                            this.checked = false;
                            this.msg = msg[1];

                            // 验证失败，重新获取验证码
                            timer && clearTimeout(timer);
                            timer = setTimeout(() => {
                                this.generate();
                                this.mLeft = 0;

                                // 重置之后，图片分布为原始状态
                                this.startable = false;
                            }, 300);
                        } else {
                            this.checked = true;
                            this.$emit('change', {
                                token: this.token,
                                pos: pos
                            });
                            // 只显示原图，标识已经匹配
                            this.startable = false;
                            // 默认500毫秒后自动消失
                            this.duration && setTimeout( () => {
                                this.shown = false;
                                this.sucFun && this.sucFun instanceof Function && this.sucFun();
                            }, this.duration );
                        }
                    });
            }
        },
        watch: {
            shown: function( v ){
                if(v){
                    this.$nextTick(()=>{
                        this.reset();
                    });
                }
            }
        }
    });
</script>
<style lang="less">
	@import (less) "./assets/iconfont.css";

	.tm-t-captcha {
		z-index: 666;
		background: #fff;
		padding: 10px;
		padding-top: 0;
		&-window {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 665;
		}
		&-mask {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			background: rgba(55, 55, 55, .6);
			z-index: 665;
		}
		&-layer {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			z-index: 666;
		}
		.captcha {
			&-header {
				text-align: center;
				padding: 10px 0;
				color: #999;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.icon-shanchu:hover{
					color: #4ab7ed;
					cursor: pointer;
				}
			}
			&-view {
				height: 100px;
				width: 300px;
				position: relative;
				> span {
					position: absolute;
					right: 5px;
					bottom: 0;
					font-size: 28px;
					color: #ffff00;
					cursor: pointer;
				}

				&.active {
					.captcha-orignal {
						display: none;
					}
					.captcha-croping {
						display: block;
					}
				}
			}
			&-orignal, &-croped {
				height: 100%;
				width: 100%;
				position: absolute;
			}
			&-croping {
				position: absolute;
				display: none;
			}

			&-control {
				width: 300px;
				height: 35px;
				margin-top: 10px;
				position: relative;
			}

			&-checked {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 35px;
				background: transparent;
				color: #fff;
				font-size: 14px;
				text-align: center;
				display: flex;
				align-items: center;
				padding-left: 10px;

				&:before {
					content: '';
					width: 100%;
					height: 100%;
					background: #000;
					opacity: .6;
					position: absolute;
					left: 0;
					z-index: 1;
				}

				span {
					margin-right: 10px;
					font-size: 25px;
					z-index: 2;
					color: #00dab9;
				}
				p {
					z-index: 2;
				}
			}

			&-slide {
				position: absolute;
				height: 100%;
				width: 100%;
				border-radius: 5px;
				text-align: center;
				line-height: 35px;
				// background: #e8f1ff; color: #1a79ff;
				background: #f0f0f0;
				color: #4ab7ed;
				font-size: 14px;
			}
			&-btn {
				position: absolute;
				height: 100%;
				width: 50px;
				border-radius: 5px;
				border: none;
				padding: 7px;
				box-shadow: 0 0 10px #999;
				font-size: 24px;
				background: #f8f8f8;
				color: #4ab7ed;
				outline: none;
				use-select: none;
			}

		}
	}
</style>