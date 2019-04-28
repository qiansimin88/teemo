<!-- 编辑器 -->
<template>
    <div class="editor-wrap" ref="wrap">
        <div ref="dropArea" class="editor">
            <div name="temp" :id="name" cols="30" rows="10" style="display: none;" ref="temp"></div>
            <input ref="uploadPayload" v-show="false" type="file" @change.stop="selectFile" multiple>
            <!-- 上传区域 -->
            <div ref="area" class="area" v-show="showUploadArea">
                <upload-area ref="areas"></upload-area>
            </div>
        </div>
        <toast :show.sync="warn">
            <span>{{ warnText }}</span>
        </toast>
    </div>
</template>
<script>
    import Phoenix from 'phoenix';
    import uploadArea from './components/uploadArea';
    import { getPic } from './components/upload.js'
    import Editor from './components/editor.js';
    import toast from 'phoenixUI/toast';
    export default Phoenix.createView({
        name: 'editor',
        props: {
            title: {
                type: String,
                default: '编辑器'
            },
            width: {
                type: Number,
                default: null
            },
            height: {
                type: Number,
                default: 300
            },
            loadAddr: {
                type: String,
                default: null
            },
            placeholder: {
                type: String,
                default: null
            },
            plugins: {
                type: String,
                default: null
            },
            imgUploadAddr: {
                type: String,
                default: null
            },
            getContent: {
                type: Function,
                default: null
            },
            getContentByFilter: {
                type: Function,
                default: null
            },
            setContent: {
                type: Function,
                dafault: null
            },
            getText: {
                type: Function,
                default: null
            },
            onChange: {
                type: Function,
                default: null
            }
        },
        components: [ uploadArea, toast ],
        data() {
            return {
                showUploadArea: false,
                warn: false,
                warnText: null,
                name: 'editor' + Date.now(),
                editor: null
            };
        },
        mounted() {
            // 设置宽度
            if(this.width) {
                this.$refs.area.style.width = this.width + 2 + 'px'; // 2为Border
                this.$refs.wrap.style.width = this.width + 2 + 'px';
            }
            
            let editor = new Editor();
            this.editor = editor;
            // 名 字为 editor + timestamp
            editor.install(this.name, {
                width: this.width,
                height: this.height,
                extraPlugins: this.plugins,
                placeholder: this.placeholder
            }, this.loadAddr);

            // 绑定事件
            editor.on('instanceReady', e => {
                this.$eventHub.$emit('onEditorReady');
                editor.setTitle(this.title);
            });
            editor.on('insertlabel', e => {
                this.$eventHub.$emit('onClickLabel');
            });
            editor.on('imagechose', e => {
                this.$refs.uploadPayload.click();
            });
            editor.on('change', e => {
                this.onChange && this.onChange();
                this.$eventHub.$emit('onEditorChange');
            });
            this._createDropArea(editor);

            // 绑定 props 方法
            // this.getText = editor.getText.bind(editor);
            // this.setContent = editor.setContent.bind(editor);
            // this.getContent = editor.getContent.bind(editor);
            //暴露出这个王涛写的这个的实例
            this.$emit( 'editorInstance', editor );
            // this.getContentByFilter = editor.getContentByFilter.bind(editor);
            /**
             *  绑定vue事件
             */

            // 绑定标签插入 @好友
            this.$eventHub.$on('onLabelInsert', this.eventFrients);
            
            // 绑定图片上传
            this.$eventHub.$on('onImgUploadSuccess', this.eventImgUpload);

            // 图片上传区域的选择
            this.$eventHub.$on('onImgAreaSelect', this.imgArea);
        },
        beforeDestroy () {
            this.$eventHub.$off( 'onLabelInsert', this.eventFrients );
            this.$eventHub.$off( 'onImgUploadSuccess', this.eventImgUpload );
            this.$eventHub.$off( 'onImgAreaSelect', this.imgArea );
        },
        methods: {
            imgArea () {
                this.$refs.uploadPayload.click();
            },
            eventImgUpload ( img ) {
                this.showWarn = true;
                let _img = [ '<p><span style="clear:both;"></span><img',
                    'src=' + getPic({cdnKey:img.key,ext:img.ext}, 400),
                    'data-key=' + img.key,
                    'data-width=' + img.width,
                    'data-height=' + img.height,
                    'data-ext=' + img.ext,
                    '></img><span style="clear:both;"></span></p>' ].join(' ');
                this.editor.insertElement(_img);
            },
            eventFrients ( userId, name  ) {
                if(!userId && !name) return;
                let a = this.editor.getIns().document.createElement('a');
                this.editor.getIns().insertElement(a);
                this.editor.getIns().widgets.initOn(a , 'insertlabel', {
                    userId: userId,
                    name: name
                });
            },
            // 检测是不是符合要求的图片
            _checkImage(arr) {
                if(arr.length > 5) {
                    this._showWarn('一次性所选图片不能大于5张');
                    return false;
                }
                for(let file in arr) {
                    if(arr[file].size > 20971520 || !(/\/(png|jpg|jpeg|PNG|JPG|JPEG)(\?.*)?$/.test(arr[file].type))) {
                        this._showWarn('图片小于20M, 支持png,jpeg格式');
                        return false;
                    }
                };
                return true;
            },
            _showWarn(text) {
                this.warn = true;
                this.warnText = text;
            },
            selectFile(e) {
                this.getFiles(e.target.files, e);
                this.$refs.uploadPayload.value = null;
            },
            // 获得图片
            getFiles(files) {
                let arr = Array.from(files);
                if(this._checkImage(arr)) {
                    this.showUploadArea = true;
                    arr.forEach((v, i) => {
                        this.$refs.areas.getFiles(this.imgUploadAddr, v);
                    });
                }
            },
            _createDropArea(editor) {
                editor.on('drop', e => {
                    e.data.$.preventDefault();
                    let files = e.data.$.dataTransfer.files;
                    if(files.length === 0) return false;
                    this.getFiles(files);
                });
            }
        }
    });
</script>
<style lang="less" scoped>
    .editor-wrap {
        height: 100%;
        overflow: hidden;
        >div {
            text-align: left;
            font-size: 16px;    
        }
        img {
            width: 700px;
        }
        P {
            color: red;
        }
        ol {
            padding: 0 40px !important;
        }
    }
    .editor {
        height: 100%;
    }
    .area {
        margin-top: 20px;
    }
    .storage {
        position: absolute;
    }
</style>