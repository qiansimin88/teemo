<template>
    <div>
        <mask :show="show"></mask>
        <layer :show="show" size="large" >
            <div class="cropContain" :style="containerStyle">
                <div class="action-div">
                    <i class="iconfont-fuavatar fuavatar-close" @click.stop="show=false"></i>
                    <i class="iconfont-fuavatar fuavatar-confirm" style="font-size: 22px;" @click.stop="uploadCrop"></i>
                </div>
                <img id="cropImg" :style="imgStyle"/>
            </div>
        </layer>
        <loading :show.sync="loadingVisible"></loading>
        <toast :show.sync="toastShow">{{toastMsg}}</toast>
    </div>
</template>
<script src="../utils/index.js">
</script>
<style scoped lang="less">
    @import "../assets/iconfont.css";
    .cropContain {
        position: relative;
        .action-div{
            position: absolute;
            width: 100%;
            z-index: 999;
            top:20px;
            padding: 0 10px;
            line-height: 0;
            display: flex;
            justify-content: space-between;
        }
        .iconfont-fuavatar{
            font-size: 20px;
            color: #ccc;
            padding: 4px;
            cursor: pointer;
            &:hover{
                color: #0074ff;
            }
        }
    }

</style>