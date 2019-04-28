### api 

#### preview-install
```
this.$broadcast('preview-install', options );
```
> 第二个参数可以填event.target.files 或者是一个含有size,name的数组,
如果是一个线上文件，name可以为一个URL

- size: Number - 文件大小
- name: String - 文件名或者下载路径
- type: Stirng - 文件类型未知情况下可以填写, stl or obj

<font color="red">note: 拿到stl/obj文件的链接后请立刻调用preview-install, 预览组件会调用phoenix.prefetch方法，在浏览器空闲阶段预加载所有相关数据文件！</font>


#### preview-run
``` 
this.$broadcast('preview-run', options = {} );
```			  
- index 索引, 预览任意位置的文件, 默认为 0

#### Example:
```
this.$broadcast('preview-install', [
    {	
        size : 1024,	
        name : 'a.stl', 
        type : 'stl'    //选填
    }, 
    {
        size : 1024,
        name : 'b.obj',
        type : 'obj'
    },
    {
        size : 1024,
        name : 'http://3dker.cn/c.stl',
        type : 'stl' 
    }
]);

this.$broadcast('preview-run', {
    index : 0
})
```