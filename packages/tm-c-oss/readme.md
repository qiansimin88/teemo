###阿里云 oss 处理
>使用 demo

```
###1.main.js 

npm i tm-c-oss --save 

import oss from 'tm-c-oss';

vue.use(oss);


###2.全局注入了$oss的方法属性

$oss({
    id:89d5d28fe85a4dbb12d0e8a4c83d9e52,
    w: 500,
    c: 1,
    r: 0,
    o: 2,
    h: 500,
    e: 2,
    watermark: true
})">

```

>参数说明

``1.必填项``

-  id(必填): cdnkey
-  w(高度有的情况下选填): 宽 ,  只设置宽,高度等比例缩放   
-  h(宽度有的情况下选填): 高 ,  只设置高, 宽等比例饿缩放

``2.选填项``

- e(选填)[0-4]:  0-1: 都表示等比例缩放, 0:表示按长边为基准,短边等比例 1:表示以短边为基准,长边等比例饿, 默认是1e,   2:表示强制的,就是你宽高设置多少那么现实的就是多少,  4: 特为填充色指定,长边填色,短边按指定值设置
- l(选填): 设置的尺寸大于原图是否强制设置     1l: 保持原图尺寸  0l: 保持设置的尺寸, 默认设置成0L 
- bgc(选填):  rgb的色彩 - 分割, 默认 238-238-238
- r(选填)[0-360]: 顺时针旋转   
- o(选填)[0-2]: 手机拍照额 exif 会导致图片 旋转的不对, 1: 先缩略在旋转  2: 先旋转在缩略 ,  一般需要的情况下 设置为 2即可
- q(选填)[1-100]: 展示图片相对于原图的百分比质量
- pr(选填)[0,1]: 图片展示的扫描方式, 移动端图片可设置1效果为先模糊后清晰
- end(选填)[jpg,png,gif,src]: src 的意思是原图是啥就是啥
- watermark(选填)[boolean]: 目前用得上的也就图片的3dker 的 logo 水印了- - 
- c(选填)[1]: 是否剪裁(为了防止图片变形,裁剪中间部分展示)
>注意事项
无 🙄