<template>
<div class='m-backend-content'>
    <header class='m-header'>
        <span class='splite'></span>
        <span class='title'>{{title}}</span>
        <button class="btn btn-primary btn-sm" @click.stop='action.cb' v-if="action.name!==''">{{action.name}}</button>
    </header>
    <slot name='queryLayout'></slot>
    <slot></slot>
</div>
</template>
<script type='text/javascript'>
import Phoenix from 'phoenix';
export default Phoenix.createView({
    data() {
        return {};
    },
    props: {
        'title': {
            twoWay: false,
            type: String,
            default: '运营推广'
        },
        'action': {
            type: Object,
            default: function() {
                return {
                    name: '',
                    cb: function() {}
                }
            }
        }
    },
    components: {},
    ready() {},
    methods: {}
});
</script>
<style lang="less" scoped>@import "./assets/style.less";
@import "./assets/phoenix_ui.less";
.m-backend-content {
    .m-header {
        display: flex;
        align-items: center;
        .splite {
            width: 4px;
            height: 24px;
            background: @main_color;
        }
        .title {
            color: #333;
            font-size: 18px;
            margin: 0 24px 0 10px;
        }
    }
}
</style>
