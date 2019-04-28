import phoenix from 'phoenix';
import store from 'store';

export default phoenix.createView({
    name: 'threeLogin',
    props: {},
    data() {
        return {
            qqUrl: "https://graph.qq.com/oauth2.0/authorize",
            weiboUrl: "https://api.weibo.com/oauth2/authorize",
            wechatUrl: "",
            referrer: ""
        };
    },
    ready() {},
    methods: {
        /*
         * copy from qq.js
         * scope
         * redirectURI
         * display
         * appId
         * state
         * response_type
         * */
        genQqUrl(opts = {}) {
            var scope = opts['scope'] || 'all', redirectURI = opts['redirectURI'] || '',
                display = opts['display'] || '', clientId = opts['appId'] || '',
                responseType = opts['response_type'] || 'code', state = opts['state'] || '';
            redirectURI = redirectURI || ('http%3A%2F%2Fqzonestyle.gtimg.cn%2Fqzone%2Fopenapi%2Fredirect-1.0.1.html') || (location.protocol + "//" + location.host + ((location.port && location.port != "80") ? (":" + location.port) : "") + "/qc_callback.html") || "";
            var paras = ['client_id=' + clientId, `response_type=${responseType}`, `state=${state}`], //update to code
                url = 'https://graph.qq.com/oauth2.0/authorize';
            if (scope) {
                paras.push('scope=' + scope);
            }
            if (redirectURI) {
                if (redirectURI.indexOf('://') > 0) {
                    redirectURI = encodeURIComponent(redirectURI);
                }
                paras.push('redirect_uri=' + redirectURI);
            }
            if (display == 'mobile') {
                paras.push('display=' + display);
            }
            url = url + "?" + paras.join("&");
            return url;
        },
        /*
         * redirectURI
         * appId
         * state
         * response_type
         * */
        genWeiboUrl({redirectURI, appId, state, responseType}) {
            var url = 'https://api.weibo.com/oauth2/authorize', params = [];
            redirectURI = redirectURI || '';
            state = state || '';
            appId = appId || '';
            responseType = responseType || 'code';
            // redirectURI = 'https%3A%2F%2Fwww.3dzao.cn%2Fi%2Fbind%2Faccount%3Freferrer%3D%2F%26type%3Dweibo';
            redirectURI && redirectURI.includes("://") && (redirectURI = encodeURIComponent(redirectURI));
            params = [`redirect_uri=${redirectURI}`, `state=${state}`, `client_id=${appId}`, `response_type=${responseType}`];
            url = url + "?" + params.join("&");
            return url;
        },
        genWechatUrl({redirectURI, appId, state, responseType, scope}) {
            var url = 'https://open.weixin.qq.com/connect/qrconnect', params = [];
            redirectURI = redirectURI || '';
            state = state || '';
            // wx628252c0d1420fd8
            appId = appId || '';
            responseType = responseType || 'code';
            scope = scope || 'all';
            // redirectURI = 'https%3A%2F%2Fwww.3dzao.cn%2Fi%2Fbind%2Faccount%3Freferrer%3D%2F%26type%3Dwechat_pc';
            redirectURI && redirectURI.includes("://") && (redirectURI = encodeURIComponent(redirectURI));
            params = [`appid=${appId}`, `redirect_uri=${redirectURI}`,  `response_type=${responseType}`, `scope=${scope}`, `state=${state}`];
            url = url + "?" + params.join("&") + "#wechat_redirect";
            return url;
        },
        goBind(type, referrer) {
            this.referrer = referrer;
            this.getOAuth2Info(type)
                .then(info => {
                    return this.getUrl(info, type);
                })
                .then(url => {
                    window.location.href = url;
                })
        },
        getOAuth2Info(type) {
            return new Promise((resolve, reject) => {
                this.api("getOAuth2Info").post({type}).then((err, data) => {
                    if (err) reject(err);
                    resolve(data && data.result);
                });
            });
        },
        getUrl({clientId, redirectUri, responseType, state, scope}, type) {
            let url = "";
            let referrer = this.$route.query['referrer'] || this.referrer || "";
            if (type === "qq")
                url = this.genQqUrl({
                    redirectURI: redirectUri += `?referrer=${referrer}&type=${type}`,
                    response_type: responseType,
                    state,
                    appId: clientId
                });
            if (type === "wechat_pc") {
                url = this.genWechatUrl({
                    redirectURI: redirectUri += `?referrer=${referrer}&type=${type}`,
                    response_type: responseType,
                    state,
                    appId: clientId,
                    scope: scope
                })
            }
            if(type === "weibo") {
                store.set( '__referrer__', referrer );

                url = this.genWeiboUrl({
                    redirectURI: redirectUri,  // store referrer at localStorage if weibo, and redirectUri includes type
                    appId: clientId,
                    state,
                    responseType
                });
            }
            return Promise.resolve(url);
        },
    }
});
