require('./wxSDK');

module.exports = {
    data() {
        return {
            wxExisted: false,
            wxTimeout: 0
        }
    },
    route: {
        data() {
            this.wxNeed() && this.$nextTick( this.wxInjection );
        }
    },
    ready() {
        this.wxExisted || this.wxNeed() && this.$nextTick( this.wxInjection );
    },
    mounted() {
        this.wxExisted || this.wxNeed() && this.$nextTick( this.wxInjection );
    },
    methods: {
        wxNeed (){
            return !!/MicroMessenger/i.exec( window.navigator && window.navigator.userAgent );
        },
        wxInjection() {
            this.wxExisted = true;

            var jsApiList = [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ];

            var data = {
                title: '',
                desc: '',
                link: window.location.href,
                imgUrl: 'https://cdnimg.3dker.cn/7b7cb625f87d85216de9f25c18846e63'
            };

            var bindApi = () => {
                // 'biaoti' from 2.0 of qsm
                var titleEl = window.document.getElementById('biaoti')

                data.title = titleEl && titleEl.textContent || window.document.title
                    .replace(/(\s|-)/g, '')
                    .replace(/-?\/?3D打印设计师平台/, '')
                    .replace(/-?\/?3D造(打印)?云平台/, '')
                    .replace(/(^\s|\s$)/g, '');

                var descRegionEl = window.document.getElementById('wx-desc-region');
                var metaDescEl = window.document.getElementById('meta-description');

                data.desc = ( descRegionEl && descRegionEl.textContent && descRegionEl.textContent.replace(/\s/g, '').slice(0, 60) )
                    || ( metaDescEl && metaDescEl.getAttribute('content') ) 
                    || data.link;

                // 在正文区域获取一张图片
                var imgRegionEl = window.document.getElementById('wx-imgs-region');
                var img =  ( imgRegionEl || window.document.body ).querySelectorAll('img');
                img = ( img && img[0] && img[0].getAttribute('src') ) || 'https://cdnimg.3dker.cn/7b7cb625f87d85216de9f25c18846e63';
                // 516137fa82c5870795e6b43635a53d89
                // 7b7cb625f87d85216de9f25c18846e63

                data.imgUrl = img.replace( /https?/, 'https' );

                if ( data.title && data.desc ) {
                    jsApiList.forEach( api => {
                        window.wx[ api ]( data );
                    });
                } else {
                    setTimeout( bindApi, 500);
                }
            };

            this.api('wxSign')
                .post( data.link )
                .then( (err, config) => {
                    if (err) return console.log(err);

                    window.wx.config( Object.assign( config, { jsApiList: jsApiList.slice() }) );

                    window.wx.ready( () => {
                        if ( this.wxTimeout ) {
                            setTimeout( bindApi, this.wxTimeout );
                        } else {
                            bindApi();
                        }
                        this.wxExisted = true;
                    });

                    window.wx.error(res => {
                        console.log('wx_err', res);
                        // 重新再注册一次
                        window.wx.config( Object.assign( config, { jsApiList: jsApiList.slice() }) );
                    });
                });
        }
    }
}