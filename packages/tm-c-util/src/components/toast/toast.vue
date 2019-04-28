<template>
    <toast :show.sync="show" :duration="duration">{{ msg }}</toast>
</template>
<script>
    import toast from 'phoenixUI/toast';
    export default {
        name: 'Toast',
        components: {
            toast
        },
        props: {
            msg: {
                type: String,
                default: '蓝瘦~香菇~'
            },
            show: {
                type: Boolean,
                default: false
            },
            duration: {
                type: Number,
                default: 1000
            }
        },
        data() {
            return {};
        }
    };
</script>