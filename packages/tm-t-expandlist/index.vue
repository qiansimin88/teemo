<template>
    <div class="wrap" @mouseover="isHidden=false"  @mouseout="isHidden=true">
        <div class="flex-column border">
            <div class="content" style="padding-right: 0;">
                <span>{{curItem.v}}</span>
                <i :class="['iconfont-expandlist',isHidden?'icon-xiangxia':'icon-xiangxia-copy']"></i>
            </div>
        </div>
        <div style="position: absolute;">
            <div :class="['list-wrap',isHidden?'hidden':'']" :style="{'width':containWidth+'px'}">
                <span class="item" v-for="item in list" @click="click(item)" v-html="item.k"></span>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import Phoenix from 'phoenix';
    export default Phoenix.createView({
        name: 'expandList',
        components: [],
        props: {
            'list': {
                type: Array,
                default: function () {
                    return [{k: '1', v: '1'}, {k: '2', v: '2'}];
                }
            },
            'curValue': {
                default: '',
                twoWay: false
            },
            'containWidth':{
                default:'298'
            }
        },
        data(){
            return {
                isHidden: true,
                curItem: {k: '', v: ''}
            };
        },
        ready(){
            this.setDefault(this.curValue);
        },
        methods: {
            click(item){
                this.curItem = item;
                this.$dispatch('changeSelect',item);
                this.isHidden = true;
            },
            setDefault(v){
                if (!this.list) return;
                let item = this.list.find(item=>{
                    return item.v === v;
                });
                if (item) this.click(item);
            }
        },
        watch: {
            'curValue': function (value) {
                this.setDefault(value);
            },
            'list':function(val){
                this.setDefault(this.curValue);
            }
        }
    });
</script>
<style lang="less" scoped>
    @import "./assets/phoenix.min.css";
    @import "./assets/iconfont/iconfont.css";
    .wrap {
        width: 90px;
        font-size: 16px;
        color: #666;
        z-index: 10000;
    }

    .item, .content {
        width: inherit;
        height: 38px;
        padding: 0 10px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
    }

    .item:hover {
        background: #0074ff;
        color: #fff;
    }

    .border {
        border: 1px solid #dbdbdb;
        border-radius: 2px;
    }

    .hidden {
        display: none;
    }

    .list-wrap {
        position: absolute;
        height: 200px;
        overflow: scroll;
        border: 1px solid #dbdbdb;
        border-top: none;
        background: #fff;
    }
</style>
