<template>
    <div v-if="show" class="phoenix-2-layer2">
        <div v-if="show"
             class="phoenix-layer"
             v-el="layer"
             :class="{
			'size-large' : size === 'large',
			'size-small' : size === 'small',
			'layer-top': !isCenter
			}"
            :style="style"
            >

            <slot></slot>
        </div>
    </div>
</template>
<script>
	// 在2.0.21(vue@1.x)中去掉动画吧，master站上vue的transition有问题

	let el = null;
	let scrollTop = 0;

	export default {
		name: 'layer',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			style: {
				type: Object
			},
			size: {
				type: String,
				default: 'small',
				validator ( value ){
					return [ 'large', 'small' ].indexOf( value ) > -1;
				}
			},
			isCenter: {
				type: Boolean,
				default: false
			}
		},
		ready() {
			el = window.document.documentElement || document.body;
		},
		watch: {
			// prevent scrolling window outside of layer @2.0.22
			show(v) {
				if ( v ) {
					scrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
					el.style.width = '100%';
					el.style.top = -scrollTop + 'px';
					el.style.position = 'fixed';
				} else {
					el.style.position = '';
					el.style.top = '';
					document.body.scrollTop = scrollTop;
					document.documentElement.scrollTop = scrollTop;
				}
			}
		}
	};
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .phoenix-2-layer2 {
        position: fixed;
        height: 100vh;
        width: 100vw;
        z-index: 666;
        top: 0;
        left: 0;
        left: 0;
        display:flex;
        justify-content:center;
        align-items: center;
    }

    .phoenix-layer {
        position: relative;
        width:260px;
        z-index: 10000;
        border-radius: 3px; background: #fff;
        box-shadow: 2px 1px 5px #555;
        text-align: center;
        margin: auto;
        /*top: 50%; */
        /*transform: translateY(-50%);*/
        &.size-large {
            width: 520px;
        }
        &.size-small {
            width: 260px;
        }
        &.layer-top {
            top: 20px; transform: none;
        }
    }

    // ie下动画卡的要死，我们不在ie下播放动画了!
    .expand-transition {
        -webkit-animation-fill-mode: both;
    }

    .expand-enter {
        -webkit-animation: zoomIn .3s;
    }

    .expand-leave {
        -webkit-animation: zoomOut .3s;
    }

    @-webkit-keyframes zoomIn {
        0% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
        }
        50% {
            opacity: 1;
        }
    }

    @-webkit-keyframes zoomOut {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
        }
        100% {
            opacity: 0;
        }
    }

</style>