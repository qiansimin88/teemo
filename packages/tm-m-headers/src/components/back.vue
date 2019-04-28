<template>
    <i class="iconfont icon-back" @click="goBack()"></i>
</template>
<style lang="less" scoped></style>
<script>
export default {
    name: 'back',
    props: ['back'],
    data() {
        return {};
    },
    ready(){
    },
    methods: {
        goBack() {
            this.$dispatch('back');
            if(!this.back) {
                window.history.back();
                return;
            };
            switch(typeof this.back) {
                case 'object':
                    this.$router.go(this.back);
                    break;
                case 'string':
                    this.$router.go(this.back);
                    break;
                case 'function':
                    this.back();
                    break;
                default:
                    window.history.back();
                    break;
            }
        }
    }
};
</script>
