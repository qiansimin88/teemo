<template>
<div class='previewImg' v-if='showPreview' @click='closeDialog()'>
  <div class='imgContain'>
      <img class='originalImg' :src='loadImg(imgs[index])' @click.stop=''>
      <!-- <i class='iconfont close' @click.stop='closeDialog()'>&#xe60d;</i> -->
    </img>
  </div>
    <i class='iconfont pre icon-pre' @click.stop='pre()' v-if='index>0'></i>
    <i class='iconfont next icon-iconnextarrow' @click.stop='next()' v-if='index<imgs.length-1'></i>
</div>
</template>
<script type='text/javascript'>
import Phoenix from 'phoenix';
import oss from './util/ossImgUtil';
export default Phoenix.createView({
    name: 'previewImg',
    data() {
        return {};
    },
    ready() {
        let windowInnerWidth = window.innerWidth;
        this.imgWidth = parseInt(windowInnerWidth * 0.9, 10);
        this.imgHeight = parseInt(this.imgWidth * 0.75, 10);
    },
    props: {
        index: {
            type: Number,
            default: 0
        },
        imgWidth: {
            type: Number
        },
        imgHeight: {
            type: Number
        },
        imgs: {
            type: Array
        },
        showPreview: {
            type: Boolean
        }
    },
    methods: {
        closeDialog() {
            this.showPreview = false;
        },
        pre() {
            this.index--;
        },
        next() {
            this.index++;
        },
        loadImg(key) {
            return oss.loadPreviewImg(key, this.imgWidth, this.imgHeight);
        }
    },
    watch:{
      'showPreview':function(val){
        // console.log(this.showPreview);
      }
    }
});
</script>
<style lang='less'>
.previewImg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
    background: rgba(55,55,55,.6);
    i {
        font-size: 36px;
        color: #fff;
    }
    .pre {
        position: absolute;
        top: 50%;
        left: 5%;
        cursor: pointer;
    }
    .next {
        position: absolute;
        top: 50%;
        right: 5%;
        cursor: pointer;
    }
    .close {
        position: absolute;
        // right: 5%;

    }
    .originalImg {
      max-width: 80%;
      max-height: 80%;
    }
    .imgContain{
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      -js-display: flex;
      align-items: center;
      justify-content: center;
    }

}
</style>
<style type="text/css" src="./assets/iconfont/iconfont.css"></style>
