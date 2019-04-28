<template>
	<!--整体的背景色-->
	<div class="tm-t-user-center-background" v-if="navigation === 'show'">
        <!--改版后的顶部头-->
        <div id="sn-user-c-header">
            <div class="fixed-nav">
                <div style="width:1000px">
                    <a href="/">
                        <i class="hz-logo icon-header icon-headerlogo"></i>
                    </a>
                    <div class="hz-city-select">
                        <div class="select-city">{{currCityObj.name}}</div>
                        <div class="city-list">
                            <span @click.stop.prevent="selectCity(item)" :class="{'city-item': true, citySelected: item.value === city}" v-for="item in citysArray" :key="item.name">{{item.name}}</span>
                        </div>
                    </div>
                    <ul class="hz-nav">     
                        <li class="hz-navitem" @mouseover="item.isShow=true" @mouseout="item.isShow=false" v-for="item in navigationItems">
                            <span class="hz-item-name" v-if="item.subMenuItemList">{{item.name}}</span>
                            <!-- <span class="hz-item-name" v-if="item.subMenuItemList">{{ (category === 'sellCenter' && item.name === '会员中心' ) ? '服务商中心' : item.name  }}</span> -->
                            <a class="hz-item-name" v-else :href="item.linkPath">{{item.name}}</a>
                            <div v-if="item.subMenuItemList" class="icon-box">
                                <i class="icon-header" :class="['icon-header',!item.isShow?'icon-headerxiangxia-qs':'icon-headerxiangxia-copy-qs']"></i>
                            </div>
                            <div class="sub-area" v-if="item.subMenuItemList">
                                <sub-nav :list="item.subMenuItemList"></sub-nav>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="right-box">
                    <a href="/commodity/cart" class="icon-header icon-headergouwuche">
                        <span v-if="cartNum" class="message-count">{{cartNum}}</span>
                    </a>
                    <a :href="loginUrl" v-if="!isLogin" class="btn">注册/登录</a>
                    <div class="user-box" v-else>
                        <img class="avatar" :src="usrInfo.avatar"  width="22" height="22">
                        <span class="nickname">{{usrInfo.nickName}}</span>
                        <div class="sub-area">
                            <sub-nav :list="userNav"></sub-nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>
<style lang='less' scoped>
    @import url('./index.less');
    .city-select{
        display: inline-block;
        text-align: center;
        color: #666;
        position: relative;
        margin-right: 0;
        margin-left: 10px;
        /*list-style: none;*/
        .city-label{
            display: inline-block;
            padding-left: 10px;
            line-height: 40px;
            height: 40px;
            z-index: 100001;
            position: relative;
            font-size: 24px;
        }
        ul.cityWrap{
            right: -96px;
            padding: 15px 10px;
            width: 198px;
            line-height: normal;
            text-align: left;
            display: none;

            li{
                display: inline-block;
                padding: 5px;
                width: 40px;
                margin: 0 2px;
                cursor: pointer;
                &:hover{
                    background:#f5f5f5;
                    border-radius:2px;
                }
            }
            .citySelected{
                background:#f5f5f5;
                border-radius:2px;
            }
        }
        ul.cityWrap.citys-show{
            display: block;
        }
    }
    .ul-hor-2{
        margin-left: 50px;
    }
    .teemo-theader{
        font-size: 20px;
        vertical-align: middle;
    }
</style>
<script type='text/javascript'>
    import Vue from 'vue';
    import phoenix  from 'phoenix';
    import oss from 'tm-c-oss';
    import store from 'store';
    import subNav from './subNav.vue';
    import iconImg from './assets/logo3.png';

    const mockData = [{'name': "杭州", 'value': "hangzhou"}, {'name': "徐州", 'value': "xuzhou", 'homeBarCode': "xuzhou-home-nav", "roundId": 226}];
    export default phoenix.createView({
        name: 't-header',
        props: {
            navigation: {
                type: String,
                default: 'show'
            }
        },
        data() {
            // 初始化为主站
            return {
                navigationItems:[
                    {
                        "id": 2,
                        "gmtModified": 1497511985000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "在线3D打印",
                        "code": null,
                        "icon": null,
                        "linkPath": "/order/print",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 2,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": [
                            {
                                "id": 8,
                                "gmtCreate": 1497512527000,
                                "gmtModified": 1497512527000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "在线打印",
                                "code": null,
                                "icon": null,
                                "linkPath": "/order/print",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 2,
                                "path": "/2/",
                                "menuLevel": 2,
                                "sortNumber": 1,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            },
                            {
                                "id": 9,
                                "gmtCreate": 1497512563000,
                                "gmtModified": 1497512563000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "服务介绍",
                                "code": null,
                                "icon": null,
                                "linkPath": "/order/introduce",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 2,
                                "path": "/2/",
                                "menuLevel": 2,
                                "sortNumber": 2,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            },
                            {
                                "id": 10,
                                "gmtCreate": 1497512603000,
                                "gmtModified": 1497512603000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "材料指南",
                                "code": null,
                                "icon": null,
                                "linkPath": "/prints/material/guide",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 2,
                                "path": "/2/",
                                "menuLevel": 2,
                                "sortNumber": 3,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            },
                            {
                                "id": 11,
                                "gmtCreate": 1497512607000,
                                "gmtModified": 1497512607000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "服务站点",
                                "code": null,
                                "icon": null,
                                "linkPath": "/prints/vendor",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 2,
                                "path": "/2/",
                                "menuLevel": 2,
                                "sortNumber": 4,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            }
                        ]
                    },
                    {
                        "id": 57,
                        "gmtCreate": 1499219468000,
                        "gmtModified": 1499219468000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "3D商城",
                        "code": null,
                        "icon": "hot",
                        "linkPath": "/commodity/list.html",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 3,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": null
                    },
                    {
                        "id": 3,
                        "gmtCreate": 1497512134000,
                        "gmtModified": 1497512134000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "3D模型库",
                        "code": null,
                        "icon": null,
                        "linkPath": "/datas",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 4,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": null
                    },
                    {
                        "id": 59,
                        "gmtCreate": 1505308410000,
                        "gmtModified": 1505308410000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "找设计",
                        "code": null,
                        "icon": null,
                        "linkPath": "/designer/demand.html",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 5,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": [
                            {
                                "id": 60,
                                "gmtCreate": 1505308479000,
                                "gmtModified": 1505308479000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "需求市场",
                                "code": null,
                                "icon": null,
                                "linkPath": "/designer/demand.html",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 59,
                                "path": "/59/",
                                "menuLevel": 2,
                                "sortNumber": 1,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            },
                            {
                                "id": 61,
                                "gmtCreate": 1505308539000,
                                "gmtModified": 1505308539000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "设计师",
                                "code": null,
                                "icon": null,
                                "linkPath": "/designer.html",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 59,
                                "path": "/59/",
                                "menuLevel": 2,
                                "sortNumber": 2,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            }
                        ]
                    },
                    {
                        "id": 5,
                        "gmtCreate": 1497512448000,
                        "gmtModified": 1497512448000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "创客圈",
                        "code": null,
                        "icon": null,
                        "linkPath": "/community",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 6,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": null
                    },
                    {
                        "id": 6,
                        "gmtCreate": 1497512488000,
                        "gmtModified": 1497512488000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "赛事活动",
                        "code": null,
                        "icon": "new",
                        "linkPath": "/activity",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 7,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": null
                    },
                    {
                        "id": 7,
                        "gmtCreate": 1497512504000,
                        "gmtModified": 1497512504000,
                        "isDeleted": "n",
                        "creator": "sys",
                        "modifier": "sys",
                        "menuBarId": 1,
                        "name": "经验案例",
                        "code": null,
                        "icon": null,
                        "linkPath": "/articles/case/list.html",
                        "linkName": null,
                        "isShow": false,
                        "parentId": null,
                        "path": "/",
                        "menuLevel": 1,
                        "sortNumber": 8,
                        "isOpen": "y",
                        "tips": null,
                        "subMenuItemList": [
                            {
                                "id": 12,
                                "gmtCreate": 1497512649000,
                                "gmtModified": 1497512649000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "经验案例",
                                "code": null,
                                "icon": null,
                                "linkPath": "/articles/case/list.html",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 7,
                                "path": "/7/",
                                "menuLevel": 2,
                                "sortNumber": 1,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            },
                            {
                                "id": 13,
                                "gmtCreate": 1497512693000,
                                "gmtModified": 1497512693000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "教程分享",
                                "code": null,
                                "icon": null,
                                "linkPath": "/articles/course/list.html",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 7,
                                "path": "/7/",
                                "menuLevel": 2,
                                "sortNumber": 2,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            },
                            {
                                "id": 14,
                                "gmtCreate": 1497512705000,
                                "gmtModified": 1497512705000,
                                "isDeleted": "n",
                                "creator": "sys",
                                "modifier": "sys",
                                "menuBarId": 1,
                                "name": "热点专题",
                                "code": null,
                                "icon": null,
                                "linkPath": "/articles/topic-list.html",
                                "linkName": null,
                                "isShow": "n",
                                "parentId": 7,
                                "path": "/7/",
                                "menuLevel": 2,
                                "sortNumber": 3,
                                "isOpen": "y",
                                "tips": null,
                                "subMenuItemList": null
                            }
                        ]
                    }
                ],
                hideDevice: true,
                hideIssue: true,
                hideInfo: true,
                hideCase: true,
                hideCity: true,
                hideOnline3dPrint: true,
                isLogin: false,
                timeInter:'',
                user_id: '',
                usrInfo: {nickName:'',avatar:''},
                status: false,
                toastText: '',
                // meeageCount:'',//未读消息的数量

                // limit > 1 byte
                logo: require('./assets/logo3.png'),
                newIcon: require('./assets/new.png'),
                hotIcon: require('./assets/hot.png'),
                defaultHead: require('./assets/default_avatar.png'),

                // 使用固定的线上图片地址，因为base64导致页面源码太多
                // logo: 'http://cdnimg.3dker.cn/bd31ce1e5b24953fd85437223fb6768d',
                // newIcon: 'http://cdnimg.3dker.cn/298e76d62933e6e06260865646d6b090',
                // defaultHead: 'http://cdnimg.3dker.cn/08f7340b20478e998ddc3e8278e334b6',

                hasSign:false,
                coupons:0,
                invCode:'',
                loginUrl:'',
                registerUrl:'',
                isRenderENv:'',//是否2。0服务端渲染模式
                apiMethod:'',
                isHomePage:false, //是否首页,
                city: 'hangzhou',
                citysArray:[],
                currCityObj: {},
                cartNum: "",
                userNav: [
                    {
                        name: '会员中心',
                        linkPath: '/finance/user',
                    },
	                {
		                name: '我的订单',
		                linkPath: '/order/bought',
	                },
                    {
                        name: '我的消息',
                        linkPath: '/user/message',
                    },
	                {
		                name: '我的资料',
		                linkPath: '/user/account/profile/edit',
	                },
                    {
                        name: '退出',
                        click: () => {
                            this.logout();
                        }
                    }
                ]
            }
        },
        components: {
            subNav
        },
        created() {
        },
        mounted(){//for vue 2.0z
            this.apiMethod = this.version2() ? 'post' : 'connect';  // 2.0 : post  // 1.0 : connect
            this.queryHomeRegionConfig();
            this.isRenderENv = this.isRender();
            if(this.isRenderENv) return ;
            this.addShortIcon();
            this.isHomePage = (() => {
                return  window.location.pathname === '/';
            })();
            this.checkLogin(this.getUsrInfo);
            this.loginUrl = '/i/login/?referrer=' + window.encodeURIComponent(this.$route.path);
            this.registerUrl = '/i/register/?referrer=' + window.encodeURIComponent(this.$route.path);
        },
        ready(){
            this.apiMethod = this.version2() ? 'post' : 'connect';  // 2.0 : post  // 1.0 : connect
            this.queryHomeRegionConfig();
            this.isRenderENv = this.isRender();
            if(this.isRenderENv) return ;
            this.addShortIcon();
            this.isHomePage = (() => {
                return  window.location.pathname === '/';
            })();
            this.checkLogin(this.getUsrInfo);
            this.loginUrl = '/i/login/?referrer=' + window.encodeURIComponent(this.$route.path);
            this.registerUrl = '/i/register/?referrer=' + window.encodeURIComponent(this.$route.path);
        },
        methods: {
            // SystemApiService
            queryHomeRegionConfig(){
                var initCity = window.localStorage.getItem('city');
                if(initCity){
                    this.city = initCity;
                }else{
                    window.localStorage.setItem('city', this.city)
                }
                return this.api('queryHomeRegionConfig').post()
                    .then( this.handHttp )
                    .then( ({result}) => {
                    if(result && Array.isArray(result)){
                        this.citysArray = result;
                    }else{
                        this.citysArray = mockData;
                    }
                    this.currCityObj = this.citysArray.find( item =>{
                        return item && item.value && item.value === this.city;
                    })
                    window.localStorage.setItem('currCityObj', JSON.stringify(this.currCityObj))
                    this.getNavigationItems();
                }).catch(err =>{
                    console.log('err:',err);
                });
            },
            selectCity(item){
                if(item && item.value){
                    this.city = item.value;
                    this.currCityObj = item;

                    window.localStorage.setItem('city', item.value);
                    window.localStorage.setItem('currCityObj', JSON.stringify(this.currCityObj));

                    this.getNavigationItems();
                    this.$emit('changeCity', item);
                    // 在 关于我们页面 切换服务站点时 相关页面也要改变，主战杭州没有关于我们 所以不用切换
                    if(this.$route.name === 'atySinglePage' && item.value !== 'hangzhou'){
                        this.$router.push({
                            path: `/activity/singlepage/${item.value}_about_us.html`
                        });
                    }else if (this.$route.name === 'atySinglePage' && item.value === 'hangzhou'){
                        window.location.assign('/hangzhou')
                    }

                }
            },
            checkLogin(cb) {
                this.api('getUserId').post()
                    .then( this.handHttp )
                    .then( data => {
                    this.isLogin = (data && data !== '');
                    if (this.isLogin) {
                        this.user_id = data;
                        cb();
                    }
//                    this.usrInfo.avatar = this.defaultHead;
                });
            },
            logout() {
                if(this.isRenderENv) return ;
                store.remove('session_token');
                store.remove('user_id');
                store.remove('user_info');
                this.removeCookies('x_auth_token');
                location.reload();
            },
            getUsrInfo() {
                // this.getMessageInfo();//获取用户的未读消息数量
                // this.getInvCode();
                // 缓存的数据，不存在就重新获取
                let loc_usrInfo = store.get('user_info');
                if (!loc_usrInfo) {
                    this.queryUserFromOnline();
                } else {
                    this.usrInfo = Object.assign({}, this.usrInfo, {
                        nickName: loc_usrInfo.nick_name || loc_usrInfo.profile.nickname,
                        avatar: loc_usrInfo.profile.avatar ? this.computedCDN(loc_usrInfo.profile.avatar) : this.defaultHead
                    });
                }
                this.getCartNum();
            },
            queryUserFromOnline() {
                if (this.usrInfo && this.usrInfo.cache) return;
                this.api('queryUserByUserId').post(this.user_id)
                    .then( this.handHttp )
                    .then( data=> {
                    let obj = data.result;
                    this.usrInfo = Object.assign({}, this.usrInfo, {
                        nickName: obj.nickName,
                        avatar: obj.avatar ? this.computedCDN(obj.avatar) : this.defaultHead,
                        points:obj.points,
                        cache: true
                    });
                });
                //优惠券
                // this.api('queryCouponCountByUserId')[ this.apiMethod ](this.user_id).then( data =>{
                //     this.coupons = (data && data.result) || 0;
                // });
                //是否签到
                // this.api('hasSignNowDay')[ this.apiMethod ](this.user_id).then( data => {
                //     this.hasSign = data && data.result;
                // });
            },
            computedCDN(path) {
                if(this.isRenderENv) return ;
                let icon = (window.export_minas.cdn_host || process.env.CDN) + '/' + path + '@40w_40h_1c_1e_0l_100q_1wh.jpg';
                return icon;
            },
            addShortIcon() {
                if(this.isRenderENv) return ;
                var doc = document;
                var extLink = document.getElementById("shortIcon");
                if (!extLink) {
                    var iconUrl = '//cdnimg.3dker.cn/favicon.ico';
                    var link = doc.createElement("link");
                    link.setAttribute("id", "shortIcon");
                    link.setAttribute("rel", "shortcut icon");
                    link.setAttribute("href", iconUrl);
                    var heads = doc.getElementsByTagName("head");
                    if (heads.length)
                        heads[0].appendChild(link);
                    else
                        doc.documentElement.appendChild(link);
                }
            },
            // //获取未读消息的数量
            // getMessageInfo(){
            //     var query = {"isRead":"n","channel":"message","receiver":this.user_id};
            //     this.api('messageCount')[ this.apiMethod ](query).then(data=>{
            //         this.meeageCount = data.result === 0 ? '' : data.result;
            //     });
            // },
            //获取邀请码
            // getInvCode(){
            //     this.api('getInviteCode')[ this.apiMethod ](this.user_id).then(data=>{
            //         this.invCode = data && data.result;
            //     });
            // },
            version2(){
                return Vue.version.split('.')[0] === '2';
            },
            isRender(){
                return this.version2() && process.env.VUE_ENV!=='client';
            },
            removeCookies(key){
                let date = new Date();
                date.setTime(date.getTime()-10000);
                document.cookie = key + "=v; expires=" + date.toGMTString() + ";path=/";//设置cookie
            },
            handHttp ( err, data ) {
                var version = Number(Vue.version.split('.')[0]);
                return new Promise( ( resolve, reject ) => {
                    if ( version === 2 ) {
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
            getCartNum() {
                this.api('totalSkuByUserId').post(this.user_id)
                .then( this.handHttp )   
                .then( data =>{
			        let num = data.result === 0 ? '' : data.result;
			        num = num > 99 ? '99+' : num;
			        this.cartNum = num;
		        });
            },
            //获取导航的items
            getNavigationItems(){
                const curCityObj = JSON.parse(window.localStorage.getItem('currCityObj')|| '{}');
                this.api('listMenuItem').post({menuBarCode: curCityObj && curCityObj.homeBarCode ? curCityObj.homeBarCode : 'home-nav'})
                .then( this.handHttp )
                .then( data =>{
                    this.navigationItems = [];
                    data.result.forEach(v => {
                        // if(v.linkPath !== '/'){
                            v.isShow = false;
                            this.navigationItems.push(v);
                        // }
                    });
                })
                .catch( err => {
                    console.log( err );
                } );
            }
        }
    });
</script>
<style type="text/css" src="./assets/iconfont/iconfont.css"></style>