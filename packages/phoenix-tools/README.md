###文档啊

```
使用方法
import {oss,byte2Util,dateUtil} from phoenix-tools;
```

####byteTranUtil关于字节转换的工具类
```
m2B(value) { //M to B
    return parseInt(value, 10) * 1024 * 1024;
},

b2Size(bytes) {
    if (bytes === 0) return '0 B';
    let k = 1000; // or 1024
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
```

#### CrossUtil  用于后台跳转至对应的前台环境    
```
//develop.admin.3dker.cn => develop.3dker.cn/hello/world?id=1
crossUtil('hello/world?id=1'); 
```

####dateTimeUtil时间日期相关工具类
```
getDate(tm) {//根据时间戳获取时间
    return (new Date(tm)).toISOString().slice(0, 19).replace(/T/g, " ");
},
getNowTime() {//获取当前时间
    let now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
},
date2Timestamp(date) {//日期转时间戳
    if (!date || date === '') return '';
    // console.log(date);
    // date = date.replace(/-/g, '/');
    return new Date(date).getTime();
},
tranTime(timeStamp) {//时间戳转带日期时间
    if (timeStamp === '') return '';
    var date = new Date(timeStamp);
    var Month = parseInt(date.getMonth(), 10) + 1;
    return date.getFullYear() + '-' +
        (Month < 10 ? '0' + Month : Month) + '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
},
tranDate(timeStamp) {//时间戳转日期不带时间
    if (timeStamp === '') return '';
    var date = new Date(timeStamp);
    var Month = parseInt(date.getMonth(), 10) + 1;
    return date.getFullYear() + '-' +
        (Month < 10 ? '0' + Month : Month) + '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}
```
####ossImgUtil oss帮助类
```
/**
 * 加载头像,头像不带水印
 */
loadAvatar(key, w, h, defaultIcon = '/statics/img/default_avatar.png', addWater = false)

/**
 *  其余用这个
 */
loadImgUseCrop(key, w, h, addWater = false, defaultIcon)
```
