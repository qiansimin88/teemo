<!-- 基础的头部模板，中间居中 -->
<template>
    <div class="header">
        <div class="header-left">
            <slot name="left"></slot>
        </div>
        <div class="header-middle">
            <slot name="middle"></slot>
        </div>
        <div class="header-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<style lang="less" scoped></style>
<script>
export default {
    name: 'basic',
    props: {
        type: {
            type: String,
            default: null
        }
    },
    data() {
        return {};
    }
};
</script> 