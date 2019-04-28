<!--
    上面的那个头  有可能带按钮的
-->
<template>
   <div v-show = "show" id="teemo-confirm" v-el:confirm> 
       <div class="confirm-header">
           <!--弹框的头-->
            <div v-text = 'title'>
            </div>
            <i style="cursor: pointer;" class='iconfont icon-guanbi teemoguanbi' @click="cancelHandel"></i>
       </div>
       <div class="confirm-content" v-el:custom>
           <!--定制内容-->
           <slot>
           </slot>
           <!--传入的简单内容-->
           <div class="default-content" v-text = "customContent" v-if = "customContent">
                <p v-text = "customContent"></p>
           </div>
       </div>
       <!--按钮集中营-->
       <div v-if="confirmAction" class="confirm-wrap">
           <a @click = "confirmHandel" class="confirm-btn">确认</a>
           <a @click = "cancelHandel" class="cancel-btn">取消</a>
       </div>
   </div>
</template>
<script type='text/javascript'>
    import Phoenix from 'phoenix';
    export default Phoenix.createView({
        name: 'teemo-confirm',
        data() {
            return {

            };
        },
        props: {
            show: {
                type: Boolean,
                default: false,
                twoWay: true
            },
            customContent: {
                type: String
            },
            cancelAction: {
                type: Function
            },
            confirmAction: {
                type: Function
            },
            title: {
                type: String,
                required: true
            }
        },
        components: [],
        created() {},
        methods: {
            confirmHandel() {
                this.confirmAction();
            },
            cancelHandel() {
                this.show = false;
                this.cancelAction && this.cancelAction();
            }
        },
        watch: {
            show(n) {
                if (n) {
                    var st = document.body.scrollTop || document.documentElement.scrollTop;
                    var vh = document.body.clientHeight || window.innerHeight;
                    this.$els.confirm.style.top = st + vh / 2 - this.$els.confirm.offsetHeight / 2 + 'px';

                    console.log('st', st);
                    console.log('vh', vh);
                    console.log('this.$els.confirm.offsetHeight', this.$els.confirm.offsetHeight);
                }
            }
        },
        ready() {}
    });
</script>
<style type="text/css" src="./assets/iconfont.css"></style>
<style lang="less" scoped>
    @color: #4ab7ed;
    #teemo-confirm {
        min-width: 358px;
        position: absolute;
        top: 50%;
        left: 50%;
        border: 1px solid rgba(215, 215, 215, 1);
        z-index: 999;
        transform: translate(-50%, 0);
        .confirm-header,
        .confirm-content,
        .confirm-wrap {
            width: 100%;
        }
        .confirm-header {
            background: rgba(242, 242, 242, 1);
            display: flex;
            justify-content: space-between;
            height: 42px;
            line-height: 42px;
            padding: 0 6px;
            border-bottom: 1px solid rgba(215, 215, 215, 1);
            >div:nth-of-type(1) {
                font-size: 14px;
            }
        }
        .confirm-content {
            min-height: 178px;
            background: #fff;
            .default-content {
                height: 178px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    
    .teemoguanbi {
        transition: transform .5s ease;
        &:hover {
            transform: rotate(360deg);
        }
    }
    
    .confirm-wrap {
        border-top: 1px solid rgba(215, 215, 215, 1);
        display: flex;
        justify-content: center;
        background: #fff;
        height: 46px;
        align-items: center;
        a {
            &:nth-of-type(1) {
                margin-right: 30px;
            }
            width: 56px;
            height: 26px;
            text-align:center;
            line-height:26px;
            border-radius: 4px;
            cursor: pointer;
            &.confirm-btn {
                background: @color;
                color: #fff;
            }
            &.cancel-btn {
                background: rgba(215, 215, 215, 1);
                color: #1B1B1B;
            }
        }
    }
</style>