<template>
    <div :class="customClass">
        <input type="file" class="index-upload-file-button"
               name="{{ name }}"
               id="{{ name }}"
               accept="{{ accept }}"
               v-on:change="fileInputChange"
               multiple="{{ multiple }}" />
        <slot></slot>
    </div>
</template>
<script type="text/javascript">

    const d = new Date().getTime();

    export default {
        name : `fUpload${d}`,
        props: {
            name: {
                type: String,
                default (){
                    return `file_upload_${d}`;
                }
            },
            action: {
                type : String,
                required : true
            },
            multiple: String,
            headers: {
                type: Object,
                default (){
                    return {};
                }
            },
            method : {
                type : String,
                default : "POST"
            },
            format : {
                type : String,
                dafault : ''
            },
            maxsize : {
                type : Number,
                default : NaN
            },
            customClass: String,
            stop: {
                type: Function,
                default: null
            }
        },
        data () {
            return {
                iFiles: [], //保存文件列表
                formatReg : null,
                accept: null,
	            eventAction: null
            };
        },
        mounted() {
          this.init();
        },
        ready (){
          this.init();
        },
        methods: {
        	init() {
		        this.eventAction = this.$dispatch ? this.$dispatch : this.$emit;
		        this.formatReg = new RegExp(`^.+\.(${ this.format })$`, "i"); // eslint-disable-line
		        this.accept = this.format && this.format.split('|').map( v => '.' + v ).join(',');
            },
            updateFiles(value) {
	            document.getElementById( this.name ).files = value;
            },
	        updateFilesByName(value, name) {
		        if ( this.name !== name ) return;
		        // value可能不是FileList对象，所以不是直接赋值给Input
		        this.iFiles = value;
		        // 上传之前做外置判断，来决定是否继续上传
		        if ( this.stop && this.stop( this.iFiles ) ) return;
		        this.eventAction( 'onFileChange', this.iFiles, this.name );
		        this.fileUpload();
            },
            uuid() {
                let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                let uuid = new Array(36);
                let rnd=0;
                let r;

                for (let i = 0; i < 36; i++) {
                    if (i===8 || i===13 ||  i===18 || i===23) {
                        uuid[i] = '-';
                    } else if (i===14) {
                        uuid[i] = '4';
                    } else {
                        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }

                return uuid.join('');
            },
            fileInputChange ( e ) {
                //当文件改动触发的回调
                let srfFiles = document.getElementById( this.name ).files;
                if ( this.stop && this.stop( this.srfFiles ) ) return;
                if( srfFiles ){
                    this.iFiles = Array.prototype.slice.call( srfFiles, 0 ).map( file=>{
                        return Object.assign(file,{_uuid: this.uuid()});
                    });
                }
                this.eventAction( 'onFileChange', this.iFiles, this.name );
                this.fileUpload();
            },
            _onProgress ( file, e ) {
                //增加一个percent字段为当前上传百分比
                e.percent = ( e.loaded / e.total ) * 100;
                //触发onProgress的文件
                this.eventAction( 'onFileProgress', file, e, this.name );;
            },
            _handleResponse( xhr ) {
                let res;
                try {
                    res = JSON.parse( xhr.responseText );
                    res.status = xhr.status;
                    res.statusText = xhr.statusText;
                } catch ( _err ) {
                    res = xhr.responseText;
                }
                return res;
            },
            _handleUpload ( file ) {
                this.eventAction( 'onBeforeFileUpload', file, this.name );

                let form = new window.FormData();
                let xhr = new window.XMLHttpRequest();

                try {
                    form.append('Content-Type', file.type || 'application/octet-stream');
                    //上传文件的key设为file
                    form.append('file', file);
                } catch ( err ) {
                    return this.eventAction( 'onFileError', file, err );
                }

                return new Promise(( resolve, reject ) => {
                    xhr.upload.addEventListener('progress', e => {
                        this._onProgress( file, e );
                    }, false);

                    xhr.onreadystatechange = () => {
                        if ( xhr.readyState < 4 ) return;

                        if ( xhr.status < 400 ) {
                            let res = this._handleResponse( xhr );
                            this.eventAction( 'onFileUpload', file, res );
                            resolve( file, res );
                        } else {
                            let res = this._handleResponse( xhr );
                            this.eventAction( 'onFileError', file, res );
                            reject( file, res );
                        }
                    };

                    xhr.onerror = () => {
                        let err = this._handleResponse( xhr );
                        this.eventAction( 'onFileError', file, err );
                        reject( err );
                    };

                    xhr.open( this.method, this.action, true );

                    //写入头部

                    // 默认传入X-Auth-Token，如果用户传了，优先使用用户自定义
                    if(!this.headers['X-Auth-Token']) this.headers['X-Auth-Token'] = window.localStorage.session_token;

                    if ( this.headers ) {
                        for( let header in this.headers ) {
                            xhr.setRequestHeader( header, this.headers[ header ] );
                        }
                    };

                    xhr.send( form );

                    //触发上传之后的回调
                    this.eventAction( 'onAfterFileUpload', file );
                });
            },
            fileUpload () {
                if( this.iFiles.length === 0 ) {
                    let err = new Error({
                        "code" : 1,
                        "message" : "No files to upload for this field"
                    });
                    this.eventAction( 'onFileError', this.iFiles, err );
                    return false;
                }

                let formatErrors = [];
                let limitErrors = [];

                let arrayOfPromises = Array.prototype.slice.call( this.iFiles, 0 ).map( file => {
                    if( !this.format || this.formatReg.test( file.name )){
                        if( isNaN( this.maxsize ) || file.size < this.maxsize * 1e6 ){
                            return this._handleUpload( file );
                        } else {
                            limitErrors.push( file );
                        }
                    } else { //验证失败, 不符合格式
                        formatErrors.push( file );
                        return;
                    }
                });

                //验证格式完毕
                if( formatErrors && formatErrors.length > 0 ){
                    this.eventAction( 'onAfterFormat', formatErrors, this.format );
                }
                if( limitErrors && limitErrors.length > 0 ){
                    this.eventAction( 'onAfterCompareSize', limitErrors, this.maxsize );
                }

                //等待所有文件上传完毕
                Promise.all( arrayOfPromises ).then( allFiles => {
                    this.eventAction( 'onAllFilesUploaded', allFiles );
                }).catch( err => {
                    this.eventAction( 'onFileError', this.iFiles, err );
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .il {display: inline-block;}
    .index-upload-file-button {
        position: absolute; top:0; left: 0; width: 100%; height: 100%; z-index: 2; opacity: 0;
    }
</style>
