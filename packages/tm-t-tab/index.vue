<template>
<div class='tap-wrap'>
    <span class='tap-item' :class="{'tap-item-selected':$index===curIndex}" :style="{width:width+'px',height:height+'px'}" v-for='item in itemList' @click.stop='itemClick($index)'>
      <span class='splite' v-if='$index!==0'></span><span class='item-title'>{{item.k}}</span>
    </span>
</div>
</template>
<script type='text/javascript'>
import Phoenix from 'phoenix';
export default Phoenix.createView({
    name: 'tm-t-tab',
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
            default: 0
        },
        'curIndex': {
            twoWay: true,
            default: -1
        },
        'width': {
            twoWay: false,
            default: 80
        },
        'height': {
            twoWay: false,
            default: 32
        }
    },
    data() {
        return {};
    },
    components: [],
    ready() {},
    methods: {
        itemClick(index) {
            this.assign(index);
            this.selected(index);
            this.$dispatch('tapChange', this.itemList[index]);
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
    watch:{
      'defaultIndex':function(val){
        this.selected(this.defaultIndex);
      }
    }
});
</script>
<style lang="less" scoped>@import (reference) "./assets/style.less";
.tap-wrap {
    display: flex;
    align-items: center;
    .tap-item {
        display: flex;
        align-items: center;
        width: 100px;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
        color: #666;
        &-selected{
          color:@main_color;
          border-bottom: 2px solid @main_color;
        }
        .item-title {
            flex-grow: 1;
            text-align: center;
        }
        .splite {
            display: inline-block;
            width: 1px;
            height: 10px;
            background: @splite_color;
        }
    }
}
</style>
