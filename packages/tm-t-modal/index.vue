<template>
    <mask :show="show"></mask>
    <layer :is-center="true" :style="style"  :show="show" :size="size">
        <div class="tm-t-modal">
            <div class="tm-t-modal-header">
                <div class="title">{{ title }}</div>
                <div class="close" @click="closeHandler">&times;</div>
            </div>
            <div class="tm-t-modal-body">
                <slot></slot>
            </div>
            <div class="tm-t-modal-footer" v-if="showFooter">
                <div class="btns">
                    <button class="btn btn-submit" @click="submit">{{ btn }}</button>
                    <button class="btn btn btn-default" @click="cancelHandler">{{ cancelText }}</button>
                </div>
            </div>
        </div>
    </layer>
</template>
<script>
	import mask from './mask';
	import layer from './layer';

	export default {
		name: 'tm-t-modal',
		props: {
			show: {
				type : Boolean,
				default : false,
				twoWay : true
			},
			size: {
				type: String,
				default: 'large'
			},
			title: {
				type: String,
				default: ''
			},
			style: {
				type:Object
			},
			btn: {
				type : String,
				default : '确定'
			},
			cancelText: {
				type : String,
				default : '取消'
			},
			cancel: {
				type: Function,
				default: () => {}
			},
			showFooter: {
				type : Boolean,
				default : true,
			},
			close: {
				type: Function,
				default: null
			},
			submit: {
				type : Function,
				default: () => {}
			}
		},
		components: { mask, layer },
		methods: {
			cancelHandler () {
				this.show = false;
				this.cancel();
			},
			closeHandler () {
				if(this.close) {
					this.close();
				}else {
					this.cancelHandler();
				}
			}
		}
	};
</script>
<style lang="less">
    .tm-t-modal {
        &-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 10px 15px; border-bottom: 1px solid #dbdbdb; font-size: 16px;
            .close {
                font-size: 21px; font-weight: bold;
                color: #ccc; cursor: pointer;
                &:hover { color: darken(#ccc, 20%); }
            }
        }
        &-body {
            position: relative; padding: 15px; text-align: center;
            > div { display: inline-block; }
        }
        &-footer {
            padding: 10px 15px; padding-bottom: 40px; text-align: right; display: flex; justify-content: center;
            .btn {
                border: 1px solid #ccc; border-radius: 2px;
                width: 125px; height: 40px;
                background-color: #fff; padding: 6px 12px; font-size: 14px;
                user-select: none; outline: none;
                &:hover { background-color: #ddd;  }
                &:first-child { margin-right: 15px; }
            }
            .btn-submit {
                border-color: #0074ff;
                background-color: #0074ff; color: #fff;
                &:hover { background-color: #338fff; }
            }
        }
    }
</style>
