'strict';
import vue from 'vue';

var badjs = function () {
    // console.log( process.env.NODE_ENV );
    //http请求
    //....
    //请求后台报错
    //
    //vue的客户端渲染出错报错;
    vue.config.errorHandler = function ( err, info ) {
       errorHandlerRender( err );
    };
    //js运行时 报错
    window.addEventListener( 'error', ( error ) => {
       console.log( error );
       errorHandlerRender( error );
    }, false);

    function errorHandlerRender ( error ) {
        var host = process.env.HOST, app_host = process.env.app_host;
        var locationObj = window.location;
        setTimeout( () => {
             superRequest({
                type: 'post',
                params: {
                   payload: JSON.stringify({
                        "text": "你好, 前端" + (process.env.NODE_ENV === 'production' ? '线上' : '线下') + '代码出错了',
                        "markdown": true,
                        "attachments": [
                            {
                                "title": '出错的文件地址:' + locationObj.href || '',
                                "text": "出错原因:" + error.message || error.stack,
                                "color": "#ff0000",
                                "images": [
                                    {"url": "https://cdnimg.3dker.cn/8afb36596d83495f2dde8dbc5e2ed378@414w_221h_1c_1e_0l_100q_1wh.jpg"}
                                ]
                            }
                        ]
                   })
                }
            });
        }, 0);
    }

    //请求一些东西
    function superRequest ({
        type = 'get',
        url = process.env.NODE_ENV === 'production' ? 'https://hook.bearychat.com/=bwBfP/incoming/2e7a9d949b5ac8391c3572c7237c5b3e' : 'https://hook.bearychat.com/=bwBfP/incoming/1caf0e1c68d9a5cc3b0aaf3196a6594d',  //bearchat的post请求   3dzao团队
        params = {}
    }){
        var xhr = new XMLHttpRequest();
        var parseParams = formatuRL(params); 

        if( type === 'get' ) {
            xhr.open( 'GET', url + '?' + parseParams, true );
            xhr.send();
        }else if ( type === 'post' ) {
            xhr.open( 'POST', url, true );
            xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
            xhr.send( parseParams );
        }
        xhr.onreadystatechange = function () {
            //请求就绪
            if( xhr.readyState === 4 ) {
                if( xhr.status === 200 ) {
                    console.log('请求完毕');
                    console.log('Send to bearychat success ：)');
                    console.log( JSON.parse( xhr.responseText) );
                }
            }
        };
    }

    //json 2 string
    function formatuRL ( params ) {
        if( typeof params !== 'object' ) {
            return params;
        }
        var item = [];
        for ( var i in params ) {
            item.push( encodeURIComponent( i ) + '=' + encodeURIComponent( params[i] ) );
        }   
        item.push( ('v=' + Math.random()).replace('.', '') );
        return item.join('&');
    }
}
try {
   module.exports = badjs();
} catch ( e ) {
}