### Pc端预览大图组件

import previewImg from 'tm-t-fullpreview';

 components: {previewImg},

 <preview-img :show-preview.sync='previewImgObj.show' :imgs='previewImgObj.imgs' :index='previewImgObj.index'></preview-img>
 

### 属性说明

    show:true/false 显示隐藏
    imgs:[cdnkey,cdnkey]  数组
    index:0 展示的下标

### 使用方法

    components: {previewImg},

    <preview-img :show-preview.sync='previewImgObj.show' :imgs='previewImgObj.imgs' :index='previewImgObj.index'></preview-img>
    
    let cdnKeys = ['',''];
    
    previewImg(cdnKeys){
                this.previewImgObj.imgs = cdnKeys;
                this.previewImgObj.show = true;
                this.previewImgObj.index = 0;
    }
    
    