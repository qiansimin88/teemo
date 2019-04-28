<template>
    <upload-area :files.sync="files"></upload-area>
    <upload-list :files.sync="files"></upload-list>
</template>
<script>
    import UploadArea from './components/uploadArea';
    import UploadList from './components/uploadList';
    export default {
        name: 'TModel',
        components: {
	        UploadArea, UploadList
        },
        props: {
            orderAction: {
            	type: Function,
                default: function () {

                }
            }
        },
        data() {
        	return {
        	    files: {}
            }
        },
        mounted() {
            this.init();
        },
        ready() {
	        this.init();
        },
        methods: {
        	init() {
                this.$on('filechange', this.fileChange);
                this.$on('toOrder', this.toOrder);
            },
            fileChange(files) {
        		this.files = { ...files };
            },
	        toOrder(files) {
        		this.orderAction && this.orderAction(files);
            }
        }
    };
</script>
<style lang="less" scoped>

</style>
