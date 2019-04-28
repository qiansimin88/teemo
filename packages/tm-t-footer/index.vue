<template>
    <div id="footers">
        <float></float>
        <div class="wrap-footer">
            <p class="title">友情链接</p>
            <div class="footers-link">
                <template v-if="version === 1">
                    <span v-for="item in partnerSitesList">
                        <a :href="item.dictValue" target="_blank">{{item.dictName}}</a>
                    </span>
                </template>
                <template>
                    <span v-for="item in hibernate.partnerSites">
                        <a :href="item.dictValue" target="_blank">{{item.dictName}}</a>
                    </span>
                </template>  
            </div>
            <div class="footers-dashboard"></div>
            <div class="footers-content">
                <div class="footers-logo">
                    <img :src="logo" alt="">
                </div>
                <div class="footers-bottomlink">
                    <div class="wrap-dl">
                        <dl>
                            <dd v-for="item in friendlyLink1">
                                <a :href="item.link ? item.link : 'javascript:void(0)'" target="_blank">{{item.name}}</a>
                            </dd>
                        </dl>
                        <dl>
                            <dd v-for="item in friendlyLink2">
                                <a :href="item.link ? item.link : 'javascript:void(0)'" target="_blank">{{item.name}}</a>
                            </dd>
                        </dl>
                        <dl>
                            <dd v-for="item in friendlyLink3">
                                <a :href="item.link ? item.link : 'javascript:void(0)'" target="_blank">{{item.name}}</a>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="footers-ercode">
                    <dl>
                        <dt>
                            <img :src="download" alt="">
                        </dt>
                        <dd style="line-height: 1.4vw;">扫描下载3D造app</dd>
                    </dl>
                    <dl>
                        <dt>
                            <img :src="erweima" alt="">
                        </dt>
                        <dd style="line-height: 1.4vw;">扫描关注公众号</dd>
                    </dl>
                    <div class="phone">
                        <p>客服电话号：400 0799 660</p>
                        <p>QQ：2852379819</p>
                        <p>邮箱：support@3dzao.cn</p>
                    </div>
                </div>
            </div>
            <div class="footers-bottom">
                <div style="display: inline-flex;align-items: center;">
                    <span><img src="" alt="">浙ICP备17004839号-3</span>
                    <img class="police-img" :src="police" alt="">
                    <span style="margin-left: 7px;">浙公网安备33010902001582</span>
                    <a style="opacity: 1;" target="_blank" :href="hyHref">
                        <img class="hy-img" :src="hy" alt="">
                    </a>
                    <a style="opacity: 1;" target="_blank" :href="jgHref">
                        <img class="jg-img" :src="jianguna" alt="">
                    </a>
                    <a target="_blank" :href="jgHref">
                        浙江省网络工商
                    </a>
                </div>
                <div style="margin-top: 0.7vw;">
                    <span>
                        2015-2020 杭州先临三维云打印技术有限公司&nbsp&nbsp&nbsp版权所有&nbsp&nbsp&nbsp
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { createView, api, dataset } from 'phoenix';
    import float from './float.vue';
    import Vue from 'vue';
    import LOGO from './assets/logo.png';
    import HY from './assets/hy.png';
    import ERWEIMA from './assets/BitmapCopy6.png';
    import DOWNLOAD from './assets/BitmapCopy2.png';
    import POLICE from './assets/police.png';
    import JIANQUAN from './assets/jianguan.png';
    export default createView({
        name: "t-footer",
        data(){
            return {
                partnerSitesList: [],
                friendlyLink1: [
  {
                        name: '帮助中心',
                        link: 'https://www.3dzao.cn/help'
                    },
                    {
                        name: '申请发票',
                        link: 'https://www.3dzao.cn/help?id=11460'
                    },
                    {
                        name: '常见问题',
                        link: 'https://www.3dzao.cn/help?id=11457'
                    },
                    {
                        name: '城市合伙人',
                        link: 'https://www.3dzao.cn/partner'
                    },
                    {
                        name: '供应商加盟',
                        link: 'https://www.3dzao.cn/prints/vendor'
                    }
                ],
                friendlyLink2: [
   {
                        name: '关于我们',
                        link: 'https://www.3dzao.cn/help?id=11462'
                    },
                    {
                        name: '联系我们',
                        link: 'https://www.3dzao.cn/help?id=11463'
                    },
                    {
                        name: '加入我们',
                        link: 'https://www.3dzao.cn/help?id=11465'
                    },
                    {
                        name: '3D梦想城镇',
                        link: 'https://www.3dzao.cn/activity/dreamtown.html'
                    },
                    {
                        name: '云打印公司',
                        link: 'https://www.3dzao.cn/help?id=11459'
                    }
                ],
                friendlyLink3: [
                      {
                        name: '隐私声明',
                        link: 'https://www.3dzao.cn/help?id=11466'
                    },
                    {
                        name: '版权声明',
                        link: 'https://www.3dzao.cn/help?id=11468'
                    },
                    {
                        name: '服务协议',
                        link: 'https://www.3dzao.cn/help?id=11458'
                    },
                    {
                        name: '保密协议',
                        link: 'https://www.3dzao.cn/help?id=11454'
                    }
                    // {
                    //     name: '法律声明',
                    //     link: '/activity/singlepage?pageName=law'
                    // },

                ],
                logo: LOGO,
                hy: HY,
                erweima: ERWEIMA,
                download: DOWNLOAD,
                police: POLICE,
                jianguna: JIANQUAN,
                hyHref: 'https://v.yunaq.com/certificate?domain=www.3dzao.cn',
                jgHref: 'http://idinfo.zjaic.gov.cn//bscx.do?method=lzxx&id=3301813301810000151958',
                version:  Number(Vue.version.split('.')[0])

            }
        },
        components:{float},
        mounted () {
            this.partnerSites();
        },
        ready(){
            this.partnerSites();
        },
        methods: {
            handHttp ( err, data ) {
                return new Promise( ( resolve, reject ) => {
                    if ( this.version === 2 ) {
                        resolve( err );
                    }else {
                        if( err ) {
                            reject( err );
                        }else {
                            resolve( data );
                        }
                    }
                } )

            },
            //友情链接
            partnerSites() {
                if( this.version === 2 ) {
                    return api('listPage').post({
                        "dictCode":"index_links",
                        "dictName":"",
                        "value1":"on"
                    }, {
                        pageIndex: 1,
                        pageSize: 9999
                    }).then(({ result }) => {
                        if (result.length <= 0 || !Array.isArray( result )) return;
                        dataset("partnerSites", result.filter( r => {
                            return r.value1 === "on";
                        }).sort((a, b) => {
                            return (0 | a.sortNo) - (0 | b.sortNo);
                        }).slice(0,50));
                    });
                }else {
                    return this.api('listPage').post({
                        "dictCode":"index_links",
                        "dictName":"",
                        "value1":"on"
                    }, {
                        pageIndex: 1,
                        pageSize: 9999
                    }).then(( err, { result }  ) => {
                        if (result.length <= 0 || !Array.isArray( result )) return;
                        this.partnerSitesList = result.filter( r => {
                            return r.value1 === "on";
                        }).sort((a, b) => {
                            return (0 | a.sortNo) - (0 | b.sortNo);
                        }).slice(0,50);
                    });
                }
            }
        }
    })
</script>

<style lang="less" scoped>

    .title{
        font-size: 14px;
        margin-bottom: 10px;
        opacity: 1;
    }
    #footers{
        width: 100%;
        /*height: 396px;*/
        background: url("./assets/bg.png");
        background-size: 100% 100%;
        font-family : PingFangSC-Regular;
        font-size:12px;
        color:#ffffff;
        letter-spacing:0;
        text-align:left;
        overflow: hidden;
        a{
            color: #ffffff;
            text-decoration: none;
            opacity: 0.7;
            cursor: pointer;
            &:hover{
                opacity: 1;
                /*text-decoration: underline;*/
            }
        }
        .wrap-footer{
            width: 1180px;
            padding: 32px 0%;
            margin: 0 auto;
            .footers-link{
                overflow: hidden;
                span{
                    display: inline-block;
                    margin: 0 30px 0.7vw 0;
                }
            }
        }
    }
    .footers-dashboard{
        width: 100%;
        border-bottom: 1px solid #fff;
        margin: 16px 0;
        opacity: 0.2;
        overflow: hidden;
    }
    .footers-content{
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding:5px 0 10px 0px;
        .footers-logo{
            position: relative;
            width: 236px;
            /*padding-left: 30px;*/
            /*height: 150px;*/
            img{
                display: inline-block;
                margin: auto;
                position: absolute;
                left: 80px;
                top: 50px;
                width: 120px;
                height: 35px;
                /*height: 60px;*/
                /*border: 1px solid #fff;*/
            }
        }
        .footers-bottomlink{
            width: 25%;
            .wrap-dl{
                display: flex;
                justify-content: space-between;
                /*width: 100%;*/
                flex-wrap: wrap;
                dl{
                    /*padding-left: 5.8vw;*/
                    dd{
                        width: 65px;
                        margin-bottom: 10px;
                        text-align: left;
                        line-height: 17px;
                    }
                }
            }
        }
        .footers-ercode{
            width: 472px;
            img{
                display: inline-block;
                width: 96px;
                height: 96px;
                border: 1px solid #fff;
            }
            dl{
                text-align: center;
                margin-right: 50px;
                float: left;
                opacity: 1;
                dd{
                    opacity: 0.7;
                }
            }
            .phone{
                float: left;
                /*padding-left: 1vw;*/
                padding-top: 0.6vw;
                /*padding-right: 4vw;*/
                opacity: 0.7;
                p{
                    line-height: 20px;
                    margin-bottom: 0.4vw;
                }
            }

        }

    }
    .footers-bottom{
        clear: both;
        text-align: center;
        /*padding-top: 20px;*/
        /*margin: 0 auto;*/
        span{
            opacity: 0.7;
            margin-right: 3.5vw;
        }
        .police-img{
            display: inline-block;
            width: 1.2vw;
        }
        .jg-img{
            display: inline-block;
            width: 1.2vw;
            margin-right: 7px;
            cursor: pointer;
        }
        .hy-img{
            display: inline-block;
            width: 3vw;
            margin-right: 0.8vw;
            cursor: pointer;
        }
        .footers-about{
            margin-top: 19px;
            img{
                margin-right: 1.8vw;
                width: 6vw;
            }
            .jg{
                width: 2.2vw;
            }
        }
    }
    @media screen and (max-width : 1919px){
        #footer{
            width: 100%;
        }
    }
    @media screen and (min-width : 1920px){
        #footer{
            width: 1920px;
            margin: 0 auto;
            .footers-content{
                padding: 30px 20px;
            }
            .wrap-footer{
                .footers-link{
                    span{
                        margin: 0 30px 15px 0;
                    }
                }
            }
            .footers-logo{
                width: 384px;
                img{
                    width: 163px;
                    left: 96px;
                }
            }
            .footers-bottomlink{
                width: 480px;
                .wrap-dl{
                    dl{
                        padding-left: 115px;
                        dd{
                            margin-bottom: 15px;
                        }
                    }
                }
            }
            .footers-ercode{
                width: 768px;
                img{
                    width: 140px !important;
                    height: 140px !important;
                }
                dl{
                    margin-right: 58px;
                }
                .phone{
                    padding-left: 19px;
                    padding-top: 12px;
                    padding-right: 77px;
                    p{
                        margin-bottom: 8px;
                    }
                }
            }
            .footers-bottom{
                span{
                    margin-right: 75px;
                }
                .police-img{
                    width: 23px;
                    height: 25px;
                }
                .footers-about{
                    img{
                        margin-right: 35px;
                        width: 81px;
                    }
                    .jg{
                        width: 43px;
                    }
                }
            }
        }
    }
</style>
