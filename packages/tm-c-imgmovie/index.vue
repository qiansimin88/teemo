<template> 
    <!-- 如同优美长镜头一般的图片全屏预览组件 -->
    <div class="imgmovie" v-show="imgshow" @click="imgshow=false">
        <div class="img-container" v-el:container :class="{rotate0: rotate0}">
            <i class="iconfont icon-youjiantou rotateX" @click.stop="prew" style="left: 5%;"></i>
            <!--图片的左半部分-->
            <div class="img-left ov">
                <img class="animateleft" :class="{animate: animate}" :src="throwImgSrc(imgSrcList[currentImg])" alt="">
            </div>
             <div class="img-right ov">
                <img class="animateright" :class="{animate: animate}" :src="throwImgSrc(imgSrcList[currentImg])" alt="">
            </div>
            <i class="iconfont icon-youjiantou" @click.stop="next" style="right: 5%;"></i>
            <!--图片的右半部分-->
        </div>
        <div class="index-style">{{currentImg + 1}} | {{imgSrcList.length}}</div>
    </div>
</template>
<script type='text/javascript'>
	import Phoenix from 'phoenix';
    import oss from 'tm-c-oss';
	export default Phoenix.createView({
		name: 'imgmovie',
		data (){
			return {
                rotate0: false,
                animate: false,
                timer: null
			};	
		},
        props: {
           imgshow: {           //图片是否显示
               type: Boolean,
               default: false,
               twoWay: true
           },
           imgSrcList: {        //图片的链接地址数组
               type: Array,
               default () {
                   return [];
               }
           },
           srcFiled: {          //图片数组当中真正的链接字段名   
               type: String,
               default: 'src'
           },
           currentImg: {            //索引
               type: Number,
               default: 0,
               twoWay: true
           }
        },
        methods: {
             throwImgSrc (now) {
                 var filed = '';
                if(now) {
                    filed = this.srcFiled;
                    var src = (oss.work || oss)({
                        id: now[this.srcFiled],
                        h: 800,
                        w: 800,
                        l: 1,
                        e: 0
                    });
                    return src;
                }
            },
            prew () {
                this.currentImg > 0 && this.currentImg --;
            },
            next() {
                 this.currentImg < this.imgSrcList.length-1 && this.currentImg ++;
            },
            animateShow () {
                clearTimeout(this.timer);
                this.animate = false;
                this.rotate0 = false;
                this.timer = setTimeout(() => {
                    this.rotate0 = true;
                    this.animate = true;
                }, 50);
            }
        },
        watch: {
            currentImg (v) {
              this.animateShow(); 
            },
            imgshow (v) {
                v && this.animateShow();
            }
        },
        computed: {
           
        },
		components : [	
		],
		ready (){
		}
	});					

</script>		
<style type="text/css" src="./assets/icon/iconfont.css"></style>
<style lang="less" scoped>
.imgmovie {
    width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 999; background: rgba(55, 55, 55, 0.6);
    .img-container {
        position: absolute; width: 100%; height: 100%; left: 0; top: 0;  display: flex; justify-content: center; align-items: center;
    }
}
.rotateX {
    transform: rotate(180deg);
}
.iconfont {
    font-size: 36px; color: #fff; position: absolute; top: 50%; cursor: pointer;
}
.ov {
    overflow: hidden;
}
.animate {
    transition: all .5s ease; 
}
.animateleft {
    transform-origin: right top; transform: rotate(180deg);
}
.animateright {
    transform-origin: left top; transform: rotate(-180deg); 
}
.rotate0 {
    img {
        transform: rotate(0deg);
    }
    .animateleft {
        transform: translateX(50%);
    }
    .animateright {
        transform: translateX(-50%);
    }
}

.index-style{
    position: absolute;
    width: 100px;
    height: 30px;
    text-align: center;
    margin-left: -50px;
    left: 50%;
    bottom: 100px;
    color: #fff;
    background: darkgrey;
    border-radius: 6px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
}
</style>	