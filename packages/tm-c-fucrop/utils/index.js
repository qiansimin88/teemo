import crop from "cropperjs";
import layer from "phoenixUI/layer";
import mask from "phoenixUI/mask";
import loading from 'phoenixUI/loading';
import toast from 'phoenixUI/toast';
import {utilUpload, base64UrlToBlob} from '../utils/tools';

require("vue-style-loader!css-loader!cropperjs/dist/cropper.css");


let imgEl = null;
let inputEl = null;

export default {
    name: 'crop',
    props: {
        uniKey: {   //  同页面应用多个，唯一名
            type: String,
            default: ''
        },
        imgStyle: {
            type: Object,
            default: function () {
                return {}
            }
        },
        containerStyle: {
            type: Object,
            default: function () {
                return {}
            }
        },
        'data': {
            type: Object,
            default: function () {
            }
        },
        successed: {
            type: Function,
            required: true,
            default: function () {
            }
        },
        maxSize: {
            type: Number,
            default: 5
        },
        'viewMode': Number,
        'dragMode': String,
        'aspectRatio': Number, //比例 4／3 or 1/1
        'autoCropArea': Number,//和imgStyle相关、范围0-1
        // Size limitation
        'minCanvasWidth': Number,
        'minCanvasHeight': Number,
        'minCropBoxWidth': Number,
        'minCropBoxHeight': Number,
        'minContainerWidth': Number,
        'minContainerHeight': Number,

    },
    data () {
        return {
            cropImg: '',
            fileName: '',
            loadingVisible: false,
            toastShow: false,
            toastMsg: '',
            srcFile: null,
            show: false
        };
    },
    components: [layer, mask, loading, toast],
    ready(){},
    methods: {
        init(){
            return new Promise((resolve, reject) => {
                imgEl = window.document.getElementById('cropImg');
                let props = {
                    viewMode: 1,
                    dragMode: 'move',
                    background: false,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false
                };
                let {containerStyle, size, imgStyle, ...data} = this.$options.props;
                for (const key in data) {
                    if (this[key] !== undefined) {
                        props[key] = this[key];
                    }
                }
                props.cropend = this.cropped;
                this.crop = new Cropper(imgEl, props);
                // !this.crop && (this.crop = new Cropper(imgEl, props));
                resolve();
            });

        },
        loadFile(){
            if (!this.srcFile) return;
            let reader = new FileReader();
            reader.onload = (event) => {
                // rebuild cropperjs with the updated source
                this.crop.replace(event.target.result);
            };
            reader.readAsDataURL(this.srcFile);
        },
        showCrop(file, fileInputEl){
            let check = this.check(file);
            if (!check) return;
            this.srcFile = file;
            this.fileName = file.name;
            inputEl = fileInputEl || this.$parent.$el.querySelector("input[type='file']");
            this.show = true;
        },
        uploadCrop(){
            let cropImg = this.crop.getCroppedCanvas().toDataURL();
            if (!cropImg) {
                this.showToast('裁剪失败！');
                return;
            }
            this.changeLoading(true);
            this.show = false;
            utilUpload(base64UrlToBlob(cropImg), this.fileName).then(result => {
                this.successed && this.successed instanceof Function && this.successed(result.ret.result);
                this.changeLoading(false);
            }).catch(err => {
                console.warn(err);
                this.showToast("裁剪失败！");
                this.changeLoading(false);
            });
        },
        showToast(msg){
            this.toastShow = true;
            this.toastMsg = msg;
        },
        changeLoading(show){
            this.loadingVisible = show;
        },
        check(file){
            let filePass = this.checkFile(file);
            return filePass;
        },
        checkFile(file){
            // 仅限图片
            if (file.type.indexOf('image') === -1) {
                this.showToast('请上传图片');
                return false;
            }
            // 超出大小
            if (file.size / (1024 * 1024) > this.maxSize) {
                this.showToast('尺寸超过限制');
                return false;
            }
            return true;
        }
    },
    watch: {
        show: function (val) {
            if (!val) {
                this.crop && this.crop.clear();
                inputEl && (inputEl.value = null);
                return;
            }
            this.init().then(this.loadFile);
        }
    }
};