<!-- 文件的上传展示区域 -->
<template>
    <div class="area" v-show="uploadList.length>0">
        <div class="tool-bar">
            <span>插入图片后可带入正文(上传限制20M, 最多50张)</span>
            <ul class="tool-bar-btn">
                <li class="btn-img btn-img-blue" @click="allEnable">全部插入</li>
                <li class="btn-img btn-img-blue" @click="selectFile">选择上传</li>
            </ul>
        </div>
        <ul class="upload-list" v-el:imglist>
            <li v-for="item in uploadList" class="upload-item">
                <div class="info">
                    <img class="img" :src="item.preImg" alt="图片无法显示">
                    <div class="file">
                        <p>{{ item.name }}</p>
                        <p>{{ item.size }}</p>
                    </div>
                </div>    
                <div class="progress">
                    <p v-if="item.err" class="warn">
                        <i class="iconfont icon-cancel"></i>
                        <span>上传失败</span>
                    </p>
                    <progress-bar v-else :value="item.persent"></progress-bar>
                </div>
                <ul class="tools">
                    <li class="btn-img btn-img-blue" @click="enable(item)">插入</li>
                    <li class="btn-img btn-img-blue" @click="cancel(item)">删除</li>
                </ul>
            </li>
        </ul>
        <toast :show.sync="warn">{{ warnText }}</toast>
    </div>

    <!--video展示区域-->
    <div  class="area" style="margin-top:20px;" v-show="vedioUploadList.length>0">
        <div class="tool-bar">
            <span>插入视频</span>
        </div>
        <ul class="upload-list" v-el:list>
            <li v-for="item in vedioUploadList" class="upload-item">
                <div class="info">
                    <video class="img"   :src="item.preVideo"  poster ></video>
                    <div class="file">
                        <p>{{ item.name }}</p>
                        <p>{{ item.size }}</p>
                    </div>
                </div>    
                <div class="progress">
                    <p v-if="item.err" class="warn">
                        <i class="iconfont icon-cancel"></i>
                        <span>上传失败</span>
                    </p>
                    <progress-bar v-else :value="item.persent"></progress-bar>
                </div>
                <ul class="tools">
                    <li class="btn-img btn-img-blue" @click="insertVideo(item)">插入</li>
                    <li class="btn-img btn-img-blue" @click="deleteVideo(item)">删除</li>
                </ul>
            </li>
        </ul>
        <toast :show.sync="warn">{{ warnText }}</toast>
    </div>
</template>
<style lang="less" scoped>
    .area {
        width: 100%;
        border: 1px solid #dbdbdb;
    }
    
    .btn-img {
        display: inline-block;
        font-size: 14px;
        height: 27px;
        line-height: 27px;
        border-radius: 5px;
        cursor: pointer;
        padding: 0 10px;
        text-align: center;
    }
    
    .btn-img-blue {
        color: #4ab7ed;
        background: #f8f8f8;
        border: 1px solid #dbdbdb;
    }
    
    .btn-img-blue-touch {
        color: #fff;
        background: #4ab7ed;
    }
    
    .tool-bar {
        font-size: 12px;
        height: 44px;
        line-height: 44px;
        padding: 0px 10px;
        color: #666;
        background: #f8f8f8;
        box-sizing: border-box;
        border-bottom: 1px solid #dbdbdb;
        .tool-bar-btn {
            line-height: 44px;
            float: right;
        }
    }
    
    .upload-list {
        padding: 0 20px;
        background: #fff;
        max-height: 780px;
        overflow: auto;
        list-style-type: none;
        &:last-child {
            border-bottom: none;
        }
        .upload-item {
            height: 78px;
            border-bottom: 1px solid #e3e3e3;
            padding: 16px 0;
            .info {
                display: inline-block;
                height: 45px;
                width: 30%;
                box-sizing: border-box;
                .img {
                    float: left;
                    overflow: hidden;
                    height: 100%;
                    margin-right: 10%;
                    width: 40%;
                    border: 1px solid #ccc;
                    transition: all 1s;
                    transform: scale(1);
                    &:hover {
                        transform: scale(1.4);
                    }
                }
                .file {
                    >P {
                        width: 100%;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    float: left;
                    width: 50%;
                    white-space:nowrap; 
                    text-overflow: ellipsis;
                }
            }
            .progress {
                width: 50%;
                height: 100%;
                text-align: center;
                display: inline-block;
                vertical-align: top;
                line-height: 55px;
                .warn {
                    color: red;
                    height: 100%;
                    line-height: 45px;
                    vertical-align: middle;
                }
            }
            .tools {
                float: right;
                height: 100%;
                line-height: 45px;
            }
        }
    }
</style>
<script>
    import Phoenix from 'phoenix';
    import progressBar from 'phoenixUI/progressBar';
    import toast from 'phoenixUI/toast';
    import { VideoUpload,ImgUpload, getPic,getVideo } from './upload';
    export default Phoenix.createView({
        name: 'uploadArea',
        components: [ progressBar, toast ],
        data() {
            return {
                uploadList: [], // 上传的列表
                vedioUploadList:[],//视频上传列表
                warn: false,
                warnText: null
            };
        },
        ready() {
        },
        events: {
            'onUploadImg' (action, file) {
                getFiles(action, file);  
            }  
        },
        methods: {
            //获取视频信息
            getVideos(action, file){
                var oSize = 0;
                this.vedioUploadList.forEach(element => {
                    oSize = oSize + element.originalSize;   
                });
                oSize = oSize + file.size;
                if(oSize > 5368709120){
                    this.warn = true;
                    this.warnText = '视频最多只能上传5G';
                    return;
                }

                this.vedioUploadList.$set(this.vedioUploadList.length, VideoUpload(action, file, this.setPreVideo.bind(this)));
            },
            getFiles(action, file) {
                if(this.uploadList.length === 50) {
                    this.warn = true;
                    this.warnText = '图片上传限制50张';
                };
                this.uploadList.$set(this.uploadList.length, ImgUpload(action, file, this.setPreImg.bind(this)));
            },
            cancel(item) {
                item.abort && item.abort();
                this.uploadList.$remove(item);
            },
            enable(item) {
                if(item.final) {
                    this.$dispatch('onImgUploadSuccess', item);
                }
            },
            allEnable() {
                this.uploadList.forEach((v, i)=> {
                    if(v.final) {
                        this.$dispatch('onImgUploadSuccess', v);
                    }
                });
            },
            //插入视频
            insertVideo(item){
                if(item.final) {
                    this.$dispatch('onVideoUploadSuccess', item);
                }
            },
            //删除视频
            deleteVideo(item){
                item.abort && item.abort();
                this.vedioUploadList.$remove(item);
            },
            selectFile() {
                this.$dispatch('onImgAreaSelect');
            },
            setPreImg(item) {
                if(item.key) {
                    item.preImg = getPic({cdnKey:item.key,ext:item.ext}, 100, 45, true);
                }
            },
            setPreVideo(item) {
                if(item.key) {
                    // item.preVideo = getVideo(item.key); 
                    try {
                        item.preVideo = process.env.CDN + '/' + item.key;
                    } catch (error) {
                        console.log(error);   
                        this.warn = true;
                        this.warnText = '上传失败，再来一次吧';
                    }
                }
            }
        }
    });
</script>