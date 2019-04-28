<template>
    <button class="btn" :class="[ type, size ]">
        {{ text }}
    </button>
</template>
<script>
    export default {
        name: 'ui-button',
        props: {
            size: { 
                default: 'sm',
                type: String,
                coerce ( val ){
                    return 'btn-' + val;
                }
            },
            type: {
                default: 'default',
                type: String,
                coerce ( val ){
                    return 'btn-' + val;
                }   
            },
            text: {
                default: 'button',
                type: String
            }
        }
    }
</script>
<style lang="less" scoped>

</style>