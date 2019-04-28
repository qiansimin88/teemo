<template>
  <mask :show.sync="show"></mask>
  <layer :show.sync="show" :style="{ 'width': '800px' }">
    <div class="container">
        <div class="loading-mask" v-if="isLoading">
            <div class="progress-bar blue stripes">
                <span :style="{ 'width': loaded + '%' }"></span>
            </div>
        </div>
        <div id="stage"></div>
        <div class="info-container" v-if="info && whd && faces && vertices">
            <ul class="list-group">
                <li class="list-group-item">
                    <select class="form-control" v-model="printer">
                        <template v-for="( p, v ) in printers">
                            <option :value="v">{{ p }}({{ v.x }}*{{ v.y }}*{{ v.z }})</option>
                        </template>
                    </select>
                </li>   
                <li class="list-group-item" v-if="warning"><font color="red">{{ warning }}</font></li>
                <li class="list-group-item">表面积：{{ (info.area).toFixed( 2 ) }} cm<sup>2</sup></li>
                <li class="list-group-item">体积：{{ (info.volume).toFixed( 2 ) }} cm<sup>3</sup></li>
                <li class="list-group-item">长宽高：{{ whd.x }} * {{ whd.y }} * {{ whd.z }} mm</li>
                <li class="list-group-item">顶点数：{{ vertices }}个</li>
                <li class="list-group-item">三角数：{{ faces }}个</li>
                <li class="list-group-item">
                    <button class="btn btn-sm btn-default"
                        @click.stop="cancel">
                        取消
                    </button>
                    <button class="btn btn-sm btn-success"
                        @click.stop="save">
                        保存
                    </button>
                </li>
            </ul>   
        </div>
        <div class="more-features-wrap">
            <div class="features-contents">
                <div v-if="mode === 'view'">
                    <div class="view">
                        <img :src="value" 
                            v-for="( key, value ) in dirsImg"
                            width="40" height="40" @click.stop="switchFace( key )" />
                    </div>
                </div>
                <div v-if="mode === 'position'">
                    <label v-for="( key, value ) in position">{{ key }}: 
                        <input type="number" step="1" 
                            class="form-control-static" 
                            :value="value"
                            @change="retrive($event, 'position', key)" />
                    </label>
                </div>
                <div v-if="mode === 'scale'">
                    <label>xyz:
                        <input type="number" step="1" min="0.1" class="form-control-static" 
                            :value="xyz"
                            @change="retrive($event, 'scale', 'xyz')" />
                    </label>
                </div>
                <div v-if="mode === 'rotation'">
                    <label v-for="( key, value ) in rotation">{{ key }}: 
                        <input type="number" step="1" 
                            class="form-control-static" 
                            :value="value"
                            @change="retrive($event, 'rotation', key)" />
                    </label>
                </div>
            </div>
            <div class="more-features">
                <div class="more-features-mask"></div>
                <div class="buttons">
                    <div v-for="( key, btn ) in buttons"
                        class="button"
                        :title="btn.title"
                        @click="jumpTo( btn.mode, i )">    
                        <img :src="i === hotIndex ? btn.hot_icon : btn.default_icon" 
                            class="hot" width="40" height="40" />
                    </div>
                </div>
            </div>
        </div>  
    </div>
  </layer>
</template>
<script>
    import felver from 'felver';
    import mask from 'phoenixUI/mask';
    import layer from 'phoenixUI/layer';
    import loader from 'super-loader';
    import axios from 'axios';
    import editorInit from './util/editor';
    import * as dep from './util/dep';
    import oss from 'tm-c-oss';

    var changeEvent = { type: 'change' };
    var cameraDis = 240, EPS = 0.000001;

    export default {    
        name: 'repair',
        props: {
            show: {
                type: Boolean,
                default: false,
                twoWay: true
            },
            printers: {
                type: Object,
                default: {}
            },
            files: {
                type: [ File, FileList, Array, String ]
            },
            upload: {
                type: Boolean,
                default: true
            },
            onSave: {
                type: Function,
                default: function (){}
            },
            onError: {
                type: Function,
                default: function (){}
            },
            fileType: {
                type: String,
                default: 'stl'
            },
            alias: {
                type: String,
                default: ''
            }
        },
        data (){
            return {
                info: {},
                warning: '',
                whd: {
                    x: 0, y: 0, z: 0
                },
                vertices: 0,
                faces: 0,
                position: null,
                scale: null,
                rotation: null,
                xyz: 1,
                printer: null,
                hotIndex: 0,
                mode: 'view',
                loaded: 0,
                isLoading: false,
                dirsImg: {
                    "home": require('./icons/view_home.png'),
                    "front": require('./icons/view_front.png'),
                    "back": require('./icons/view_back.png'),
                    "left": require('./icons/view_left.png'),
                    "right": require('./icons/view_right.png'),
                    "top": require('./icons/view_top.png'),
                    "bottom": require('./icons/view_bottom.png')
                },
                buttons: [
                    {
                        default_icon: require('./icons/3DView_main.png'),
                        hot_icon: require('./icons/3DView_main_hot.png'),
                        title: '[ 视角 ] 切换场景视角',
                        mode: 'view'    
                    },
                    {
                        default_icon: require('./icons/move.png'),
                        hot_icon: require('./icons/move_hot.png'),
                        title: '[ 移动 ] 移动此模型位置',
                        mode: 'position'
                    },      
                    {
                        default_icon: require('./icons/scale.png'),
                        hot_icon: require('./icons/scale_hot.png'),
                        title: '[ 拉伸 ] 缩放模型大小',
                        mode: 'scale'
                    },
                    {
                        default_icon: require('./icons/rotate.png'),
                        hot_icon: require('./icons/rotate_hot.png'),
                        title: '[ 旋转 ] 旋转模型角度',
                        mode: 'rotation'
                    },
                    {
                        default_icon: require('./icons/tocenter.png'),
                        hot_icon: require('./icons/tocenter.png'),
                        title: '[ 居中置底 ] 将模型居中置底',
                        mode: 'center'
                    }
                ]
            }
        },
        watch: {
            printer ( rule ) {
                this.checkPrint( rule );
            },
            show ( status ){   
                if( !status ) return;
                this.loaded = 0;        
                this.isLoading = true;

                this.loadDeps(() => {
                    this.resize();
                    this.render();  

                    var load = loader( this.files, {
                        type: this.fileType,
                        alias: this.alias
                    });   

                    load.on('parse.load', ( event, object ) => {
                        //先清空场景
                        this.scene.clear();
                        //加入场景
                        this.mesh = object.mesh;
                        this.mesh.geometry.center();
                        this.mesh.material = this.MATERIAL;
                        this.scene.add( this.mesh );
                        this.controls.focus( this.mesh );
                        this.boxHelper.setFromObject( this.mesh );
                        this.updateModelData();
                        this.whdCache = Object.assign({}, this.whd, {});
                        this.isLoading = false;
                        this.toCenter();
                        this.render();  
                        //默认为第一个
                        this.$nextTick(() => {
                            this.printer = this.printers[Object.keys(this.printers)[ 0 ]];
                        });
                    });
                    load.on('upload.progress', ( event, progress ) => {
                        this.loaded = parseFloat(((progress.loaded / progress.total) * 100).toFixed(2));
                    }); 
                });
            }
        },
        components: { mask, layer },
        ready (){
            this.editor = null;
            dep.loadTHREE().then(() => {
                this.position = new THREE.Vector3( 0, 0, 0 );
                this.scale = new THREE.Vector3( 1, 1, 1 );
                this.rotation = new THREE.Vector3( 0, 0, 0 );
                this.MATERIAL = new THREE.MeshPhongMaterial({ color: 0xaaaaff, shading: THREE.FlatShading });
            });
        },
        methods: {
            loadDeps ( callback ){
                dep.loadEditorControl().then(() => {
                    dep.loadSTLLoader().then(() => {
                        this.editor = editorInit(document.getElementById('stage'));
                        this.scene = this.editor.scene;
                        this.boxHelper = this.editor.boxHelper;
                        this.controls = this.editor.controls;
                        this.camera = this.editor.camera;
                        this.render = this.editor.render;
                        this.resize = this.editor.resize;
                        this.cameraReset = this.editor.cameraReset;
                        return callback( this.editor );
                    });
                });
            },
            checkPrint ( rule ){
                if( !rule ) rule = this.printer;
                if( this.whd.x > rule.x || this.whd.y > rule.y || this.whd.z > rule.z ){
                    this.warning = '超出范围';
                } else {
                    this.warning = '';
                }
            },
            updateModelData (){
                this.info = felver.geometry.surfaceWithVolume( this.mesh.geometry );
                this.info.area /= 100;
                this.info.volume /= 1000;
                this.whd = felver.geometry.whd( this.mesh.geometry );
                this.vertices = felver.geometry.numOfTrianglesVertices( this.mesh.geometry );
                this.faces = felver.geometry.numOfTrianglesFaces( this.mesh.geometry );
            },
            jumpTo ( mode, index ){
                this.hotIndex = index;
                this.mode = mode;
                if( mode === 'center' ){
                    this.toCenter(); 
                }
            },
            toCenter (){
                if( !this.mesh ) return;
                this.mesh.position.set( 0, 0, this.whd.z / 2 );
                this.render();   
            },
        	switchFace ( face ) {
                let up = this.controls.upDirector;
        		switch ( face ) {
                    case 'home': {
                        this.cameraReset();
                        break;
                    }
        			case 'front': 
        			case 'back':
        				if ( Math.abs( up.x ) > Math.abs( up.z ) ) {
        					this.camera.up.set( Math.sign( up.x ) || 1, 0, 0 );
        				} else {
        					this.camera.up.set( 0, 0, Math.sign( up.z ) || 1 );
        				}
        				this.camera.position.set( 0, cameraDis * ( face === 'front' ? -1 : 1 ), 0 );
        				break;
    				case 'top':
	   				case 'bottom':
    					if ( Math.abs( up.x ) > Math.abs( up.y ) ) {
        					this.camera.up.set( Math.sign( up.x ) || 1, 0, 0 );
        				} else {
        					this.camera.up.set( 0, Math.sign( up.y ) || 1, 0 );
        				}
    					this.camera.position.set( 0, 0, cameraDis * ( face === 'top' ? 1 : -1 ) );
    					break;
    				case 'left': 
    				case 'right': 
    					if ( Math.abs( up.y ) > Math.abs( up.z ) ) {
    						this.camera.up.set( 0, Math.sign( up.y ) || 1, 0 );
    					} else {
    						this.camera.up.set( 0, 0, Math.sign( up.z ) || 1 );
    					}
    					this.camera.position.set( cameraDis * ( face === 'left' ? -1 : 1 ), 0, 0 );
        				break;
        		}
        		this.camera.lookAt( this.scene.position );
                this.controls.center.copy( this.scene.position )
                this.controls.updateUpDirector();
				this.controls.dispatchEvent( changeEvent );
        	},
            retrive ( event, method, prop ){
                if( !this.mesh ) return;

                var value = parseFloat( event.target.value );
                
                if ( prop == 'xyz' ) {
                    //view更新
                    this.xyz = value;
                    //this.whdCache.x * this.xyz, 是根据原始大小scale后的大小,
                    var will = this.whdCache.x * this.xyz;
                    //预期大小 除以 实际的大小 等于实际scale的系数
                    var actual = will / this.whd.x;
                    //变换geometry
                    this.mesh.geometry.scale( actual, actual, actual );
                } else {    
                    switch ( method ) {
                        case 'position':
                            this.position[ prop ] = value;
                            this.mesh.position[ prop ] = this[ method ][ prop ];   
                            break;
                        //ratation 影响置底功能，所以也使用geometry的rotateX, rotateY, rotateZ功能
                        case 'rotation':
                            this.rotation[ prop ] = value;
                            this.mesh.geometry[ 'rotate' + prop.toUpperCase() ]( 
                                this.rotation[ prop ] / THREE.Math.RAD2DEG
                            );
                            break;
                    }
                }
                this.updateModelData();
                this.checkPrint();
                this.render();
            },
            save (){    
                if( this.warning ) return;
                if( this.upload ){
                    this.loaded = 0;
                    this.isLoading = true;
                    dep.loadSTLExporter().then(() => {
                        //转换为stl
                        var exporter = new THREE.STLExporter();
                        var newSTL = exporter.parse( this.mesh );
                        //设为流文件，模拟表单提交
                        var blob = new Blob([ newSTL ], { type: "application/octet-stream" });
                        var form = new FormData();
                        form.append( "file", blob, this.alias || this.mesh.name );
                        var uri = window.export_minas.FileUploadAddr + '?category=printTask';
                        return axios.post( uri, form, {
                            onUploadProgress: (({ loaded, total }) => {
                                //更新上传进度
                                this.loaded = (( loaded / total ) * 100).toFixed( 2 );
                            })
                        }).then(({ data }) => {
                            this.isLoading = false; 
                            this.onSave( data.ret );
                        }).catch( this.onError );
                    });
                } else {
                    this.onSave( this.mesh );
                }
            },
            cancel (){
                this.show = false;
            }
        }       
    } 
</script>
<style lang="less" scoped>
.form-control, .form-control-static {
    padding: 5px 7px; border: 1px solid #ddd;
    border-radius: 3px; outline: none;
    color: #666;
}
.container {
    position: relative; height: 600px;
}

#stage {
    position: absolute; left: 0; top: 0; width: 100%; height: 600px;
}
.more-features-wrap {
    position: absolute; left:0; right: 0; bottom: 20px;
}
.more-features-mask {
    position: absolute; z-index: 0; 
}
.more-features {
    display: flex; position: relative;
    flex-direction: column;
    align-items: center;
    clear: both; margin:auto;
    .buttons {
        display: flex; z-index: 333;
    }
    .button {
        text-align: center; padding:2.5px 5.5px;
        cursor: pointer;
    }
}
.features-contents { 
    display: flex; flex-direction: column;
    align-items: center; margin-bottom: 20px;
    .view {
        img { margin: 5px; cursor: pointer; }
    }
}
.info-container {
    position: absolute; right: 0; top: 0; z-index: 1000;
    padding: 5px;
    .list-group {
        background-color: rgba( 255, 255, 255, 0.7 );
        border: 1px solid #ddd; border-radius: 3px;
        font-size: 14px;
        .list-group-item {
            padding: 10px 20px; border-bottom: 1px solid #ddd;
            &:last-child{ border: none; }
        }
    }
}
.loading-mask {
    position: absolute; left:0; top: 0; 
    z-index:  2000; background-color: rgba( 0, 0, 0 , .7 );
    padding: 0 100px; width: 100%; height: 100%;
    border-radius: 3px;
}

.progress-bar {
    background-color: #1a1a1a;
    height: 25px;
    padding: 5px;
    margin-top: 50%; 
    top: -12.5px; 
    position: relative;
    border-radius: 5px;
    box-shadow: 0 1px 5px #000 inset, 0 1px 0 #444;   
    text-align: left;
    span {
        display: inline-block;
        height: 100%;
        border-radius: 3px;
        box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
        transition: width .4s ease-in-out;    
    }      
    &.blue span {
        background-color: #34c2e3;   
    }
}

</style>
