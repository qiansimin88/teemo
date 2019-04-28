<template>
    <div>
        <toast :show.sync="status">{{ toastText }}</toast>
        <div class="contain">
            <div class="header-wrap">
                <div class="header-action">
                    <ul class='ul-hor'>
                        <li v-if="!isHomePage && navigation === 'hide' ">
                            <a href="/">首页</a>
                        </li>
                        <li>
                            <a href="/prints/vendor">3D打印服务商</a>
                        </li>
                        <li>
                            <a href="/activity/dreamtown.html">3D梦想城镇</a>
                        </li>
                        <!--设备工具-->
                        <li @mouseover="hideDevice=false" @mouseout="hideDevice=true" class="li-expand-item">
                            <a style="position: relative; top: -1px;">设备工具<i
                                    :class="['teemo-theader',hideDevice?'teemo-theader-xiangxia':'teemo-theader-xiangxia-copy']"></i></a>
                            <div style="position: relative;">
                                <div>
                                    <ul class="expandWrap flex-column deviceWrap">
                                        <li><a href="/device/printer">3D打印</a></li>
                                        <li><a href="/device/scan">3D扫描</a></li>
                                        <!--<li><a href="/design/design.html">3D设计</a></li>-->
                                        <li><a href="/design/tools">在线建模</a></li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <!--售卖中心-->
                        <!-- <li>
                            <a href="/finance/user">会员中心</a>
                        </li> -->
                        <!--购物车-->
                        <li>
                            <a href="/commodity/cart">
                                <i class='teemo-theader teemo-theader-gouwuche'></i>
                                <span></span>
                            </a>
                        </li>
                        <!--消息-->
                        <li>
                            <a href="/user/message">
                                <i class='teemo-theader teemo-theader-xiaoxi'><span  class="xiaoxi-count">{{meeageCount}}</span></i>

                            </a>
                        </li>
                        <!--购物车-->
                        <li v-if="false">'
                            <a href="/commodity/cart">
                                <i class='teemo-theader teemo-theader-gouwuche'></i>
                                <span></span>
                            </a>
                        </li>
                        <!--发布-->
                        <li @mouseover="hideIssue=false" @mouseout="hideIssue=true" class="li-expand-item">
                            <a>
                                <i class='teemo-theader teemo-theader-upload'></i>
                            </a>
                            <div style="position: relative">
                                <div>
                                    <ul class="expandWrap publishWrap">
                                        <li><a href="/datas/publish" rel="nofollow">发布数据</a></li>
                                        <li><a href="/community/published" rel="nofollow">发布主题</a></li>
                                        <li><a href="/articles/user/issue.html" rel="nofollow">发布文章</a></li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <!--isLogin=false-->
                        <li v-if="!isLogin && !loginPage">
                            <a :href="loginUrl" class='btn btn-primary btn-sm'
                               style='padding:2px 4px;text-decoration: none;margin-right:4px;color:#fff;border-radius: 2px;'>登录</a>
                            <a :href="registerUrl">注册</a>
                        </li>
                        <!--isLogin=true-->
                        <li v-if='isLogin && !loginPage' @mouseover.stop="clearTime(showInfo)" @mouseout.stop="setTimeoutHidden(()=>{hideInfo=true})">
                            <!--avatar-->
                            <span class='avatar'>
                                <a href="/user/datas">
                                    <img :src="usrInfo.avatar"/>
                                </a>
                            </span>
                            <div style="position: relative">
                                <div :class="['expandWrap','userInfoWrap',hideInfo?'hide':'']">
                                    <div class='user-expand-list list-1' style="background: #edf8fd;">
                                        <div class="flex-row" style="align-items: center;justify-content: space-between;">
                                            <span class='flex-1' style='text-align: left;width: 116px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>ID：{{usrInfo.name || usrInfo.nickName}}</span>
                                            <button style="padding:0;width:58px;height:18px;border-radius: 2px;"
                                                    :class="['btn','btn-primary','btn-sm',!hasSign?'checkIn':'notAllow']" @click="checkIn">
                                                {{hasSign?'已签到':'立即签到'}}
                                            </button>
                                        </div>
                                        <div class="flex-row" style='margin-top:10px;justify-content: space-between;'>
                                            <a href="/user/coupons"><span>优惠券：<span class="text-danger" v-text="coupons"></span></span></a>
                                            <a href="/user/mine/points"><span>积分：<span class="text-danger" v-text="usrInfo.points || 0"></span></span></a>
                                            <span>邀请码：<span class="text-danger" v-text="invCode"></span></span>
                                        </div>
                                    </div>
                                    <div class='user-expand-list list-2'>
                                        <div class="flex-row list-2-item">
                                            <span><a href="/finance/user" rel="nofollow">会员中心</a></span>
                                            <span class="splite"></span>
                                            <span><a href="/user/message" rel="nofollow">我的消息</a></span>
                                        </div>
                                        <!-- <div class="flex-row list-2-item">
                                            <span><a href="/user/account/profile/edit" rel="nofollow">个人资料</a></span>
                                            <span class="splite"></span>
                                            <span><a href="/user/account/verify" rel="nofollow">认证资料</a></span>
                                        </div> -->
                                        <div class="flex-row list-2-item">
                                            <span><a href="/user/mine/group" rel="nofollow">我的圈子</a></span>
                                            <span class="splite"></span>
                                            <span><a @click.stop="logout">退出登录</a></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div :class="['flex-row',navigation === 'hide'?'hide':'']" style="justify-content: center;border-bottom: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;">
                <div class="header-nav">
                    <a href='/' style='display: block;margin-right:50px;'><img :src="logo" class="logo" width="122" height="34"/></a>

                    <ul class="ul-hor-2">
                        <li v-if="!isHomePage" ><a href="/">首页</a></li>
                        <li v-for="project in navigationItems" @mouseover="project.isShow=true" @mouseout="project.isShow=false" class="li-expand-item">
                            <!--当有二级菜单时-->
                            <a v-if="project.subMenuItemList && project.subMenuItemList.length > 0" :href="project.linkPath">{{project.name}}
                                <i :class="['teemo-theader',!project.isShow?'teemo-theader-xiangxia':'teemo-theader-xiangxia-copy']"></i>
                            </a>
                            <!--没有二级菜单时-->
                            <a v-else :href="project.linkPath">{{project.name}}</a>
                            <span v-if="project.icon == 'new'" class="newIcon"><img :src="newIcon"/></span>
                            <span v-if="project.icon == 'hot'" class="hotIcon"><img :src="hotIcon"/></span>

                            <div v-if="project.subMenuItemList && project.subMenuItemList.length > 0" style="position: relative;">
                                <div>
                                    <ul class="expandWrap caseWrap" >
                                        <li v-for="sub in project.subMenuItemList">
                                            <a :href="sub.linkPath">{{sub.name}}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>

                </div>
            </div>

            <!--<div :class="['flex-row',navigation === 'hide'?'hide':'']" style="justify-content: center;border-bottom: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;"><div class="header-nav">
                <a href='/' style='display: block;margin-right:50px;'><img :src="logo" class="logo" width="83" height="30"/></a>
                <ul class='ul-hor-2'>
                    <li v-if="!isHomePage"><a href="/">首页</a></li>
                    <li @mouseover="hideOnline3dPrint=false" @mouseout="hideOnline3dPrint=true" class="li-expand-item">
                        <a href="/order/print">在线3D打印<i
                                :class="['teemo-theader',hideOnline3dPrint?'teemo-theader-xiangxia':'teemo-theader-xiangxia-copy']"></i></a>
                        <div style="position: relative;">
                            <div>
                                <ul class="expandWrap caseWrap">
                                    <li><a href="/order/print"
                                           rel="nofollow">在线打印</a></li>
                                    <li><a href="/order/introduce"
                                           rel="nofollow">服务介绍</a></li>
                                    <li><a href="/prints/material/guide"
                                           rel="nofollow">材料指南</a></li>
                                    <li><a href="/prints/vendor" rel="nofollow">服务站点</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <a href="/datas">3D模型库</a>
                    </li>
                    <li>
                        <a href="/designer">设计师</a>
                        <span class="newIcon"><img :src="newIcon"/></span>
                    </li>
                    <li>
                        <a href="/community">创客圈</a>
                    </li>
                    <li>
                        <a href="/activity">赛事活动</a>
                        <span class="newIcon"><img :src="newIcon"/></span>
                    </li>
                    <li @mouseover="hideCase=false" @mouseout="hideCase=true">
                        <a href="/articles/case/1.html">经验案例<i :class="['teemo-theader',hideCase?'teemo-theader-xiangxia':'teemo-theader-xiangxia-copy']"></i></a>
                        <div style="position: relative;">
                            <div :class="{'hide':hideCase}">
                                <ul class="expandWrap caseWrap">
                                    <li><a href="/articles/case/1.html">经验案例</a></li>
                                    <li><a href="/articles/course/1.html">教程分享</a></li>
                                    <li><a href="/articles/seo">热点专题</a></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div></div>-->
        </div>
        <toast :show.sync="status">{{ toastText }}</toast>
    </div>
</template>
<style lang='less' scoped>
    @import url('./index.less');
</style>
<script type='text/javascript'>
    import phoenix from 'phoenix';
    import store from 'store';
    import toast from 'phoenixUI/toast';
    import Vue from 'vue';

    export default phoenix.createView({
        name: 't-header',
        props: {
            navigation: {
                type: [String, Boolean],
                default: 'show'
            }
        },
        data() {
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
                hideOnline3dPrint: true,
                isLogin: false,
                loginPage: false,
                timeInter:'',
                user_id: '',
                usrInfo: {nickName:'',avatar:''},
                status: false,
                toastText: '',
                meeageCount:'',//未读消息的数量
                
	            logo: "https://cdnimg.3dker.cn/4074cd04379530826f1c111a5656a63a",
	            newIcon: "https://cdnimg.3dker.cn/78b14cd06439e153bca43da956ee43de",
	            hotIcon: "https://cdnimg.3dker.cn/079f3a9408f2123703f5d396e832fe2d",
	            defaultHead: "https://cdnimg.3dker.cn/fa5faa57e5d7af2b20b5f22753074b27",

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
                isHomePage:false //是否首页
            }
        },
        components: {
            toast
        },
        mounted(){//for vue 2.0z
            this.getNavigationItems();
            this.isRenderENv = this.isRender();
            if(this.isRenderENv) return ;
            this.addShortIcon();
            this.loginPage = (() => {
                return window.location.pathname.indexOf('/i/') !== -1;
            })();
            this.isHomePage = (() => {
                return  window.location.pathname === '/';
            })();
            this.apiMethod = this.version2() ? 'post' : 'connect';  // 2.0 : post  // 1.0 : connect
            this.checkLogin(this.getUsrInfo);
            this.loginUrl = '/i/login/?referrer=' + window.encodeURIComponent(this.$route.path);
            this.registerUrl = '/i/register/?referrer=' + window.encodeURIComponent(this.$route.path);
        },
        ready() {
            this.getNavigationItems();
            this.isRenderENv = this.isRender();
            if(this.isRenderENv) return ;
            this.addShortIcon();
            this.loginPage = (() => {
                return window.location.pathname.indexOf('/i/') !== -1;
            })();
            this.isHomePage = (() => {
                return  window.location.pathname === '/';
            })();
            this.apiMethod = this.version2() ? 'post' : 'connect';  // 2.0 : post  // 1.0 : connect
            this.checkLogin(this.getUsrInfo);
            this.loginUrl = '/i/login/?referrer=' + window.encodeURIComponent(this.$route.path);
            this.registerUrl = '/i/register/?referrer=' + window.encodeURIComponent(this.$route.path);
        },
        methods: {
            checkLogin(cb) {
                this.api('getUserId')[ this.apiMethod ]().then( data => {
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
                this.getMessageInfo();//获取用户的未读消息数量
                this.getInvCode();
                // 缓存的数据，不存在就重新获取
                let loc_usrInfo = store.get('user_info');
                if (!loc_usrInfo.profile.avatar) {
                    this.queryUserFromOnline();
                } else {
                    this.usrInfo = Object.assign({}, this.usrInfo, {
                        nickName: loc_usrInfo.profile.nickname,
                        avatar: loc_usrInfo.profile.avatar ? this.computedCDN(loc_usrInfo.profile.avatar) : this.defaultHead
                    });
                }
            },
            queryUserFromOnline() {
                if (this.usrInfo && this.usrInfo.cache) return;
                this.api('queryUserByUserId')[ this.apiMethod ](this.user_id).then( data=> {
                    let obj = data.result;
                    this.usrInfo = Object.assign({}, this.usrInfo, {
                        nickName: obj.nickName,
                        avatar: obj.avatar ? this.computedCDN(obj.avatar) : this.defaultHead,
                        points:obj.points,
                        cache: true
                    });
                });
                this.api('queryCouponCountByUserId')[ this.apiMethod ](this.user_id).then( data =>{
                    this.coupons = (data && data.result) || 0;
                });
                this.api('hasSignNowDay')[ this.apiMethod ](this.user_id).then( data => {
                    this.hasSign = data && data.result;
                });
            },
            computedCDN(path) {
                if(this.isRenderENv) return ;
                let icon = (window.export_minas.cdn_host || process.env.CDN) + '/' + path + '@40w_40h_1c_1e_0l_100q_1wh.jpg';
                return icon;
            },
            showInfo() {
                this.hideInfo = false;
                if (!this.usrInfo.cache) {
                    this.queryUserFromOnline();
                }
            },
            viewUser() {
                return `/user?id=${this.user_id}`;
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
            checkIn() {
                if (this.hasSign) return;
                this.api('sign')[ this.apiMethod ](this.user_id).then(data => {
                    this.hasSign = true;
                    this.usrInfo.points = parseInt(this.usrInfo.points,10) + 2;
                    if(!this.version2()){
                        this.status = true;
                        this.toastText = '签到成功！积分＋2';
                        this.$dispatch('pointChange',this.usrInfo.points);
                    }
                });
            },
            //获取未读消息的数量
            getMessageInfo(){
                var query = {"isRead":"n","channel":"message","receiver":this.user_id};
                this.api('messageCount')[ this.apiMethod ](query).then(data=>{
                    this.meeageCount = data.result === 0 ? '' : data.result;
                });
            },
            //获取邀请码
            getInvCode(){
                this.api('getInviteCode')[ this.apiMethod ](this.user_id).then(data=>{
                    this.invCode = data && data.result;
                });
            },
            version2(){
                return Vue.version.split('.')[0] === '2';
            },
            isRender(){
                return this.version2() && process.env.VUE_ENV!=='client';
            },
            setTimeoutHidden(cb){
                if(this.timeInter) clearTimeout(this.timeInter);
                this.timeInter = setTimeout(()=>{
                    cb();
                },500);
            },
            clearTime(cb){
                cb();
                if(this.timeInter) clearTimeout(this.timeInter);
            },
            removeCookies(key){
                let date = new Date();
                date.setTime(date.getTime()-10000);
                document.cookie = key + "=v; expires=" + date.toGMTString() + ";path=/";//设置cookie
            },
            //获取导航的items
            getNavigationItems(){
               this.api('listMenuItem').post({menuBarCode:'home-nav'}).then((err,data)=>{
                    if(!data){
                        data = err;
                        err = err.errMsg;
                    }
                    if(err) return console.log(err);
                    this.navigationItems = [];
                    data.result.forEach(v => {
                        if(v.linkPath !== '/'){
                            v.isShow = false;
                            this.navigationItems.push(v);
                        }
                    });
                });
            }
        }
    });
</script>
<style type="text/css" src="./assets/iconfont/iconfont.css"></style>