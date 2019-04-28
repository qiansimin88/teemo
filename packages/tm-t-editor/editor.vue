<!-- 编辑器 -->
<template>
    <div class="editor-wrap" v-el:wrap>
        <div v-el:drop-area class="editor">
            <div name="temp" :id="name" cols="30" rows="10" style="display: none;" v-el:temp></div>
            <input v-el:upload-payload v-show="false" type="file" @change.stop="selectFile" multiple>
            <input v-el:upload-video v-show="false" type="file" accept="audio/mp4, video/mp4,video/quicktime,video/x-msvideo" @change.stop="selectVideo" multiple>
            <!--<input v-el:upload-video v-show="false" type="file"  @change.stop="selectVideo" multiple>-->
            <!-- 上传区域 -->
            <div v-el:area class="area" v-show="showUploadArea">
                <upload-area v-ref:area></upload-area>
            </div>
        </div>

        <div id="video-form">
            <div @click="uploadVideoFromLocal">本地上传</div>
            <div @click="uploadVideoFromCloud">云空间上传</div>
        </div>


        <toast :show.sync="warn">
            <span>{{ warnText }}</span>
        </toast>
    </div>

    

    <mask :show="isShowMask" @click="close"></mask>
    <layer :show="isShowCloud" size="large">
        <div class="cloud">
            <div class="clooud-title">
                <span>插入视频后可带入正文</span>
                <input type="search" class="input-search" placeholder="hello" />
            </div>            
        </div>
    </layer>

    
</template>
<script>

var videoSize = 0;
    import Phoenix from 'phoenix';
    import uploadArea from './components/uploadArea';
    import { getPic,getVideo } from './components/upload.js'
    import Editor from './components/editor.js';
    import toast from 'phoenixUI/toast';
    import mask from 'phoenixUI/mask';
    import layer from 'phoenixUI/layer';
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
            cloudVideo:{
                type:Boolean,
                default:false
            },
            fileUploadAddr: {
                type: String,
                default: null
            },
            getContent: {
                type: Function,
                twoWay: true,
                default: null
            },
            getContentByFilter: {
                type: Function,
                twoWay: true,
                default: null
            },
            setContent: {
                type: Function,
                twoWay: true,
                dafault: null
            },
            getText: {
                type: Function,
                twoWay: true,
                default: null
            },
            onChange: {
                type: Function,
                default: null
            }
        },
        components: [ uploadArea, toast, mask,layer ],
        data() {
            return {
                isShowMask:false,
                isShowCloud:false,
                showUploadArea: false,
                warn: false,
                warnText: null,
                name: 'editor' + Date.now()
            };
        },
        ready() {
            // 设置宽度
            if(this.width) {
                this.$els.area.style.width = this.width + 2 + 'px'; // 2为Border
                this.$els.wrap.style.width = this.width + 2 + 'px';
            }
            
            let editor = new Editor();

            // 名 字为 editor + timestamp
            editor.install(this.name, {
                width: this.width,
                height: this.height,
                extraPlugins: this.plugins,
                placeholder: this.placeholder
            }, this.loadAddr);

            // 绑定事件
            editor.on('instanceReady', e => {
                this.$dispatch('onEditorReady');
                editor.setTitle(this.title);
            });
            editor.on('insertlabel', e => {
                this.$dispatch('onClickLabel',e);
            });
            editor.on('imagechose', e => {
                this.$els.uploadPayload.click();
            });
            editor.on('videoupload',e=>{
                //判断是否需要从云空间上传功能，不需要则直接本地上传
                if(this.cloudVideo){
                    var videoForm = document.getElementById('video-form');//显示云空间及本地上传选项
                    if(videoForm.style.display == 'none' || !videoForm.style.display){
                        videoForm.style.display = 'block';
                    }else{
                        videoForm.style.display = 'none';
                    }
                }else{
                    this.$els.uploadVideo.click();
                }
            });
            editor.on('change', e => {
                this.onChange && this.onChange();
                this.$dispatch('onEditorChange');
            });


            editor.on('keyup', e => {
                    this.$dispatch('onInputAt',e,this.title);
            });


            this._createDropArea(editor);

            // 绑定 props 方法
            this.getText = editor.getText.bind(editor);
            this.setContent = editor.setContent.bind(editor);
            this.getContent = editor.getContent.bind(editor);
            this.getContentByFilter = editor.getContentByFilter.bind(editor);

            /**
             *  绑定vue事件
             */

            // 绑定标签插入 @好友
            this.$on('onLabelInsert', (userId, name,title)=> {
                if(title){
                    if(editor.instance.title === title){
                        if(!userId && !name) return;
                        let a = editor.getIns().document.createElement('a');

                        editor.getIns().insertElement(a);
                        editor.getIns().widgets.initOn(a , 'insertlabel', {
                            userId: userId,
                            name: name
                        });
                        /*
                        *以下处理为删除因键盘输入@唤醒@好友功能而残留的@字符
                        */
                        var atIndex = a.$.parentNode.parentNode.innerHTML.indexOf(a.$.parentNode.outerHTML);//获取@标签在当前福标签中出现的下标
                        if(atIndex >= 0){
                            //截取@标签前的一位字符是否为‘@’，若为则删除
                            if(a.$.parentNode.parentNode.innerHTML.substr(atIndex-1, 1) === '@'){
                                //删除掉@表标签前面无用的@字符
                                a.$.parentNode.parentNode.innerHTML = a.$.parentNode.parentNode.innerHTML.substr(0,atIndex-1) + a.$.parentNode.parentNode.innerHTML.substr(atIndex,a.$.parentNode.parentNode.innerHTML.length-atIndex);
                            }
                        }
                    }
                }else{
                    if(!userId && !name) return;
                    let a = editor.getIns().document.createElement('a');

                    editor.getIns().insertElement(a);
                    editor.getIns().widgets.initOn(a , 'insertlabel', {
                        userId: userId,
                        name: name
                    });
                    /*
                    *以下处理为删除因键盘输入@唤醒@好友功能而残留的@字符
                    */
                    var atIndex = a.$.parentNode.parentNode.innerHTML.indexOf(a.$.parentNode.outerHTML);//获取@标签在当前福标签中出现的下标
                    if(atIndex >= 0){
                        //截取@标签前的一位字符是否为‘@’，若为则删除
                        if(a.$.parentNode.parentNode.innerHTML.substr(atIndex-1, 1) === '@'){
                            //删除掉@表标签前面无用的@字符
                            a.$.parentNode.parentNode.innerHTML = a.$.parentNode.parentNode.innerHTML.substr(0,atIndex-1) + a.$.parentNode.parentNode.innerHTML.substr(atIndex,a.$.parentNode.parentNode.innerHTML.length-atIndex);
                        }
                    }
                }

            });
            // 绑定图片上传
            this.$on('onImgUploadSuccess', img => {
                this.showWarn = true;
                let _img = [ '<p><span style="clear:both;"></span><img',
                    'src=' + getPic({cdnKey:img.key,ext:img.ext}, 400),
                    'data-key=' + img.key,
                    'data-width=' + img.width,
                    'data-height=' + img.height,
                    'data-ext=' + img.ext,
                    '></img><span style="clear:both;"></span></p>' ].join(' ');
                editor.insertElement(_img);
            });
                                // <video class="img"   :src="item.preVideo" autoplay poster ></video>
            // 绑定视频上传
            this.$on('onVideoUploadSuccess', video => {
                this.showWarn = true;
                let _video = [ '<p align="center">&nbsp;<video',
                             'src=' + getVideo(video.key),
                             "controls poster preload",
                             '>您的浏览器版本过低,暂不支持video标签播放视频,请升级您的浏览器</video> </p>' ].join(' ');
                editor.insertElement(_video);
            });

            // 图片上传区域的选择
            this.$on('onImgAreaSelect', ()=> {
                this.$els.uploadPayload.click();
            })
        },
        methods: {
            //从本地上传视频
            uploadVideoFromLocal(){
                var videoForm = document.getElementById('video-form');
                videoForm.style.display = 'none';
                this.$els.uploadVideo.click();
            },
            //从云空间上传视频
            uploadVideoFromCloud(){
                this.isShowMask=true;
                this.isShowCloud=true;
            },
            //关闭云空间上传
            close(){
                console.log('点击了mask');
                this.isShowMask=false;
                this.isShowCloud=false;
            },
            // 检测是不是符合要求的图片
            _checkImage(arr) {
                if(arr.length > 5) {
                    this._showWarn('一次性所选图片不能大于5张');
                    return false;
                }
                for(let file in arr) {
                    if(arr[file].size > 20971520 || !(/\/(png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)(\?.*)?$/.test(arr[file].type))) {
                        this._showWarn('图片小于20M, 仅支持jpg,png,jpeg,gif格式');
                        return false;
                    }
                };
                return true;
            },
            // 检测是不是符合要求的视频连接
            _checkVideo(arr) {
                if(arr.length > 5) {
                    this._showWarn('一次最多只能上传5个视频');
                    return false;
                }
                for(let file in arr) {
                    if(arr[file].size > 524288000){
                        this._showWarn('视频大小限制500M以内');
                        return false;
                    }
                    if(!(/\/(mp4|quicktime)(\?.*)?$/.test(arr[file].type))){
                        this._showWarn('仅支持mp4、mov格式');
                        return false;
                    }
                    // if(arr[file].size > 524288000 || !(/\/(mp4|quicktime)(\?.*)?$/.test(arr[file].type))) {
                    //     this._showWarn('视频必须小于500M, 仅支持mp4、mov格式');
                    //     return false;
                    // }
                };
                return true;
            },
            _showWarn(text) {
                this.warn = true;
                this.warnText = text;
            },
            selectFile(e) {
                this.getFiles(e.target.files, e);
                this.$els.uploadPayload.value = null;
            },
            //选择video
            selectVideo(e){
                this.getVideos(e.target.files, e);
                this.$els.uploadVideo.value = null;
            },
            // 获取视频
            getVideos(files){
                let arr = Array.from(files);
                if(this._checkVideo(arr)) {
                    this.showUploadArea = true;
                    arr.forEach((v, i) => {
                        this.$refs.area.getVideos(this.fileUploadAddr, v);
                    });
                }
            },
            // 获得图片
            getFiles(files) {
                let arr = Array.from(files);
                if(this._checkImage(arr)) {
                    this.showUploadArea = true;
                    arr.forEach((v, i) => {
                        this.$refs.area.getFiles(this.imgUploadAddr, v);
                    });
                }
            },
            _createDropArea(editor) {
                editor.on('drop', e => {
                    e.data.$.preventDefault();
                    let files = e.data.$.dataTransfer.files;
                    if(files.length === 0) return false;


                    var tempArr = [];
                    Array.from(files).forEach(file=>{
                        console.log('file:',file.type);
                        if((/\/(mp4|quicktime)(\?.*)?$/.test(file.type))){
                            tempArr.push(file);
                            this.getVideos(tempArr);
                        }else if((/\/(png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)(\?.*)?$/.test(file.type))){
                            tempArr.push(file);
                            this.getFiles(tempArr);
                        }else{
                            this._showWarn('仅支持jpg,png,jpeg,gif,mp4,mov格式');
                            return;
                        }
                        tempArr = [];
                    });
                });
            }
        }
    });
</script>
<style lang="less" scoped>
    .editor-wrap {
        height: 100%;
        overflow: hidden;
        position: relative;
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

    #video-form{
        border: 1px solid #dbdbdb;
        width: 110px;
        display: none;
        top: 41px;
        left: 569.5px;
        position: absolute;
        text-align: center;
        font-size: 14px;
        color: #666;
        padding: 0 10px ;
        div{ 
            cursor: pointer;
            padding: 5px 0;
        }

        div + div {
            border-top: 1px solid #dbdbdb;
        }
    }

.cloud{
    &-title{
        display: flex;
        justify-content: space-between;
    }
}

.input-search {
  border-radius: 15px;
  width: 35%;
  height: 30px;
  border: 1px solid #dbdbdb;
  outline: none;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  padding: 5px 15px;
  box-sizing: border-box;
  background: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20standalone%3D%22no%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20t%3D%221483538351207%22%20class%3D%22icon%22%20style%3D%22%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%222175%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20d%3D%22M850.453%20800.653l0.105-0.223-197.89-193.493c38.961-45.944%2061.363-103.043%2063.198-161.203%203.664-70.834-24.038-144.003-74.073-195.682-42.739-45.105-102.838-75.421-164.821-83.209-12.031-1.639-24.352-2.458-36.625-2.458-61.344%200-121.126%2019.942-168.322%2056.113-54.705%2040.781-92.468%20101.996-103.616%20167.925-11.054%2061.446%200.911%20127.372%2032.811%20180.82%2021.819%2037.152%2052.888%2069.073%2089.828%2092.298%2033.909%2021.453%2072.924%2035.474%20112.775%2040.485%2011.958%201.62%2024.219%202.439%2036.445%202.439%2056.586%200%20112.572-17.3%20158.132-48.773l197.642%20193.343%203.655%203.368%200.105-0.091c6.515%205.235%2014.768%208.14%2023.319%208.14%2020.202%200%2036.637-16.127%2036.637-35.947%200-8.787-3.358-17.279-9.308-23.853M649.856%20536.743c-32.378%2064.734-97.46%20112.073-169.899%20123.548-33.909%205.773-69.646%203.986-102.941-5.139-64.972-17.433-120.583-63.58-148.808-123.528-32.677-66.559-28.602-150.391%2010.387-213.6%2034.702-58.404%2095.873-99.427%20163.56-109.707l4.802-0.71c2.525-0.409%205.069-0.799%207.555-1.082%208.369-0.858%2016.882-1.286%2025.282-1.286%2034.569%200%2068.716%207.283%2098.811%2021.085%2055.059%2024.691%2098.955%2070.579%20120.409%20125.929%2023.529%2059.109%2020.125%20128.061-9.157%20184.488z%22%20p-id%3D%222176%22%20fill%3D%22%232c2c2c%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E") no-repeat #fff;
  background-size: 15px 15px;
  background-position: calc(100% - 10px);
  font-size: 12px;
}
.input-search:focus {
  border: 1px solid #4ab7ed;
}
.input-search-bounce {
  border-radius: 15px;
  width: 30px;
  height: 30px;
  border: none;
  outline: none;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  padding: 5px 15px;
  box-sizing: border-box;
  background: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20standalone%3D%22no%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20t%3D%221483538351207%22%20class%3D%22icon%22%20style%3D%22%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%222175%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20d%3D%22M850.453%20800.653l0.105-0.223-197.89-193.493c38.961-45.944%2061.363-103.043%2063.198-161.203%203.664-70.834-24.038-144.003-74.073-195.682-42.739-45.105-102.838-75.421-164.821-83.209-12.031-1.639-24.352-2.458-36.625-2.458-61.344%200-121.126%2019.942-168.322%2056.113-54.705%2040.781-92.468%20101.996-103.616%20167.925-11.054%2061.446%200.911%20127.372%2032.811%20180.82%2021.819%2037.152%2052.888%2069.073%2089.828%2092.298%2033.909%2021.453%2072.924%2035.474%20112.775%2040.485%2011.958%201.62%2024.219%202.439%2036.445%202.439%2056.586%200%20112.572-17.3%20158.132-48.773l197.642%20193.343%203.655%203.368%200.105-0.091c6.515%205.235%2014.768%208.14%2023.319%208.14%2020.202%200%2036.637-16.127%2036.637-35.947%200-8.787-3.358-17.279-9.308-23.853M649.856%20536.743c-32.378%2064.734-97.46%20112.073-169.899%20123.548-33.909%205.773-69.646%203.986-102.941-5.139-64.972-17.433-120.583-63.58-148.808-123.528-32.677-66.559-28.602-150.391%2010.387-213.6%2034.702-58.404%2095.873-99.427%20163.56-109.707l4.802-0.71c2.525-0.409%205.069-0.799%207.555-1.082%208.369-0.858%2016.882-1.286%2025.282-1.286%2034.569%200%2068.716%207.283%2098.811%2021.085%2055.059%2024.691%2098.955%2070.579%20120.409%20125.929%2023.529%2059.109%2020.125%20128.061-9.157%20184.488z%22%20p-id%3D%222176%22%20fill%3D%22%232c2c2c%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E") no-repeat #dbdbdb;
  background-size: 15px 15px;
  background-position: center center;
  font-size: 12px;
}
.input-search-bounce:focus {
  width: 100%;
  cursor: text;
  border: 1px solid #4ab7ed;
  padding-right: 25px;
  background: url("data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20standalone%3D%22no%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20t%3D%221483538351207%22%20class%3D%22icon%22%20style%3D%22%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%222175%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20d%3D%22M850.453%20800.653l0.105-0.223-197.89-193.493c38.961-45.944%2061.363-103.043%2063.198-161.203%203.664-70.834-24.038-144.003-74.073-195.682-42.739-45.105-102.838-75.421-164.821-83.209-12.031-1.639-24.352-2.458-36.625-2.458-61.344%200-121.126%2019.942-168.322%2056.113-54.705%2040.781-92.468%20101.996-103.616%20167.925-11.054%2061.446%200.911%20127.372%2032.811%20180.82%2021.819%2037.152%2052.888%2069.073%2089.828%2092.298%2033.909%2021.453%2072.924%2035.474%20112.775%2040.485%2011.958%201.62%2024.219%202.439%2036.445%202.439%2056.586%200%20112.572-17.3%20158.132-48.773l197.642%20193.343%203.655%203.368%200.105-0.091c6.515%205.235%2014.768%208.14%2023.319%208.14%2020.202%200%2036.637-16.127%2036.637-35.947%200-8.787-3.358-17.279-9.308-23.853M649.856%20536.743c-32.378%2064.734-97.46%20112.073-169.899%20123.548-33.909%205.773-69.646%203.986-102.941-5.139-64.972-17.433-120.583-63.58-148.808-123.528-32.677-66.559-28.602-150.391%2010.387-213.6%2034.702-58.404%2095.873-99.427%20163.56-109.707l4.802-0.71c2.525-0.409%205.069-0.799%207.555-1.082%208.369-0.858%2016.882-1.286%2025.282-1.286%2034.569%200%2068.716%207.283%2098.811%2021.085%2055.059%2024.691%2098.955%2070.579%20120.409%20125.929%2023.529%2059.109%2020.125%20128.061-9.157%20184.488z%22%20p-id%3D%222176%22%20fill%3D%22%231296db%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E") no-repeat #fff;
  background-position: calc(100% - 10px) center;
}
</style>