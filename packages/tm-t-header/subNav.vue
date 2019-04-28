<template>
    <div class="sub-nav" v-if="list">
        <ul>
            <li class="sub-navitem" v-for="item in list">
                <span @click="item.click" v-if="item.linkPath === undefined && item.click !== undefined">{{item.name}}</span>
                <a v-if="item.linkPath !== undefined" :href="item.linkPath + '?tips=' + item.linkPath.split('/')[2]">{{item.name}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
        }
    },
    data() {
        return {};
    }
}
</script>

<style lang='less' scoped>
.sub-nav{
    color: #fff;
    font-size: 14px;
    text-align: center;
    border-radius: 0 0 2px 2px;
    background-color: #36384e;
    width: 100%;
    z-index: 10000;
    padding-top: 9px;
    padding-bottom: 9px;
    line-height: 1;
    // &:before{
    //     content: '';
    //     position: absolute;
    //     border: 6px solid transparent;
    //     border-bottom-color: #36384e;
    //     left: 42px;
    //     top: -12px;
    // }
}
.sub-navitem{
    a, > span{
        padding-top: 12px;
        padding-bottom: 12px;
        display: block;
        color: #fff;
        text-decoration: none;
    }
    &:hover{
        background-color: #0074ff;
    }
}
</style>
