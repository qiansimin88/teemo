<template>
	<div class="tm-t-fmimg-upload" :style="style">
		<video v-if="img" :src="imgPath" controls poster preload class="video-s" @click.stop.prevent=""></video>
		<span
				v-else
				class="fmimg fmimg-icon-camera"
				:style="{ 'line-height': lineHeight }">
		</span>
		<slot> <!-- fileUpload component --> </slot>
		<span
				class="img-remove fmimg fmimg-icon-shanchu"
				v-show="img"
				@click="remove"></span>
		<toast :show.sync="toastVisible">{{ toastMsg }}</toast>
		<!--<loading :show.sync="loadingVisible"></loading>-->
	</div>
</template>
<script>
	import toast from 'phoenixUI/toast';
	import loading from 'phoenixUI/loading';

	let inputEl = null;

	export default {
		name: 'tmTVideo',
		props: {
			img: {
				type: String,
				default: '',
				twoWay: true
			},
			style: Object,
			succeeded: Function,
			removed: Function
		},
		data() {
			return {
				toastVisible: false,
				toastMsg: '',
				loadingVisible: false,
				lineHeight: '138px',
				imgPath: ''
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
				return this.img ? process.env.CDN + '/' + this.img : '';
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
			},
			viewDetail() {
				window.location.href = '';
			}
		}
	};
</script>
<style lang="less">
	@import (less) "./assets/iconfont.css";

	.tm-t-fmimg-upload {
		position: relative;
		height: 140px;
		width: 140px;
		display: inline-block;

		img {
			height: 100%;
			width: 100%;
			border-radius: 4px;
			display: block;
			border: 1px solid #dbdbdb;
		}

		.fmimg-icon-camera {
			position: absolute;
			z-index: 1;
			right: 0;
			left: 0;
			line-height: 138px;
			width: 100%;
			font-size: 5em;
			background-color: #f8f8f8;
			color: #dbdbdb;
			border: 1px dashed #dbdbdb;
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
		.video-s{
			width: 100%;
			height: 100%;
			z-index: 998;
			position: absolute;
		}
	}
</style>