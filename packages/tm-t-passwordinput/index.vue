<template>

    <div class="wrap" v-if="type==='pc'">
        <div v-if="!isShow" class="item flex-row" :style="{'width':width+'px'}">
            <input class="input item-input" type="password" style="width: inherit;" v-model="data" autocomplete="off"
                   autocapitalize="off" :placeholder="placeHolder"/>
            <i class="iconfont-password icon-biyanbukejian icon" style="height: 40px; line-height:40px;" @click="change()"></i>
        </div>
        <div v-if="isShow" class="item flex-row" :style="{'width':width+'px'}">
            <input class="input item-input" type="text" style="width: inherit;" v-model="data" autocomplete="off"
                   autocapitalize="off" :placeholder="placeHolder"/>
            <i class="iconfont-password icon-daijiance icon" style="height: 40px; line-height:40px;" @click="change()"></i>
        </div>
    </div>

    <div class="wrap-m" v-if="type==='mobile'">
        <div v-if="!isShow" class="item flex-row" style="align-items: center;" :style="{'width':width}">
            <input class="input m-input" type="password" style="width: inherit;padding: 0;" v-model="data" autocomplete="off"
                   autocapitalize="off" :placeholder="placeHolder"/>
            <i class="iconfont-password icon-biyanbukejian icon icon-m" @click="change()"></i>
        </div>
        <div v-if="isShow" class="item flex-row" style="align-items: center;" :style="{'width':width}">
            <input class="input m-input" type="text" style="width: inherit;padding: 0;" v-model="data" autocomplete="off"
                   autocapitalize="off" :placeholder="placeHolder"/>
            <i class="iconfont-password icon-daijiance icon icon-m" @click="change()"></i>
        </div>
    </div>

</template>
<script>
    import Phoenix from 'phoenix';
    export default Phoenix.createView({
        name: 'passwordInput',
        props: {
            'data': {
                default: '',
                twoWay: true
            },
            'placeHolder':{
                default:'请输入密码'
            },
            'width':{
                default:'298'
            },
            'type':{
                default:'pc'
            }
        },
        data(){
            return {
                isShow: false
            };
        },
        methods: {
            change(){
                this.isShow = !this.isShow;
            }
        },
        watch: {
//            'data': function (val) {
//                console.log(val);
//            }
        }
    });
</script>
<style lang="less" scoped>
    @import "./assets/phoenix.min.css";
    @import "./assets/iconfont/iconfont.css";
    @import "./assets/common.less";
    .wrap {
        font-size: 14px;
        color:#666;
    }
    .wrap-m {
        font-size: .3rem;
        color:#ccc;
    }

    .item{
        width: inherit;
        position: relative;
        align-items: center;
    }

    .item-input{
        padding: 0 30px 1px 10px;
        height: 40px;
        flex: 1;
    }

    .icon{
        position: absolute;
        right: 10px;
        top: 0;
        cursor: pointer;
        color: #999!important;
        font-size: 14px;
    }

    .icon-m{
        right: .2rem;
        font-size: .3rem;
    }

</style>