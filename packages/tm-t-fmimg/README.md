## 使用方式

```
		<tm-t-fmimg>
			<file-upload 
				action="/upload"
				format="png|jpg"
				:maxsize="5" >
			</file-upload>
		</tm-t-fmimg>
	
	import fileUpload from 'phoenixUI/fileUpload';
	import tmTFmimg from 'tm-t-fmimg';
	
	export default {
		name: 'vue-page',
		components: { tmTFmimg, fileUpload }
	};

    props:
        img: { type: String, default: '', twoWay: true } 图片的阿里ID
        mType: 'video' // 新增视频模式

        style: Object,
        succeeded: Function, 图片上传成功后的回调，参数为上传到阿里的后的回应值
        removed: Function, 图片删除后的回调

	说明:
		tm-t-fmimg 依赖 PhoenixUI中的fileUpload组件，
		所以fileUpload的参数请查阅PhoenixUI
```