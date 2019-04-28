### api 
```
import shit from 'shit';    

//@param { File, String } file 可以是一个File类型的文件，或者是一个http(s)://开头的线上资源
//@这一步要初始化webgl及加载three.js 及其插件所以是异步
shit.load( file ).then( shot => {
    //使用shot方法
    //@param { Number } width, height 长，宽用于截图功能，不用截图功能可以传80,80 就好：）
    //@returns { Object } result
    shot( width, height, ( err, result ) => {
        if( err ) return console.log( err );
        //@result
        //@params { String } base64 - 生成的模型截图
        //@params { Number } size - 文件大小
        //@params { Object } volume - x, y, z - 模型的长,宽,高
        //@params { String } name - 模型名字
        //@params { Number } vol - 模型体积
        //@params { Number } area - 模型表面积
        console.log( result );  
    });                 
}); 
``` 