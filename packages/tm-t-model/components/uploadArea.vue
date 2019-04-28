<template>
    <div class="upload-area">
        <!--上传区域-->
        <div class="index-upload"
             draggable
             @dragenter.prevent="dragenter"
             @dragover.prevent="dragover"
             @drop.prevent="drop"
             @dragleave.prevent="dragleave">
            <!--中间文字描述-->
            <div class="index-upload-text">
                <div class="icon-text">
                    <i class="i-model icon-upload"></i><span>上传模型</span>
                </div>
                <div class="index-upload-textContainer">
                    <p>将STL/STP/STEP格式的文件直接拖拽上传 或 直接点击上传</p>
                    <p>批量上传建议＜10个，FDM工艺请将单个数据尺寸控制在160x160x160mm以内</p>
                </div>
            </div>
            <file-upload
                    ref="fu"
                    v-ref:fu
                    name="file_upload_1"
                    :action="uploadPath"
                    multiple="multiple"
                    format="stl|STL|3mf|3MF|STEP|step|STP|stp|obj|OBJ"
                    :maxsize="999999999">
            </file-upload>
        </div>
    </div>
</template>
<script>
	import fileUpload from './uuidFileUpload.vue';
	import {saveDfsId} from '../utils';
	import Vue from 'vue';
	let inputEl = '';
	export default {
        name: 'uploadArea',
        data() {
            return {
	            uploadPath: `${window.export_minas.FileUploadAddr}?language=zh-CN&category=order`
            }
        },
		props : {
			files: {
				type: Object
			}
		},
        components: {
	        fileUpload
        },
        ready() {
        	this.init();
        },
        mounted() {
            this.init();
        },
        methods: {
        	init() {
		        inputEl = this.$el.querySelector('input');
		        this.$on('onFileUpload', this.handlerFileUpload);
		        //这里是fileList
		        //上传列表变换都会在这里触发
		        this.$on('onFileChange', this.handlerFileChange);
		        //加载进度
		        this.$on('onFileProgress', this.handlerFileProgress);
		        this.$on('onFileError', this.handlerFileError);
            },
            handlerFileError(file) {
	            this.files = {
                    ...this.files,
                    [file.name]: {
	                    errorMsg: '模型上传失败，请稍后重试！'
                    }
                }
            },
            handlerFileProgress(file, progress) {
	            var percent = Math.floor( progress.loaded / progress.total * 100);
	            var loadingText = percent >= 99 ? '正在解析...' : '正在上传...';
	            this.files = {
		            ...this.files,
		            [file.name]: {
                        ...this.files[ file.name ],
			            loaded: percent,
                        loadingText: loadingText
                    }
	            };
            },
            handlerFileUpload(file, res) {
	            //用dfsId来作为key
	            var dfsId = res.ret.result.dfsId;
	            saveDfsId( dfsId, file.name );

	            //没有结束，等待socket返回，这里只是上传完毕
	            this.files = {
		            ...this.files,
		            [file.name]: {
			            ...this.files[ file.name ],
			            "loaded": 100,
                        "dfsId" : dfsId,
                        'preview': true,
                        oriFile: file
		            }
	            };

	            //清空input
	            inputEl.value = null;
            },
            handlerFileChange(files) {
	            Array.from( files ).forEach( file => {
		            //必须是一个STL文件
		            if( !/[(\.stl)|(\.3mf)|(\.step)|(\.stp)|(\.obj)]$/i.test( file.name ) ) return;
		            this.files = {
			            ...this.files,
			            [file.name]: {
                            ...this.files[ file.name ],
				            "loading": true,
				            "loaded": 0,
				            "name": file.name,
				            "size": file.size,
				            "crafts": null,
				            "image": false,
				            "preview": false,
				            "show": false
                        }
		            };
	            });
	            this.$dispatch('filechange', this.files);
            },
	        //用来阻止浏览器默认事件，勿删
	        dragenter (){},
	        dragover (){},
	        dragleave (){},
	        drop ( e ){
		        //允许拖拽上传
		        this.$refs.fu.updateFiles(e.dataTransfer.files);
		        // this.$broadcast('updateFiles', e.dataTransfer.files);
	        }
        }
    };
</script>
<style scoped lang="less">
    @import "../assets/iconfont/iconfont.css";
    @import "./custom";

    .upload-area{
        width: 100%;
        background-color: #eff8ff;
        box-sizing: border-box;
        border: 2px solid transparent;

        &:hover{
            border: 2px solid @primary-color;
        }

        .index-upload {
            position: relative;
            width: 100%;

            .index-upload-text {
                text-align: center;
                width: 100%;

                .icon-text {
                    padding-bottom: 1%;
                    padding-top: 1.7%;
                    color: @primary-color;

                    .icon-upload {
                        font-size: 25px;
                        color: @primary-color;
                        margin-right: @margin-5;
                    }
                }
                .index-upload-textContainer {
                    padding-bottom: 2.5%;
                    p {
                        color: #688cb7;
                        font-size: @font-size-small;
                        line-height: @line-height-small;
                        &:first-child {
                            margin-bottom: 0.1%;
                        }
                    }
                }
            }
        }
    }

</style>
