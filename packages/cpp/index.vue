<template>
    <mask :show.sync="status"></mask>
    <layer :show.sync="status" 
        :style='{ "width": width + "px", "height": height + "px", 
            top: isFullScreen ? 0 : "20px",
            margin: isFullScreen ? 0 : "20px 0" }'>
        <div class="layer">
            <div class="canvas-container">
                <canvas id="main-scene" :class="{ 'fs': isFullScreen }"></canvas>
            </div>
            <div class="operation">
                <i @click="reset" class="lf icon-reset"></i>
                <i @click="enlarge" class="lf icon-fangda"></i>
                <i @click="shrinkdown" class="lf icon-suoxiao"></i>
                <i @click="fullScreen" class="lf icon-quanping" v-if="!isMobile"></i>
            </div>
            <div class="close" @click="close">
                <i class="lf icon-guanbi"></i>
            </div>
        </div>
    </layer>
</template>
<script>
    import * as pixi from 'pixi.js';
    import mask from 'phoenixUI/mask';
    import layer from 'phoenixUI/layer';
    import * as util from './util';

    const step = 5;
    const unit = 25;  //每移动25个单位，图片旋转`step`度
    const Direction = {
        left: "left",
        right: "right",
        down: "down",
        up: "up"
    };

    export default {
        name: "cpp",
        data (){
            return {
                width: 0,
                height: 0,
                isFullScreen: false,
                isMobile: false
            };
        },
        props: {    
            dfsid: {
                type: String,
                default: ""
            },
            status: {
                type: Boolean,
                default: false, 
                twoWay: true
            }
        },
        components: {
            mask,
            layer
        },
        created (){
            this.sprite = null;
            this.coordinate = { x: 0, y: 90 };  //初始坐标为0,90
            this.startX = 0;
            this.startY = 0;
            this.cacheDistance = 0;
            this.isMobile = util.isMobile();
            this.isFullScreen = !!this.isMobile;
            if( this.isFullScreen && this.isMobile ){
                util.openFullScreen();
            }
        },
        watch: {
            status ( b ){
                if( b === false ) return; 
                //reset scale
                util.resetScale();
                //clear cache
                pixi.utils.TextureCache = [];
                pixi.utils.TextureCache.length = 0;
                //cleear renderer
                this.renderer = null;
                this.resetCoordinate();
                //start
                this.start();
            }  
        },  
        ready (){
            this.initialize();
        },  
        destroyed (){
            this.path = null;
            //移除全部精灵
            this.stage.removeChildren();
        },
        methods: {
            initialize (){
                this.img = document.createElement("img");
                this.img.crossOrigin = "Anonymous";
                this.img.addEventListener("load", e => {
                    var baseTexture = new pixi.BaseTexture( e.path[ 0 ] );
                    var textureCache = this.fromCache();
                    //如果拖动速度比较快，可能会绕过上层的缓存判断，在执行阶段再判断一次.
                    if( textureCache ){
                        this.createSprite( textureCache );　
                    } else {
                        var texture = new pixi.Texture( baseTexture ); 　
                        this.createSprite( texture );　
                        pixi.Texture.addToCache( texture, this.key );      
                    }
                    this.render();
                });
              
                //更新view
                this.screen = util.screen();

                //container width, height
                this.width = this.screen.width;
                this.height = this.screen.height;
                this.aspect = this.screen.aspect;
                this.stage = new pixi.Container();

                window.onresize = window.onorientationchange = () => {
                    this.resize();
                };
            },
            start (){
                 //创建renderer
                this.renderer = pixi.autoDetectRenderer( this.screen.cWidth, this.screen.cHeight, {
                    view: document.getElementById("main-scene")
                }); 
                this.renderer.backgroundColor = 0x000000;
                //获取图片根路径
                this.path = util.imagePath( this.dfsid );
                //加载首图
                this.loadImage( 0, 90 );
                this.render();
            },  
            render (){
                this.renderer.render( this.stage );
            },
            resetCoordinate (){
                this.coordinate = { x: 0, y: 90 };
            },
            fromCache (){
                return pixi.utils.TextureCache[ this.key ];
            },
            loadImage ( x, y ){
                var imgPath = this.path( x, y );
                //cache key
                this.key = this.dfsid + '_' + this.screen.cWidth + "_" + this.screen.cHeight + "_" + x + "_" + y;
                //
                var texture = this.fromCache();
                //优先使用cache
                if( texture ){
                    this.createSprite( texture );
                    this.render();
                //无cache加载图片
                } else {
                    //Todo
                    //这个地方可以优化, 现在是图片没有加载完成后面的图片就不会加载
                    //可以做成队列, 速度会提供很多
                    this.imgLoaded = false;
                    this.img.src = imgPath;
                }
            },
            createSprite ( texture ){
                //第一次，将贴图转换为sprite
                //有了sprite之后只需更新sprite的texture属性就可以了
                if( this.sprite ){
                    this.sprite.texture = texture;
                } else {
                    this.sprite = new pixi.Sprite(
                        texture
                    );
                    this.sprite.interactive = true;
                    this.resizeSprite();
                    this.stage.addChild( this.sprite );
                    this.eventListener();
                }
            },
            resizeSprite (){
                //移动端可以占满100%
                //pc sprite占container的60%感觉效果最好, 可以调整
                var unit = this.isMobile ? 1 : 0.6;
                this.sprite.width = this.screen.width * unit;
                //sprite的高度按4:3生成, 如果按屏幕aspect生成，在手机上会拉伸变形
                this.sprite.height = this.sprite.width / 4 * 3;
            
                //不能超过container高度的90%
                if( this.sprite.height > this.screen.cHeight * 0.9 ){
                    this.sprite.height = Math.ceil(this.screen.cHeight * 0.9);
                }

                //更新sprite
                this.sprite.width += util.cw;
                this.sprite.height += util.ch;

                this.sprite.x = (this.screen.cWidth - this.sprite.width) / 2;
                this.sprite.y = (this.screen.cHeight - this.sprite.height) / 2;
            },
            parseEvent ( e ){
                if( e.touches && e.touches.length === 1 ){
                    return e.touches[ 0 ];  
                } 
                return e;
            },
            eventListener() {
                this.sprite.mousedown = this.sprite.touchstart = ({ data }) => {
                    var e = data.originalEvent;
                    e.preventDefault();
                    this.dragging = true;
                    var pos = this.parseEvent( e );
                    this.startX = pos.pageX;
                    this.startY = pos.pageY;
                };

                //up后加载大图
                this.sprite.mouseup = this.sprite.mouseupoutside = this.sprite.touchend = ({ data }) => {
                    this.dragging = false;
                    this.cacheDistance = 0;
                };

                //移动过程加载小图
                this.sprite.mousemove = this.sprite.touchmove = ({ data }) => {
                    if( !this.dragging ) return;
                    var e = data.originalEvent;    
                    var pos = this.parseEvent( e );     

                    var disx = pos.pageX -this.startX;
                    var disy = pos.pageY -this.startY;
                    var x = Math.pow( disy, 2 );
                    var y = Math.pow( disx, 2 );
                    var distance = Math.sqrt( x + y );
                    var direction = this.GetDirection( disx, disy );
                    var d = Math.ceil(Math.ceil( distance / unit ) * step);

                    if( d == this.cacheDistance ) return;
                    var tmpD = d;
                    d -= this.cacheDistance;
                    this.cacheDistance = tmpD;

                    switch ( direction ){
                        case Direction.up: {
                            this.UpdateBitMap( 0, -d );
                            break;
                        }
                        case Direction.down: {
                            this.UpdateBitMap( 0, d );
                            break;
                        }
                        case Direction.left: {
                            this.UpdateBitMap( -d, 0 );
                            break;
                        }
                        case Direction.right: {
                            this.UpdateBitMap( d, 0 );
                            break;
                        }
                    }
                };
            },
            GetDirection ( disx, disy ){
                if( Math.abs( disy ) >= Math.abs( disx ) ){
                    if( disy >= 0 ){
                        return Direction.down;
                    }
                    else if( disy < 0 ){
                        return Direction.up;
                    }
                }
                else if( Math.abs( disx ) >= Math.abs( disy ) ){
                    if( disx >= 0 ){
                        return Direction.right;
                    } else if( disx < 0 ){
                        return Direction.left;
                    }
                }
            },
            UpdateBitMap ( x, y ){
                if( this.coordinate.y < 180 ){
                    this.coordinate.x -= x;
                } else {
                    this.coordinate.x += x;
                }
                this.coordinate.y += y;
                this.coordinate = util.normalize( this.coordinate.x, this.coordinate.y );
                this.loadImage( this.coordinate.x, this.coordinate.y );
            },
            //这里不直接用this.scale, 因为在全屏时scale要恢复为1, 所以就在外部控制了
            resize (){
                //更新container长宽高
                this.screen = util.screen();
                this.width = this.screen.width;
                this.height = this.screen.height;
                this.aspect = this.screen.aspect;
                //更新canvas宽高
                this.renderer.resize( this.screen.cWidth, this.screen.cHeight );
                //调整图片在canvas中的位置
                this.resizeSprite();
                //更新图片根路径
                this.path = util.imagePath( this.dfsid );
                //加载当前角度的图片
                this.loadImage( this.coordinate.x, this.coordinate.y );
                //render
                this.render();
            },
            enlarge (){
                util.enlargeScale( this.sprite.width, this.sprite.height );
                this.resize();
            },
            shrinkdown (){
                util.shrinkdownScale( this.sprite.width, this.sprite.height );
                this.resize();
            },
            fullScreen (){
                this.isFullScreen = !this.isFullScreen;
                util.updateFullScreen();
                util.resetScale();
                this.resize();
            },  
            close (){
                this.status = false;
                if( !this.isMobile ){
                    this.isFullScreen = false;
                    util.closeFullScreen();
                }
                util.resetScale();
                this.resize();
                return;
            },
            reset (){
                util.resetScale();
                this.resetCoordinate();
                this.resize();
                // this.path = util.imagePath( this.dfsid );
                //加载首图
                // this.loadImage( 0, 90 );
                // this.render();
            }
        }
    }
</script>
<style src="./iconfont/iconfont.css"></style>
<style lang="less" scoped>
    #main-scene {
        margin: 15px; border-radius: 3px;
        &.fs {
            margin: 0; border-radius: 0;
        }
    }
    .layer {
        position: relative;
    }
    .canvas-container {
        position: relative;
        .canvas-mask {
            position: absolute; width: 100%; height: 100%; left:0; top:0;
            background: #fff; opacity: 0;
        }
    }
    .operation {
        position: absolute; bottom: 65px; left: 0; right: 0; margin: auto; color: #fff;
        width: 260px; 
        .lf {
            color: #444; background: #fff; padding: 12px; border-radius: 50%; 
            font-size: 24px; margin: 0 6px; font-weight: bold;
            &:hover {
                color: #777; cursor: pointer;
            }
        }
    }
    .close {
        position: absolute; right: 30px; top: 25px; color: #fff;
        .lf {
            font-size: 26px;
        }
        .lf:hover {
            color: #777; cursor: pointer;
        }
    }
</style>