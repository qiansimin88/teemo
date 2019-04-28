<template>
    <div class="wrap" art-wrap v-el:wrap v-html="retContent"></div>
</template>
<script>

const pcBaseFont = 14; // pc基础字体
const mobileBaseFont = 30; // 手机端基础字体
const pcHome =  '/user?id='; // pc个人中心页面
const mobileHome =  '/designer/perhome?userId='; // 手机个人中心页面
const baseFontBit = 100; // 移动端px转rem的比例

var contentEl = null

export default {
    name: 'articleArea',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            environment: 'web',
            retContent:''
        }
    },
    watch: {
        'content': function(data){
            this.retContent = this.getHtml(data)
        }
    },
    created() {
        if(window.location.hostname && (window.location.hostname.indexOf('m.') !== -1)) {
            this.environment = 'mobile';
//             require('./mobile.less');
        } else {
            require('./pc.less');
        };

        if(navigator.userAgent.indexOf("iPhone") !=-1)
        {
            // require('./mobile.less');
        }
    },
    methods: {
        getHtml(con) {
            let content = window.document.createElement('div');
            let watermark = '|watermark=1&object=d2F0ZXJtYXJrLnBuZ0A2NnA=&t=95&x=10&y=10';
            content.innerHTML = con;
            this.turnAt(content);
            if(this.environment === 'mobile') {
                this.turnImg(content, watermark, this._turnSize(678), this._turnSize(600));
            } else {
                this.turnImg(content, watermark, 700);
            }

            setTimeout(function() {
                var nodes = document.getElementsByTagName('video');
                for (var index = 0; index < nodes.length; index++) {
                    var element = nodes[index];
                    element.addEventListener("contextmenu", function( e ){
                        e.preventDefault();
                    });
                }
            }, 1500);
            contentEl = content;
            return content.outerHTML;
        },
        // 将页面at 标签解析成能点击的 a 标签
        // 将页面的a标签 做成能open类型的
        turnAt(con) {
            Array.from(con.getElementsByTagName('a')).forEach((v, i)=> {
                if(v.hasAttribute('data-userid')) {
                    v.removeAttribute('onclick')
                    v.href = this._getLocation(v.getAttribute('data-userid'));
                    // v.onclick = NUll;
                    v.target = "_blank";
                };
                if(v.hasAttribute('href')) {
                    v.target = "_blank";
                };
            });
        },
        _getLocation(id) {
            return this.environment === 'web'
                                ? pcHome + id
                                : mobileHome + id;   
        },
        /**
         * 移动端转字体说明: --下面根据校长口述整理: 
         *     pc基础字体16px，移动基础30px, pc上涨2个px, 移动端涨6个px
         *     例:在编辑器中设置字体大小 18px , 则在移动端就是 (18-16)/2 * 6 + 30 = 36px
         * 最后转px为rem, 再转rem为真实的px
         */
        turnFontSize(con) {
            Array.from(con.querySelectorAll('[data-size]')).forEach((v, i)=> {
                let dataSize = Number(v.getAttribute('data-size'));
                console.log(v);
                v.style.fontSize = (((dataSize - pcBaseFont) * 3) + mobileBaseFont ) / baseFontBit  + 'rem';
            });
        },
        turnImg(con, watermark, w, fazhi = 600){
            Array.from(con.querySelectorAll('img')).forEach((v, i)=> {
                var matched = v.src.match(/(\w*)\@/);
                if ( !matched ) return; // do nothing when base64

                var dfsId = ( matched && matched[1] ) || v.getAttribute('data-key');
                var ext = v.getAttribute('data-ext') || '';
                v.setAttribute('src', this.loadImg(dfsId, w, ext));
                v.init = false;
                if( ext === 'gif' ) return;
                v.onload = () => {
                    if (!v.init) {
                        v.init = true;
                        v.naturalWidth >= fazhi && (v.src += watermark);
                        this.retContent = contentEl.outerHTML;
                    }
                }
            });
        },
        loadImg(cdn, w, ext) {
            if(!process.env.CDN) {
                throw new Error('process.env.CDN is not defined, plz hit ZhangZiLiang');
            }
            w = w && window.parseInt(w);
            ext = ext ? ext : 'jpg';
            return process.env.CDN + '/' + cdn + '@_100q' + '_' + w + 'w' + '_1e_1c_1l.' + ext;
        },
        // 将相对px值转化成绝对值
        _turnSize(absPx) {
            let baseFont = window.document.documentElement.style['font-size'];
            if(baseFont.length === 0) throw new Error('body font-size not found plz hit ZhangZiLiang');
            baseFont = window.parseInt(baseFont);
            return (absPx / baseFontBit) * baseFont;
        }
    }
}
</script>