import phoenix from 'phoenix';
import mask from 'phoenixUI/mask';
import layer from 'phoenixUI/layer';
import toast from 'phoenixUI/toast';
import progressBar from 'phoenixUI/progressBar';
import * as o from './src/options';
import loader from './src/loader';
import config from './src/config';
import Detector from './src/detector';
import * as editor from './src/editor';
import * as screen from './src/screen';
import * as util from './src/util';
import * as material from './src/material';
import shit from 'holy-shit';

var timer = null;
var angle = 0.005;

export default phoenix.createView({
    name: 'preview',
    data() {
        return {
            progress : 0,
            show : false,
            guiStatus : false,
            progressStatus : false,
            isFullScreen : false,
            bottomGUIStatus : false,
            showColor : false,
            screenWidth : 0,
            screenHeight : 0,
            vmFiles : [],
            vmCFiles : null,
            pos : 0, //一个pos代表一个移动单位
            vmPos : 0, //实际的移动单位,
            paging : 6, //分页显示数量
            loading : false, //是否处于loading状态
            loadModelIndex : 0,
            toastStatus : false,
            toastText : '',
            cMesh_name: null,
            cMesh_size_x: 0,
            cMesh_size_y: 0,
            cMesh_size_z: 0,
            cMesh_vertices: 0,
            cMesh_triangle: 0,
            cMesh_surface: 0,
            cMesh_volume: 0,
            color : o.meshColor,
            bgColor : null,
            isBgColor : false,
            mode : 'lambert'
        };
    },
    components : [ mask, layer, toast, progressBar ],
    watch : {
        color ( hex ){
            editor.cMesh.material.color.set( hex );
            editor.render();
        },
        bgColor ( hex ){
            editor.renderer.setClearColor( hex );
            editor.render();
        }
    },
    ready (){
        var { width, height } = util.getCurSize();
        this.screenWidth = width;
        this.screenHeight = height;

        document.body.addEventListener('click', e => {
            this.showColor = false;
        });

        //上传来的，或者接口来的files列表
        this.$on('preview-install', ( _files ) => {
            if( Array.isArray( _files ) ){
                o.files = _files;
            //可能是arguments, 或者 { '0' : Files, '1' : Files }
            } else {
                o.files = Array.prototype.concat.apply( [], _files );
            }
        });

        this.$on('preview-run', ( options = {} ) => {
            if( !Detector.webgl ){
                return this.showToast('您的浏览器暂不支持3D预览！');
            }
            //符合规范的文件
            var ok = o.files.filter( f =>  {
                return config.fileType.indexOf( f.type ) > -1 || util.isModel( f.name );
            });
            if( ok.length === 0 ){
                return this.showToast('仅支持STL, OBJ模型的预览！');
            }

            ok = ok.filter( f => {
                return util.bit2Mb( f.size ) <= config.sizeLimit;
            });
            if( ok.length === 0 ){
                return this.showToast('模型文件过大，暂不支持预览！');
            }

            var __files__ = [];
            ok.forEach(el => {
                __files__.push({
                    'size' : el.size,
                    'name' : el.name,
                    'type' : el.type,
                    'remote': el.remote
                });
            });
            this.vmFiles = __files__;
            o.files = ok;
            //gc
            __files__ = [];
            __files__.length = 0;

            if( this.vmFiles && this.vmFiles.length > 0 ){
                this.loadModelIndex = options.index || 0;   //还有其他地方会用
                util.loadTHREE().then(() => {
                    this.show = true;
                    util.loadControl().then(() => {
                        setTimeout(()=>{
                            editor.initialize();
                            this.loadModel( this.loadModelIndex );
                            editor.reload();
                        },0)
                    });
                });
            }
        });
        //监测全屏事件
        document.addEventListener( util.fullScreenChange(), this.screenChange );
        //分辨率更改同时对Layer做修改
        window.addEventListener( o.resizeEvt, () => {
            var { width, height } = util.getCurSize();
            this.screenWidth = width;
            this.screenHeight = height;
        });
    },
    methods : {
        gc (){
            o.files = [];
            o.files.length = 0;
            this.vmFiles = [];
            this.vmFiles.length = 0;
            editor.clearAll();
        },
        prev (){
            this.translate( -1 );
        },
        next (){
            this.translate( 1 );
        },
        //分页移动
        translate ( direct ){
            if( this.pos <= 0 && direct === -1 ||
                (this.pos >= (this.vmFiles.length - this.paging ) && direct === 1)){
                return;
            }
            this.pos += direct;
            this.$set('vmPos', {
                'transform' : `translate3d(-${ this.pos * 36 }px, 0, 0)`
            });
        },
        //加载模型
        loadModel ( index ){
            this.loading = true;
            this.progress = 0;
            this.progressStatus = true;
            this.loadModelIndex = index;
            var f = o.files[ index ];
            var from = util.isFile( f ) ? 'local' : 'net';
            this.vmCFiles = f;
            this.reset();

            loader( f , e => {
                this.progress = parseInt(( e.loaded / e.total ) * 100);
            }, from ).then( mesh => {
                clearTimeout( timer );
                timer = setTimeout(() => {
                    editor.scene.clear();
                    editor.objectsAdd( mesh );
                    editor.render();
                    this.progressStatus = false;
                    this.loadModelData();
                    this.loading = false;
                }, 1000);
            });
        },
        //全屏
        f12 (){
            this.isFullScreen ? screen.exit() : screen.enter();
        },
        close (){
            this.gc();
            this.show = false;
            o.fullScreenScore = 0;
            if( this.isFullScreen ){
                this.isFullScreen = false;
                screen.exit();
                editor.reload();
            }
        },
        screenChange (){
            //这里为啥不用isFullScreen呢?
            //因为退出全屏的时候可以按esc退出全屏,这样sysReqOutFs就不会执行,
            //而且浏览器还有一些其他进入全屏的入口,这些按钮无法捕捉
            //但是都会触发fullscreenchange
            //所以这里通过fullScreenScore来判断是否处于全屏状态
            if( o.fullScreenScore % 2 === 0 ){
                screen.enter();
            } else {
                screen.exit();
            }
            o.fullScreenScore += 1;
            this.isFullScreen = !this.isFullScreen;
            //在全屏状态下加载新的模型，
            //这时用esc按钮或者其他途径退出全屏,进度条的面积也随之改变
            editor.reload();
        },
        reset (){
            editor.controls.reset();
            editor.controls.handleResize();
            editor.camera.position.z = 200;
            editor.light.scale.set( 1, 1, 1 );
            editor.render();
        },
        direct (){
            //控制器 的 上下左右 及 远近
            var curr = editor.controls.getMoveCurr(),
                x = curr.x,
                y = curr.y;
            var negative = arguments[ 3 ] * o.distanceSpeed;
            if( arguments[0] == 1 ){
                x += angle * -negative;
            } else if( arguments[1] == 1 ) {
                y += angle * -negative;
            }
            if( arguments[2] == 1 ){
                editor.camera.translateOnAxis(new THREE.Vector3( 0, 0, 1), 1 * negative);
            } else {
                editor.controls.changeMoveCurr(new THREE.Vector2(x, y));
            }
            editor.render();
        },
        material ( mode ){
            switch( mode ){
                case 'lambert' : {
                    editor.cMesh.material = material.lambert();
                    editor.cMesh.material.wireframe = false;
                    editor.cMesh.material.color.set( this.color );
                    break;
                }
                case 'wireframe' : {
                    editor.cMesh.material.wireframe = true;
                    break;
                }
                case 'solid' : {
                    editor.cMesh.material = material.solid();
                    editor.cMesh.material.wireframe = false;
                    editor.cMesh.material.color.set( this.color );
                    break;
                }
                case '3d' : {
                    editor.cMesh.material = material.d3();
                    editor.cMesh.material.wireframe = false;
                    editor.cMesh.material.color.set( this.color );
                    break;
                }
            }
            this.mode = mode;
            editor.render();
        },
        light ( num ){
            var tmp = o.lightIntensity + num;
            if( tmp >= 0  && tmp <= 100 ){
                o.lightIntensity = tmp;
                editor.light.intensity = tmp / 100;
            }
            this.showToast( o.lightIntensity + '%');
            editor.render();
        },
        changeColor ( mode ){
            util.loadColorPick().then(() => {
                this.showColor = true;
                this.isBgColor = mode === 'bgColor';
                ColorPicker(document.getElementById('custom-color-pick'), ( hex, hsv, rgb, pickerCoordinate, sliderCoordinate ) => {
                    this[ mode ] = hex;
                });
            });
        },
        showToast ( text ){
            this.toastStatus = true;
            this.toastText = text;
        },
        toggleShapeGUI ( show ){
            this.bottomGUIStatus = show;
            o.extraHeight = show ? 150 : 0;
            editor.reload();
        },
        loadModelData (){
            var urlSplit = this.vmCFiles.name.lastIndexOf('/');
            //Name
            if( urlSplit === -1 ){
                this.cMesh_name = this.vmCFiles.name;
            } else {
                this.cMesh_name = this.vmCFiles.name.slice( urlSplit + 1 );
            }
            var info = shit.calc( editor.cMesh );

            //尺寸
            var geometry = editor.cMesh.geometry;

            this.cMesh_size_x = info.sizes.x;
            this.cMesh_size_y = info.sizes.y;
            this.cMesh_size_z = info.sizes.z;
            //顶点数
            this.cMesh_vertices = geometry.vertices.length;
            //三角数
            this.cMesh_triangle = this.cMesh_vertices / 3;
            //表面积
            this.cMesh_surface = info.area;
            //体积
            this.cMesh_volume = info.vol;
        }
    }
});
