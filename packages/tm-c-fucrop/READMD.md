`tm-c-fucrop 裁剪图片组件`
##desc
独立裁剪图片组件，支持移动端和pc端, 完美支持现有上传组件。
##dependencies
1.cropperjs // https://github.com/fengyuanchen/cropperjs#events
2.phoenixUI/fileUpload
##use

```

    需要传入input上传的file
    需要传入上传文件的input dom
    需要在project.js中声明es6组件
    'ES6Plugins': ['tm-c-fucrop']

    <crop
        :img-style="{width:'400px',height:'400px'}"
        :aspect-ratio="1"
        :auto-crop-area="0.5"
        :max-size="2"
        v-ref:crop
        :successed="cropDone">
    </crop>
    
    
    import crop from "tm-c-fuavatar/web"; pc
    import crop from "tm-c-fuavatar/wap"; wap

    components:[ crop ]


    拿到上传的file
    inputEl = document.querySelector("input[type='file']");
    this.$refs.crop.showCrop(file, inputEl);
    
    methods:{
            cropDone( res, uniKey ){    //res内是上传成功返回
                this.userInfo.avatar = res && res.dfsId;
            }
            
    }
    
```

##Example
```
 <fm-img :succeeded="uploadSuc" :removed="uploadRemove" :img.sync="userInfo.avatar">
    <file-upload
            :action="uploadUrl"
            multiple="multiple"
            format="png|jpg|jpeg"
            :maxsize="2"
            :stop="cropImg">
    </file-upload>
</fm-img>


 <crop
    :img-style="{width:'400px',height:'400px'}"
    :aspect-ratio="1"
    :auto-crop-area="0.5"
    :max-size="1"
    v-ref:crop
    :successed="cropDone">
</crop>

 cropDone( res ){
    this.userInfo.avatar = res && res.dfsId;
 },
 
 cropImg( files, name ){
    inputEl = document.querySelector("input[type='file']");
    Array.prototype.slice.call( files, 0 ).map( file => {
        this.$refs.crop.showCrop(file, inputEl);
    });
    return true;
 }


```

>参数说明
-  imgStyle: 图片样式   
-  aspectRatio: 比例(取值0-1，与imgStyle里设置的width和height有关)
-  maxSize: 默认5m 
-  successed: 裁剪上传成功回调
