<template>
	<!--图片预览-->
	<div class="tm-t-upload"
		 :style="{ 'min-height': minHeight, width: width }">
		<h4 :class="{ init: nothing }"
			:style="{ 'line-height': nothing ? minHeight : '' }">
			可将文件直接拖拽至该区域
		</h4>
		<div class="file-container" v-el:container>
			<div class="common-file-wrap">
				<div class="common-file-list">
					<div class="common-file-item"
						 v-for=" v in commonFiles " >
						<div class="file-profile">
							<span class="file-name">{{ v.name }}</span>
							<span>{{ v.size | sizeGen }}</span>
							<span v-show="v.edit" style="z-index: 998;">
								<span v-text="v.measurement"></span>
							</span>
							<span v-show="operable && v.edit" style="z-index: 998;">
								<span class='mainColor' @click="three3dPreview($index)">预览</span>
							</span>
							<span v-show="operable && v.edit" style="z-index: 998;">
								<span class='mainColor' @click="downloadData(v.dfsId)">下载</span>
							</span>
							<span class="file-remove tm-t-upload-iconfont tm-t-upload-icon-shanchu"
								  v-if="removed"
								  @click.stop="remove( $key )">
							</span>
						</div>
						<progress-bar
								width="100%"
								height="10px"
								style="display: block"
								:id="v.progressId"
								:value="v.progressVal"
								:val-size="9"
								:class="{ failed: v.failed }">
						</progress-bar>
					</div>
				</div>
				<slot name="common"><!-- <file-upload></file-upload> --></slot>
			</div>
			<div class="img-file-wrap">
				<div class="img-file-list">
					<imgmovie
							:imgshow.sync="imgmovieShow"
							:current-img.sync = "imgIndex"
							:img-src-list = "imgList"
							src-filed="dfsId">
					</imgmovie>
					<div class="img-file-item"
						 :style="{ height: imgOption.height }"
						 v-for=" v in tempImgList ">
						<img v-if="!v.edit"
							 :src="v.src"
							 @click="prewImg(v.dfsId)">
						<img v-if="v.edit"
							 @click="prewImg(v.dfsId)"
							 :src="oss({ id: v.dfsId, w: 100, h: 100 })">
						<span class="file-remove tm-t-upload-iconfont tm-t-upload-icon-shanchu"
							  v-if="removed"
							  @click.stop="remove( $index )">
						</span>
						<span class="img-top"
							  v-if="imgOption.toped"
							  :class="{ active: selectedTop === $index }"
							  @click.stop="selectTop( v, $index )">首图</span>
						<span class="img-left-bottom"
							  @click.stop="changeSort( $index, $index - 1 )" v-if="$index > 0">上移</span>
						<span class="img-left-bottom"
							  style="right: 0;"
							  @click.stop="changeSort( $index, $index + 1 )" v-if="isShowNext($index, imgFiles)">下移</span>
						<progress-bar
								width="100%"
								height="10px"
								:id="v.progressId"
								:value="v.progressVal"
								:val-size="9"
								:class="{ failed: v.failed }">
						</progress-bar>
					</div>
				</div>
				<slot name="img"><!-- <file-upload></file-upload> --></slot>
			</div>
		</div>
		<input
				id="tm-t-upload-input"
				type="file"
				multiple="true"
				class="file-input"
				v-el:file
				:draggable="true"
				@change.prevent="fileChanged"
				@drop.prevent="fileDroped">
		<toast :show.sync="toastVisible">{{ toastMsg }}</toast>
	</div>
</template>
<style lang="less">
	@import (less) "./assets/iconfont.css";

	.tm-t-upload {
		border: 1px dashed #ccc; padding: 0 30px 20px 30px;
		display: flex; flex-direction: column; position: relative;

		h4 {
			font-size: 14px; text-align: center;
			margin: 15px 0 15px 0; z-index: 1;
			color: #666;

			&.init {
				position: absolute; top: 0; bottom: 0; left: 0; right: 0;
				margin: auto; line-height: 200px;
			}
		}

		.file-container { display: flex; justify-content: space-between; flex: 1; }

		.common-file-list {
			.common-file-item .file-profile {
				display: flex; justify-content: space-between; align-items: center;
				font-size: 14px; color: #666;

				.file-name {
					white-space: nowrap; text-align: left; width: 30%;
					text-overflow: ellipsis; overflow: hidden;
				}
			}
		}

		.img-file-list {
			display: flex; flex-wrap: wrap;

			.img-file-item {
				width: 30%; height: 100px; border: 1px solid #ccc;
				position: relative; margin-bottom: 8px; z-index: 998;

				&:not(:nth-child(3n)) { margin-right: 8px; }

				.file-remove {
					position: absolute; top: 0; right: 5px;
					background-color: #ccc; height: 21px;
				}

				.img-top {
					position: absolute; top: 0; left: 0; right: 0;
					margin: auto; width: 32px; z-index: 999;
					background-color: #ccc; color: #666;
					text-align: center; font-size: 14px;
					display: none; cursor: pointer;

					&.active { background-color: #0074ff; display: inline; }
				}

				.img-left-bottom {
					position: absolute; bottom: 0; left: 0;
					margin: auto; width: 32px; z-index: 999;
					background-color: #ccc; color: #666;
					text-align: center; font-size: 14px;
					display: none; cursor: pointer;
					&:hover {
						background-color: #0f74a8;
					}
				}

				&:hover .img-top { display: inline; }
				&:hover .img-left-bottom { display: inline; }

				img { width: 100%; height: 100%; }

				> div { position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto; }
			}
		}

		.file-remove { z-index: 999; cursor: pointer; color: #666; }

		.phoenix-file-upload { display: none; }

		.file-input {
			position: absolute; top: 0; left: 0;
			z-index: 666; opacity: 0;
			height: 100%; width: 100%;
		}

		.mainColor {
			color: #0074ff; z-index: 998; cursor: pointer;
		}
	}
</style>
<script>
	import progressBar from 'phoenixUI/progressBar';
	import toast from 'phoenixUI/toast';
	import oss from 'tm-c-oss'
	import Vue from 'vue';
	import imgmovie from 'tm-c-imgmovie';
	import _ from 'lodash/util';

	let sizes = ['B', 'K', 'M', 'G', 'T'];

	let inputEl = null;

	export default {
		name: 'pcFileUpload',
		props: {
			minHeight: {
				type: String,
				default: '200px'
			},
			width: {
				type: String,
				default: '100%'
			},
			removed: {
				type: Function,
				default: null
			},
			catchCommon: {		//上次的模型文件
				type: Array,
				default () {
					return [];
				}
			},
			catchImg: {			//上次的图片文件
				type: Array,
				default () {
					return [];
				}
			},
			operable: {			//钱师傅的锅！！！
				type: Boolean,
				default: true
			},
			imgOption: {
				type: Object,
				default() {
					return {
						toped: null,
						height: '100px'
					}
				}
			},
			succeeded: {
				type: Function,
				default: null
			},
			stop: {
				type: Function,
				default: null
			},
			jumpNumDown: {   //因为预览不支持两个表单  所以我特么也没办法了 只能这儿玩了
				type: Number
			},
			selectedTop: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				initStatus: false,
				initStatusImg: false,
				commonFiles: {},
				imgFiles: {},

				nothing: false,

				name2Files: {},
				type2Input: null,

				toastVisible: false,
				toastMsg: '',

				imgmovieShow: false,
				imgList: [],
				imgIndex: 0,  //预览图片索引
				tempImgList: []
			};
		},
		filters: {
			sizeGen( v ) {
				if ( !v ) return '';

				if ( v == 0 ) return '0 B';

				let  i = parseInt( Math.floor( Math.log( v ) / Math.log( 1024 ) ) );
				return Math.round( v / Math.pow( 1024, i ), 2) + ' ' + sizes[ i ];
			}
		},
		components: { progressBar, toast, imgmovie},
		events: {
			onBeforeFileUpload( file, name ) {
				let who = this.name2Files[ name ];
				let currentFiles = this[ `${who}Files` ];

				// 如果文件存在，且上传成功，则不再记录
				// 即，上次上传失败的文件，可再次上传
				// let _file = currentFiles[ file.name ];
				// if ( _file && !_file.failed ) return;
				// 修改为使用 uniqueId 为 key (在传给上传组件前定义：func: sendFiles)

				// 重名问题
				let fName = file.name;
				let count = 0;
				let dot = fName.lastIndexOf('.');
				let _name = fName.slice( 0, dot );
				let _type = fName.slice( dot );

				Object.keys( currentFiles ).forEach( v => {
					currentFiles[ v ].orignalName === fName && count++;
				});
				count && ( fName = _name + '(' + count + ')' + _type );

				Vue.set( currentFiles, file.key, {
					name: fName,
					orignalName: file.name,
					size: file.size,
					src: '',
					failed: false,
					progressId: _.uniqueId('tm_t_upload_progress_'),
					progressVal: 0
				});

				// 图片本地预览
				if ( who === 'img' ) {
					let reader = new window.FileReader();
					reader.onload = e => {
						currentFiles[ file.key ].src = e.target.result;
					};
					reader.readAsDataURL( file );
				}

				return true;
			},
			onFileProgress( file, e, name ) {
				let currentFiles = this[ `${this.name2Files[ name ]}Files` ];

				// 这里使用99%，是表示，只有文件上传得到200的回应头，且文件标示提交数据库，才能算是上传成功
				currentFiles[ file.key ].progressVal = e.percent > 99 ? 99 : e.percent;

				return true;
			},
			onAfterFormat( files, format ) {
				this.toastMsg = `仅支持 ${format.split("|").join(", ")} 格式的文件`;
				this.toastVisible = true;

				return true;
			},
			onAfterCompareSize( files, size ) {
				this.toastMsg = `文件大小不能超过${size}M`;
				this.toastVisible = true;

				return true;
			},
			onFileError( file, err ) {
				// 只处理单个文件的出错
				if ( !file.key ) return;

				let _file = this.commonFiles[ file.key ];
				_file || ( _file = this.imgFiles[ file.key ] );

				if ( !_file ) return;

				_file.failed = true;

				let el = this.$el.querySelector( `#${_file.progressId} .percent` );
				el.textContent = '上传失败';

				return true;
			},
			onFileUpload( file, res ) {
				if ( !file.key ) return;

				let _file = this.commonFiles[ file.key ];
				_file || ( _file = this.imgFiles[ file.key ] );

				if ( !_file ) return;

				_file.res = res;
				_file.dfsId = res.ret.result.dfsId;

				// 重名记录
				try {
					res.ret.result.fullName = _file.name;
				} catch (e) {}

				_file && this.succeeded && this.succeeded( res, result => {
					_file.failed = !result;

					let el = this.$el.querySelector( `#${_file.progressId} .percent` );
					if ( result ) {
						el.textContent = '上传成功';
						_file.progressVal = 100;
					} else {
						el.textContent = '上传失败';
					}
				}, file);

				return true;
			}
		},
		created() {
			function preventDefault ( e ){
				e.preventDefault();
			}
			document.body.addEventListener('dragleave', preventDefault);
			document.body.addEventListener('drop', preventDefault);
			document.body.addEventListener('dragenter', preventDefault);
			document.body.addEventListener('dragover', preventDefault);
		},
		ready() {
			let inputEls = this.$els.container.querySelectorAll('input');
			let fileListEls = this.$els.container.children;

			inputEl = document.getElementById('tm-t-upload-input');

			let node, name, slot;
			switch( inputEls.length ) {
				case 1:
					// 一个上传， 普通文件或者图片文件
					node = inputEls[ 0 ];

					name = node.getAttribute('name');
					slot = node.parentNode.getAttribute('slot');

					this.name2Files[ name ] = slot;

					for( let i = fileListEls.length - 1, v; i >= 0; i-- ) {
						v = fileListEls[ i ];
						if ( v.querySelector('input') ) {
							v.style.width = '100%';
						} else {
							v.parentNode.removeChild( v );
						}
					}

					break;
				case 2:
					// 两个上传, 普通文件和图片文件
					this.type2Input = {};

					Array.prototype.forEach.call( inputEls, v => {
						name = v.getAttribute('name');
						slot = v.parentNode.getAttribute('slot');

						this.name2Files[ name ] = slot;
						this.type2Input[ slot ] = name;
					});

					Array.prototype.forEach.call( fileListEls, v => v.style.width = '45%' );

					break;
			}
		},
		watch: {
			catchCommon (v) {
				if(this.initStatus) return;
				if(v.length) {
					this.initStatus = true;
				}
				v.map(o => {
					let _file = this.commonFiles[ o.fullName ];
					if ( _file ) return;

					Vue.set( this.commonFiles, o.fullName, {
						name: o.fullName,
						size: o.fileLength,
						edit: true,  // 编辑状态
						measurement: o.measurement,
						status: o.status,
						src: '',
						dfsId: o.dfsId,
						failed: false,
						progressId: _.uniqueId('tm_t_upload_progress_'),
						progressVal: 100
					});
				});
				//启动3d预览的下载
				this.$dispatch('threeDdown', this.commonFiles);
			},
			catchImg (v) {
				if(this.initStatusImg) return;
				if(v.length) {
					this.initStatusImg = true;
				}
				v.map(o => {
					Vue.set( this.imgFiles, o.dfsId, {
						name: '任意',
						size: 0,
						edit: true,  // 编辑状态
						src: '',
						dfsId: o.dfsId,
						failed: false,
						progressId: _.uniqueId('tm_t_upload_progress_'),
						progressVal: 100
					});
				});
			},
			imgFiles(v) {
				this.tempImgList = Object.values(this.imgFiles) || [];
			}
		},
		computed: {
			imgList () {
				return this.imgmovieShow ? Object.values(this.imgFiles) : [];
			}
		},
		methods: {
			toArray(files) {
				return Object.values(files);
			},
			isShowNext(i, v) {
				return Object.keys(v).length - 1 !== i;
			},
			changeSort(oldIndex, newIndex) {
				const oldI = {...this.tempImgList[oldIndex]};
				const newI = {...this.tempImgList[newIndex]};
				this.tempImgList.$set(newIndex, oldI);
				this.tempImgList.$set(oldIndex, newI);
				if(this.selectedTop === oldIndex) {
					this.selectTop(oldI, newIndex);
				}else if(this.selectedTop === newIndex) {
					this.selectTop(newI, oldIndex);
				}
			},
			prewImg (id) {
				this.imgmovieShow = true;
				let index = 0;
				this.imgList.forEach((o, i) => {
					if(o.dfsId === id) {
						index = i;
						return;
					}
				});
				this.imgIndex = index;
			},
			oss (obj) {
				return oss.work ? oss.work(obj) : oss(obj);
			},
			dragenter (){},
			dragover (){},
			dragleave (){},
			drop (){},
			fileChanged( e ) {
				this.sendFiles( e.target.files );
			},
			fileDroped( e ) {
				this.sendFiles( e.dataTransfer.files );
			},
			three3dPreview (i) {
				if(this.jumpNumDown) {
					i = i + this.jumpNumDown;
				}
				this.$dispatch('three3dPreviewFront', i);
			},
			sendFiles( files ) {
				if ( !files || files.length === 0 ) return;

				if ( this.stop && this.stop( files ) ) return;

				//如果是两中类型的上传在一起的话
				if ( this.type2Input ) {
					let common = [];
					let img = []

					Array.prototype.forEach.call( files, v => {
						v.key = _.uniqueId( 'tm_t_upload_key_' );

						if ( v.type.indexOf( 'image' ) > -1 ) {
							img.push( v );
						} else {
							common.push( v );
						}
					});

					common.length > 0 && this.$broadcast( 'updateFilesByName', common, this.type2Input.common );
					img.length > 0 && this.$broadcast( 'updateFilesByName', img, this.type2Input.img );
				} else {
					let _v;
					Array.prototype.forEach.call( files, v => {
						v.key = _.uniqueId( 'tm_t_upload_key_' );
						_v = v; // hack why
					});

					this.$broadcast( 'updateFiles', files );
				}

				// 清空 input file 中的内容，可重复上传
				inputEl && ( inputEl.value = null );
			},
			remove( key ) {
				let _file = this.commonFiles[ key ];

				if ( _file ) {
					Vue.delete( this.commonFiles, key );
					Object.keys(this.commonFiles).forEach( (item, index) => {
						if(index === 0){
							this.selectTop(this.commonFiles[item], 0)
						}
					})
				} else {

					let pos = -1;
					if(typeof key === 'number') {
						pos = key;
						key = Object.keys(this.imgFiles)[key];
					}
					_file = this.imgFiles[ key ];
					Vue.delete( this.imgFiles, key );
					const keys = Object.keys(this.imgFiles);
					if(keys.length === 0) {
						this.imgOption.toped && this.imgOption.toped( {
							ret: {
								result:{
									dfsId: ''
								}
							}
						});
					} else {
						if(pos === this.selectedTop || keys.length === 1) {
							this.selectTop(this.imgFiles[keys[0]], 0)
						}
					}
				}
				this.removed && this.removed( _file );
			},
			selectTop( v, key ) {
				this.selectedTop = key;
				if(v.edit) {
					v.res = {
						ret: {
							result:{
								dfsId: v.dfsId
							}
						}
					}
				}
				this.imgOption.toped && this.imgOption.toped( v.res );
			},
			//下载
			downloadData (did) {
				this.$dispatch('downloadData', did);
			},
			//重置
			reset(){
				this.imgFiles = {};
				this.commonFiles = {};
				this.initStatus = this.initStatusImg = false;
			},
			getImgs() {
				return this.tempImgList || [];
			}
		}
	};
</script>
