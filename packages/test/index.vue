<template>
    hello test
    <i class="iconfont icon-home"></i>
</template>
<script>
    import Phoenix from 'phoenix';
    export default Phoenix.createView({
        name: "test",
        data (){
            return {};
        },
        ready (){
            console.log('test, test');
        }
    })
</script>   
<style lang="less" scoped>
    @import './assets/iconfont/iconfont.css';
</style>