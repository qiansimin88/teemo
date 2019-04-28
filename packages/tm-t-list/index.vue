<template>
    <div v-if="list && list.length > 0">
        <div class="list-wrap">
            <slot></slot>
            <div class="pageing-wrap">
                <paging :total="totalPage"></paging>
            </div>
        </div>
    </div>
    <div v-else>
        <empty-component :msg="empty"></empty-component>
    </div>
</template>
<script type='text/javascript'>
    import Phoenix from 'phoenix';
    import Paging  from 'tm-c-paging';
    import emptyComponent from './emptyComponent';
    export default Phoenix.createView({
        name:'list',
        props: {
            'totalPage': {
                twoWay: false,
                default: 1
            },
            'list': {
                twoWay: false,
                default: function () {
                    return null;
                }
            },
            'empty':{
                default:'抱歉，没有匹配的结果！'
            }
        },
        data (){
            return {};
        },
        components: {Paging, emptyComponent},
        ready (){
        },
        methods: {},
        watch:{
        }
    });

</script>
<style lang="less" scoped>
    .list-wrap {
    }
    .pageing-wrap {
        margin: 20px 0 0;
        display: flex;
        justify-content: center;
    }
</style>