<template>
    <div>
        <div class="crop-window" v-if="show">
            <div class="crop-mask"></div>
            <div class="crop-layer">
                <div class="crop-Contain" :style="containerStyle">
                    <div class="action-div">
                        <i class="iconfont-fuavatar fuavatar-close" @click.stop="show=false"></i>
                        <i class="iconfont-fuavatar fuavatar-confirm" style="font-size: 22px;" @click.stop="uploadCrop"></i>
                    </div>
                    <img id="cropImg" :style="imgStyle"/>
                </div>
            </div>
        </div>
        <loading :show.sync="loadingVisible"></loading>
        <toast :show.sync="toastShow">{{toastMsg}}</toast>
    </div>
</template>
<script src="../utils/index.js">
</script>
<style scoped lang="less">
    @import "../assets/iconfont.css";

    .crop{
        &-window {
            width: 100%; height: 100%;
            position: fixed; left: 0; right: 0; top: 0; bottom: 0;
        }
        &-mask {
            height: 100%; width: 100%;
            position: fixed; left: 0; right: 0; top: 0; bottom: 0;
            background: rgba(55,55,55,.6); z-index: 665;
        }
        &-layer {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            height: 100%; z-index: 666;
        }
        &-Contain{
            position: relative;
            z-index: 999;
            .action-div{
                position: absolute;
                width: 100%;
                padding: 0 .1rem;
                top:.3rem;
                z-index: 9999;
                line-height: 0;
                display: flex;
                justify-content: space-between;
            }
            .iconfont-fuavatar{
                font-size: 18px;
                color: #ccc;
                padding: 4px;
            }
        }
    }

</style>