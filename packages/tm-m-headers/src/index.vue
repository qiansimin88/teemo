<template>
    <div class="header">
        <div class="header-left">
            <slot v-if="leftType === 'normal'" name="left"></slot>
            <back v-else :back="back"></back>
        </div>
        <div class="header-middle">
            <div v-if="middleType === 'search'"><search :title="title"></search></div>
            <div v-else> {{ title }} </div>
            <slot name="middle"></slot>
        </div>
        <div class="header-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './assets/icon/iconfont.css';
.header {
    position: fixed;
    top: 0;
    height: .88rem;
    background: #4ab7ed;
    width: 100%;
    width: 100vw;
    color: #fff;
    font-size: .3rem;
    display: flex;
    align-items: center;
    z-index: 999;
}
.header .iconfont {
    color: #fff;
    font-size: inherit;
}

.header .header-right,
.header .header-left,
.header .header-middle {
    display: block;
    height: .58rem;
    line-height: .58rem;
    box-sizing: border-box;
}
.header .header-left,
.header .header-right {
    width: 50%;
    flex-shrink: 1;
}
.header .header-left {
    padding-left: .27rem;
}
.header .header-middle {
    flex-shrink: 0;
}
.header .header-right {
    text-align: right;
    padding-right: .27rem;
}
.header {
    i {
        color: #fff;
        font-size: inherit;
    }
}
</style>
<script>
import back from './components/back';
import search from './components/search';
export default {
    name: 'mHeader',
    components: [back, search],
    props: ['back', 'title', 'leftType', 'middleType', 'rightType'],
    data() {
        return {}
    },
    ready() {}
}
</script>
