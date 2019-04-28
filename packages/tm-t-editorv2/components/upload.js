 /**
  * 处理文件上传
  */
 class FileUpload {
    constructor(action, file) {
        this.action = action;
        this.file = file;
        this.onprogress = null;
        this.abort = null;
    }
    upload (){
        return new Promise((resolve, reject)=> {
            let xhr = new window.XMLHttpRequest();
            let data = new window.FormData();
            data.append('file', this.file);
            xhr.addEventListener('error', e => {
                reject(e);
            });
            xhr.addEventListener('loadend', e => {
                if(xhr.status > 400) {
                    reject(e);
                }
                resolve(e);
            });
            xhr.upload.addEventListener('progress', e => {  
                this.onprogress && this.onprogress(window.parseInt((e.loaded / e.total) * 100));
            });
            this.abort = ()=> {
                xhr.abort();
            };
            xhr.open('post', this.action);
            console.log('add token upload');
            xhr.setRequestHeader('X-Auth-Token', window.localStorage.session_token);
            xhr.send(data);
        });
    }
}


/**
 * 默认的图片 
 */
const defaultPreImg = [
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAlklEQVRoQ+3S0QkAIRDFQG3Wau1JewgERHL/+8DMzb3WGR98s4c8ppjIYyAjkUSkAv1aUlg8mwhOJx0mIoXFs4ngdNJhIlJYPJsITicdJiKFxbOJ4HTSYSJSWDybCE4nHSYihcWzieB00mEiUlg8mwhOJx0mIoXFs4ngdNJhIlJYPJsITicdJiKFxbOJ4HTSYSJSWDx7AfXrgbHsdWf0AAAAAElFTkSuQmCC',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAlUlEQVRoQ+3SwQkAIRDFUO2/NXvSHgKBQbL3+WDe7nPuXR98u4cMU0xkGMhKJBGpQL+WFBbPJoLTSYeJSGHxbCI4nXSYiBQWzyaC00mHiUhh8WwiOJ10mIgUFs8mgtNJh4lIYfFsIjiddJiIFBbPJoLTSYeJSGHxbCI4nXSYiBQWzyaC00mHiUhh8WwiOJ10mIgUFs8+2MWzf9KEpLkAAAAASUVORK5CYII=',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAl0lEQVRoQ+3S0QkAIRDFQO2/AnuyJ+0hEBDJ/e8DMzfX3md88M0e8phiIo+BjEQSkQr0a0lh8WwiOJ10mIgUFs8mgtNJh4lIYfFsIjiddJiIFBbPJoLTSYeJSGHxbCI4nXSYiBQWzyaC00mHiUhh8WwiOJ10mIgUFs8mgtNJh4lIYfFsIjiddJiIFBbPJoLTSYeJSGHx7AULuZ+TitWgBQAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAmElEQVRoQ+3S0QnAIBTFUJ3JnbqT0+oOgYCU9P9dMKdzffuMH3yzhzymmMhjICORRKQC/VpSWDybCE4nHSYihcWzieB00mEiUlg8mwhOJx0mIoXFs4ngdNJhIlJYPJsITicdJiKFxbOJ4HTSYSJSWDybCE4nHSYihcWzieB00mEiUlg8mwhOJx0mIoXFs4ngdNJhIlJYPHsBAQdtxfLQN18AAAAASUVORK5CYII=',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAlklEQVRoQ+3S0QnAIBTF0Oey7uS0dYdAQEr6/y6Y0zVnf/ODb/WQxxQTeQxkEklEKtCvJYXFs4ngdNJhIlJYPJsITicdJiKFxbOJ4HTSYSJSWDybCE4nHSYihcWzieB00mEiUlg8mwhOJx0mIoXFs4ngdNJhIlJYPJsITicdJiKFxbOJ4HTSYSJSWDybCE4nHSYihcWzF5pyY8/lEVAiAAAAAElFTkSuQmCC' 
];

function getdefalutPreImg() {
    let length = defaultPreImg.length;
    return defaultPreImg[Math.floor(Math.random() * length)];
}

function b2Size(bytes) {
    if (bytes === 0) return '0 B';
    let k = 1000; // or 1024
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function getPic(cdnKey, w, h, isFixed) {
    w = window.parseInt(w);
    h = window.parseInt(h);
    if(!process.env.CDN) {
        throw new Error('process.env.CDN is not defined');
    }
    return process.env.CDN + '/' + cdnKey + '@_100q' + '_' + w + 'w' + (h ? '_' + h + 'h' : '') +'_1e_1c_' + (!isFixed ? '1l' : '') + '.jpg';
}
/**
 * 图片上传对象 
 */
class ImgFile {
    constructor(file) {
        this.name = file.name;
        this.size = b2Size(file.size);
        this.persent = file.persent || 0; // 完成进度 0~ 100
        this.preImg = getdefalutPreImg(); // 上传之后的图片预览地址
        this.err = false; // 出错标志
        this.final = false; // 图片过程是否结束标志
        this.abort = null; // 终止上传的过程
    }
}
/**
 * 获取图片原始宽高
 * @param file对象
 */
let getImgSize = function(file) {
    let READER = new window.FileReader();
    let IMG = new window.Image();
    return new Promise((resolve, reject)=> {
        READER.readAsDataURL(file);
        READER.onload = e => {
            IMG.src = e.target.result;
            IMG.onload = () => {
                resolve({
                    width: IMG.width,
                    height: IMG.height
                });
            };
            IMG.onerror = () => {
                console.log('error');
                reject('读取图片错误');
            };
        };
        READER.onerror = () => {
            reject('读取图片错误');
        };
    })
};
/**
 * 图片上传工厂
 * 组合打包target对象
 * @param action {string} 图片上传地址
 * @param file {file} 文件对象
 * @param cb {Function} 上传的回调
 * @return target {Promise}
 */
function ImgUpload(action, file, cb) {
        let target = new ImgFile({
            name: file.name,
            size: file.size
        });
        let payLoad = new FileUpload(action, file);
        payLoad.onprogress = persent => {
            target.persent = persent;
        };
        Promise.all([payLoad.upload(), getImgSize(file)])
            .then(data => {
                /**
                 * 上传数据的处理
                 */
                let res = JSON.parse(data[0].target.responseText);
                target.key = res.ret.result.dfsId;
                cb && cb(target);
                /**
                 * 图片尺寸的处理
                 */
                target.width = data[1].width;
                target.height = data[1].height; 

                target.final = true;
            })
            .catch(err => {
                console.warn('upload load error: ', err);
                target.err = true;
            })
        target.abort = payLoad.abort.bind(payLoad);
        return target;
}

export default FileUpload;
export { ImgUpload, getPic };
