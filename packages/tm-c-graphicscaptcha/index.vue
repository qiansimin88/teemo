<template>
    <div class="container">
        <div class="captcha-box">
            <!--验证码图片-->
            <img :src="captcha" alt="">
            <div class="captcha-placeholder">
                <!--icon占位-->
                <span v-for="o in placeholderList" @click="choose(o, $index)">
                    <i class="icon iconfont icon-122" :class="{show: o.show}"></i>
                </span>
            </div>
        </div>
        <div>
            <p>请点击左边</p>
            <p>图片出现的</p>
        </div>
        <div>
            <!--需要去选择的图片-->
            <img :src="selectImg" alt="">
            <!--刷新图形验证码-->
            <span class="refresh" @click="refresh">
                <i class="icon iconfont icon-shuaxin"></i>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'graphicscaptcha',
        props: {
            //图形验证码的SRC或者BASE 64
            captcha: {
                type: String,
                required: true
            },
            //需要去选择的图片地址或者base64
            selectImg: {
                type: String,
                required: true
            },
            token: {
                type: String
            },
            //得到选中的位置
            positionArray: {
                type: String,
                twoWay: true,
                required: true
            }
        },
        data() {
            return {
                placeholderList: [
                    {
                        position: 0,
                        show: false,
                    },
                    {
                        position: 1,
                        show: false,
                    },
                    {
                        position: 2,
                        show: false,
                    },
                    {
                        position: 3,
                        show: false,
                    },
                    {
                        position: 4,
                        show: false,
                    },
                    {
                        position: 5,
                        show: false,
                    }
                ]
            };
        },
        methods: {
            choose (o, i) {
                o.show = !o.show;
            },
            //刷新
            refresh () {
                this.$dispatch("refresh");
                this.placeholderList.map(o => o.show = false);
            }
        },
        computed: {
            positionArray () {
                var nowChoose = this.placeholderList.filter(o => o.show === true);
                return (nowChoose.map(o => o.position)).join('|');
            }
        },  
        ready () {
        }
    };
</script>
<style type="text/css" src="./assets/iconfont.css" scoped></style>
<style lang="less" scoped>
.container {
    display: flex; font-size: 12px;
    div:nth-of-type(2) {
        width: 75px; padding: 2px 5px 0 5px; text-align: center; color: #c00;
    }
    div:nth-of-type(3) {
        display: flex; align-self: center;
        img {
            height: 30px; width: 30px;
        }
        .refresh {
            i {
                font-size: 20px; cursor: pointer;
            }
        }
    }
}
.captcha-box {
    width: 150px; height: 37.5px; position: relative;
    img {
        width: 150px; height: 37.5px;
    }
    .captcha-placeholder {
        position: absolute; height: 37.5px; width: 132px; top: 0; left: 9px;
        display: flex;  justify-content: center;
        span {
            width: 22px; text-align: center; height: 18px; overflow: hidden; color: red; line-height: 18px; padding: 10px 0; cursor: pointer; display: inline-block; box-sizing: content-box;
            i {
                display: none;
            }
        }
    }
}
.show {
    display: block!important;
}
</style>