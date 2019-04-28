<template>
    <div id="qrcode"></div>
</template>
<script type='text/javascript'>
    import Phoenix from 'phoenix';
    import qrcanvas from 'qrcanvas';
    export default Phoenix.createView({
        name: 'qrCode',
        props: {

        },
        data() {
            return {};
        },
        components: [],
        ready() {

        },
        methods: {
            assign(param){
                if(param.logo && param.logo !== ''){
                    let img = new window.Image();
                    img.src = param.logo;
                    img.onload = ()=>{
                        param.logo = {image:img};
                        this.toGenQrCode(param);
                    };
                }else{
                    delete param.logo;
                    this.toGenQrCode(param);
                }
            },
            toGenQrCode(param){
                const genType = param.genType || '';
                param.genType && delete param.genType;
                const canvas = qrcanvas(param);
                var root = document.getElementById("qrcode");
                if(root.children.length > 0){
                    root.removeChild(root.lastChild);
                }
                if(genType === 'canvas'){
                    root.appendChild(canvas);
                    return;
                }
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                root.appendChild(image);
            }
        },
        events:{
            'genQrCode':function(param){
                this.assign(param);
            }
        }
    });
</script>
<style lang="less" scoped>
</style>
