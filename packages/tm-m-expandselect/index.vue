<template>
<div style='position: relative;' @click.stop='changeExpand(false)'>
    <div class='expandSelectContain mask' v-if='isExpand'>
        <div class='expandContain'>
            <div class='expandContainItem' :class="{'expandContainItem-select':curIndex===$index}" v-for='item in itemList' @click.stop='itemClick($index)'>
                <span>{{item.k}}</span>
                <i class='selected' v-if='curIndex===$index'></i>
            </div>
        </div>
    </div>
</div>
</template>
<script type='text/javascript'>
import Phoenix from 'phoenix';

export default Phoenix.createView({
    props: {
        'itemList': { //[{k:'',v:''}]
            default: function() {
                return [];
            }
        },
        'selectValue': {
            twoWay: true,
            default: ''
        },
        'selectKey': {
            twoWay: true,
            default: ''
        },
        'defaultIndex': {
            twoWay: false,
            default: -1
        },
        'curIndex': {
            twoWay: true,
            default: -1
        },
        'isExpand': {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {};
    },
    components: [],
    ready() {
        this.selected(this.defaultIndex);
    },
    methods: {
        changeExpand(isExpand) {
            this.isExpand = isExpand;
        },
        itemClick(index) {
            this.assign(index);
            this.selected(index);
            this.changeExpand(false);
            this.$dispatch('expandSelect', this.itemList[index]);
        },
        assign(index) {
            if (index === -1 || this.itemList.length === 0) return;
            this.selectKey = this.itemList[index].k;
            this.selectValue = this.itemList[index].v;
        },
        selected(index) {
            this.curIndex = index;
        }
    },
    events: {
        'reset': function() {
            this.isExpand = false;
        }
    }
});
</script>
<style lang="less" scoped>@import (reference) "./assets/style.less";
.expandSelectContain {
    color: @font_color_1;
    font-size: 0.14rem;
    border-top: 1px solid @border_color;
    .expandContainItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100vw;
        height: 0.7rem;
        line-height: 0.7rem;
        padding: 0 0.4rem;
        border-bottom: 1px solid @border_color;
        background: #fff;
        &-select {
            color: @main_color;
        }
        &:active {
            background: @item_hover;
        }
    }
    .iconfont {
        font-size: 10px;
        margin-bottom: 2px;
    }
}
.mask {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99999;
    background: rgba(55,55,55,.6);
}

.selected{
    position: relative;
    display: inline-block;
    width: .2rem;
    height: .3rem;
    background: @main_color;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    -webkit-transform: rotate(45deg);
}
.selected:after {
    position: absolute;
    content: '';
    display: block;
    width: .2rem;
    height: .3rem;
    background: #fff;
    -webkit-transform:translateY(-5%) translateX(-5%);
}
</style>
