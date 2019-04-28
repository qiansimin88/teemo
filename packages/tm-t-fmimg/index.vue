<template>
	<div class="tm-t-fmimg-upload" :style="{ 'width': `${style.width}px`, 'height': `${style.height}px` }">
		<img v-if="img" :src="imgPath">
		<span
				v-else
				class="fmimg fmimg-icon-camera"
				:style="{ 'line-height': lineHeight }">
		</span>
		<div class="mask-show">
			设置头像
		</div>
		<slot> <!-- fileUpload component --> </slot>
		<!-- <span class="img-edit" v-show="img && !disabledState">编辑</span> -->
		<!-- <span
				class="img-remove fmimg fmimg-icon-shanchu"
				v-show="img && !disabledState"
				@click="remove"></span> -->
		<toast :show.sync="toastVisible">{{ toastMsg }}</toast>
		<!--<loading :show.sync="loadingVisible"></loading>-->
	</div>
</template>
<script>
	import oss from 'tm-c-oss';
	import toast from 'phoenixUI/toast';
	import loading from 'phoenixUI/loading';

	let inputEl = null;

	export default {
		name: 'tmTFmimg',
		props: {
			img: {
				type: String,
				default: '',
				twoWay: true
			},
			style: {
				type: Object,
				default () {
					return {}
				}
			},
			succeeded: Function,
			removed: Function,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				toastVisible: false,
				toastMsg: '',
				loadingVisible: false,
				lineHeight: '107px',
				disabledState: this.disabled
			};
		},
		created() {
			if (this.style && this.style.height) {
				this.lineHeight = this.style.height - 2 + 'px';
			}
		},
		ready() {
			inputEl = this.$el.querySelector('input');
		},
		components: {toast, loading},
		computed: {
			imgPath() {
				return this.img ? oss({id: this.img, w: 100, h: 100, e: 1, c: 1}) : '';
			}
		},
		events: {
			onBeforeFileUpload(file) {
				this.loadingVisible = true;
			},
			onAfterFormat(files, format) {
				this.toastMsg = `仅支持 ${format.split("|").join(", ")} 格式的文件`;
				this.toastVisible = true;
			},
			onAfterCompareSize(file, maxsize) {
				this.toastMsg = `文件大小不能超过${maxsize}M`;
				this.toastVisible = true;
			},
			onFileError(file, res) {
				// skip file array
				if (!file || !file.name) return;

				// clear input file value
				inputEl.value = null;

				this.loadingVisible = false;

				this.toastMsg = '图片上传失败';
				this.toastVisible = true;
			},
			onFileUpload(file, res) {
				// clear input file value
				inputEl.value = null;

				this.loadingVisible = false;

				this.img = (res.ret && res.ret.result) ? res.ret.result.dfsId : '';
				this.succeeded && this.succeeded(res, file);
			}
		},
		methods: {
			remove() {
				this.img = '';
				this.removed && this.removed();
			}
		}
	};
</script>
<style lang="less">
	@import (less) "./assets/iconfont.css";
	.mask-show {
		display: block;
		width: 100%;
		border-radius: 50%;
		position: absolute;
		left: 0; 
		top: 100%; 
		background: rgba(0, 0, 0, 0.3);
		z-index: 222;
		transition:  top .2s ease-in;
		color: #fff;
		text-align: center; 
		line-height: 110px;
	}
	.tm-t-fmimg-upload {
		position: relative;
		height: 110px;
		width: 110px;
		overflow: hidden;
		border-radius: 50%;
		display: inline-block;
		&:hover {
			.mask-show {
				top: 0;
			}
		}
		img {
			height: 100%;
			width: 100%;
			border-radius: 50%;
			display: block;
		}

		.fmimg-icon-camera {
			height: 100%;
			border-radius: 50%;
			position: absolute;
			z-index: 1;
			right: 0;
			left: 0;
			line-height: 108px;
			width: 100%;
			font-size: 36px;
			background-color:#f6f6f6;
			color: #5f5f5f;;
			text-align: center;
		}

		.phoenix-file-upload {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 666;
			width: 100%;
			height: 100%;
			opacity: 0;
		}

		input {
			height: 100%;
			width: 100%;
		}

		.img-edit, .img-remove {
			background-color: #333;
			color: #fff;
			position: absolute;
			top: 0;
			cursor: pointer;
		}
		.img-edit {
			right: 28px;
			padding: 2px 4px;
			z-index: 665;
		}
		.img-remove {
			right: 0;
			font-size: 17px;
			z-index: 999;
		}
	}
</style>