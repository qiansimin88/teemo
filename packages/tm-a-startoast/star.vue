<template>
    <span class="star-content">
        <template v-for="index in startCount">
            <img class="star" src="./img/solidstar.png">
        </template>
        <template v-if="showHollow" >
            <img v-for="index in 5-startCount" class="star" src="./img/hollowstar.png">
        </template>
    </span>
</template>
<script type='text/javascript'>
    import Phoenix from 'phoenix';

    export default Phoenix.createView({
        name:'star',
        data() {
            return {
                startCount:0
            };
        },
        props: {
            number:{
                type:Number,
                default:0
            },
            showHollow:{
                type:Boolean,
                default:false
            }
        },
        created () {
            this.number = this.number > 5 ? 5 : this.number;
            this.number = this.number < 0 ? 0 : this.number;
            this.startCount = parseInt(this.number,10);
        },
        methods: {}
    });
</script>
<style lang="less" scoped>
.star-content{
    display: inline-flex;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
}
.star{
    width:14px;
    height: 14px;
    border: 0;
}

</style>