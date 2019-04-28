## 使用方式

```
	<pc-file-upload :succeeded="fininshed" :stop="mainStop">
		<file-upload 
			slot="common"
			action="/upload"
			multiple="multiple"
			format=""
			:maxsize="200"
			:stop="commonStop">
		</file-upload>
		<file-upload 
			slot="img"
			action="/upload"
			multiple="multiple"
			format="png|jpg"
			:maxsize="5"
			:stop="imgStop">
		</file-upload>
	</pc-file-upload>
	
	import pcFileUpload from 'tm-t-upload';
	
	export default {
		name: 'vue-page',
		components: { pcFileUpload }
	};

    props:
		minHeight: String( 默认：200px ), 上传区的最小高度

		width: String( 默认: 100% ), 上传区的宽度

		removed: Function( 默认: null ), 如果有删除方法，删除文件后，会执行该方法，并传入参数为：当前文件上传成功后返回的res (如果上传失败的，则为undefined)
				这里还需要配置 删除的icon ( "icon-shanchu" 如阿里icon的使用方式 )

		imgOption: Object( 默认:  { toped: null, height: '100px' } ), 图片预览的高度，和图片是否设置首图操作(toped 用法如removed参数)，图片宽度为一行三个
		
		succeeded: Function ( 默认: null ) 文件上传成功后调用该方法，传入文件上传成功后的res
		
		stop: Function( 默认: null ) 如果有设置该方法，则上传之前会调用，只有其返回true，才会进行上传; 如果不设置，则忽视之

	说明:
		pcFileUpload 依赖 PhoenixUI中的fileUpload组件，
		所以fileUpload的参数请查阅PhoenixUI

		其中 slot 必须要写 common为非图片文件，format不设置，则为任意非图片文件；img为图片文件
		其中 stop ( Function ) 如果有设置该方法，则上传之前会调用，只有其返回true，才会进行上传

		这里可以只写一个<file-upload></file-upload>, 但是还得写slot, 即：只有图片上传，或非图片上传
```


0.0.27 删除item项默认设置第一个为首图