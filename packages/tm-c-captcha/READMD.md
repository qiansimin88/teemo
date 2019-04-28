## 使用方式

```
    tm-c-captcha@0.0.10 去掉error中createClient，使用重连策略
    tm-c-captcha@0.0.11 优化重连策略，以前Redis服务重启之后，或长时间断开之后，客户端Redis是一直断了，

    依赖：
        brew install imagemagick
        brew install graphicsmagick

    node端 server api.js 中 

    // 也可以直接 require('tm-c-captcha/server/api');
    
    var Captcha = require('tm-c-captcha/server');

    // config 取自minas中的redis
    var cap = new Captcha({
        host: '174.3.4.254',
        port: '6379',
        password: 'o9i8u7y6'
    });

    module.exports = {
        genCaptcha() {
            return cap.generate();
        }

        checkCaptcha( token, data ) {
            return cap.check( token, data );
        }
    }

    前端 views xxx.vue 中 

    1、直接使用captcha Node服务

    this.api( 'genCaptcha' )
        .post()
        .then( (err, data) => {
            // 验证码生成失败，有err说明

            // data = { 
            //    token: '',           // 验证码唯一标识
                  pos: { x: 10, y: y } // 方块初始位置好
            //    orignal: '',         // 原图
            //    croping: '',         // 裁剪的方块
            //    croped: ''           // 裁剪后的剩余图片
            // };
        });

     // token: 当前验证码唯一标识
     // data: { x: 5, y: 5 } 拖放后，方块左上角的位置，以原图的左上角为: ( 0, 0 )
     // 由于原图是: w = 300, h = 100; 若你修改尺寸后，位置也按比例计算, 具体参照captcha vue组件
     this.api( 'checkCaptcha' )
         .post( token, data )
         .then( (err, res) {
        
         });

    1、使用 captcha vue组件

    <template>
        <captcha v-model="checked" :size="1"></captcha>
    </template>

    inport captcha from 'tm-c-captcha/web'

    export default {
        data() {
            return {
                checked: false
            };
        }
    }
    
    props: 
        checked ( Boolean ): 父级可以通过该字段，得知当前验证码操作是否成功
        size ( Number ): 自定义组件的大小比例，默认是: w=300; h=100;
                         如: size=1.2 则: w=300 * 1.2; h=100 * 1.2
        @change ( Function ): 每次生成验证码时，父级都可以通过这个回调，得知当前验证码
```