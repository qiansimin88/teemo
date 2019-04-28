/**
 * from(必填): 判断是给pc端添加统计还是移动端添加百度统计 
 */
'use strict';
module.exports = function baidu(from){
    if(from === 'pc'){
        var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?7dfabad13d67203f86bb9d008caa2b65";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    }else{
        var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?09fedbf7a05d6e38725d9acf2a12aba9";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    }
};