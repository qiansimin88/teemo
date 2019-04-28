<template>
	<div class="tm-m-comment-outside" :class="{'tm-m-comment-hide': commentHide}">
		<confirm :show.sync="confirmShow" :on-submit="confirm_callback">是否删除评论</confirm>
		<alert :show.sync="alertShow">{{alertMsg}}</alert>
		<scroll :paging="scroll">

			<div class="tm-m-comment">
				<div class="tm-m-comment-title">全部泡泡</div>

				<div v-for="(index, comment) in comment_arr" class="tm-m-comment-single"
					 v-bind:class="{'tm-m-comment-deleted': deleted_arr[index]}" :data-num="deleted_arr[index]">

					<!--评论分隔线-->
					<hr></hr>

					<!--头像+楼层-->
					<div class="tm-m-comment-single-header">
						<avatar :key="comment.avatar" :user_id="comment.userId" :nick_name="comment.nickName" :is_theme_owner="comment.isRoundSubjectOwner" :is_group_owner="comment.isRoundOwner" :is_designer="comment.isDesigner" :default_avatar="default_avatar"></avatar>
						<!--<span class="tm-m-comment-single-floor">{{comment.floor | floor}}</span>-->
                        <!--操作按钮-->
                        <span class="tm-m-comment-single-bottom-btn">
                            <span v-if="comment.canDelete">
                                <i ubt="rm-reply" :ubt-id="comment.id" class="teemo teemo-shanchu" @click.stop="deleteClick($event, index)"></i>
                            </span>
                            <span>
                                <span :class="{'tm-m-comment-liked': comment_arr[index].isPraise}" v-text="comment.praiseNum | format_zan_number"></span>
                                <i :ubt="comment_arr[index].isPraise ? 'unlike' : 'like' " :ubt-id="comment.id" class="teemo teemo-zan" :class="{'tm-m-comment-liked': comment_arr[index].isPraise}" @click.stop="likeClick($event, comment.objectId, comment.id,comment.userId,$index)"></i>
                            </span>
                            <span>
                                    <i class="teemo teemo-pinglun" @click.stop="commentClick($event, comment.objectId, comment.id, comment.nickName, index)"></i>
                            </span>
                        </span>
					</div>

					<!--父级评论-->
					<div v-if="comment.quoteCommentStatus != 'no'" class="tm-m-comment-single-parent">

						<template v-if="comment.quoteCommentStatus === 'ok'">
							<!--父级评论昵称 + 时间-->
							<div class="tm-m-comment-single-parent-header">
								回复:<span v-text="comment.quoteComment.nickName"></span>
								发表于<span v-text="comment.quoteComment.gmtCreate | get_time"></span>
							</div>

							<!--父级评论内容-->
							<div class="tm-m-comment-single-parent-content">
								<p>{{{parseUserId2href(comment.quoteComment.content)}}}</p>
							</div>
						</template>
                        <template v-if="comment.quoteCommentStatus === 'del'">
							<div class="tm-m-comment-single-parent-del">
								<p>原评论已删除</p>
							</div>
						</template>
</div>

<!--评论内容-->
<div class="tm-m-comment-single-content">
    <div v-if="comment.content.substring(0,3)=='<p>'">{{{parseUserId2href(comment.content)}}}</div>
    <div v-else class="comment-content">{{{parseUserId2href(comment.content)}}}</div>
</div>

<!--评论时间 + 操作按钮-->
<div class="tm-m-comment-single-bottom">
    <!--评论时间-->
    <span class="tm-m-comment-single-bottom-time" v-text="comment.gmtCreate | get_time"></span>

    <!--楼层显示-->
    <span class="tm-m-comment-single-floor">{{comment.floor | floor}}</span>

    
</div>
</div>

</div>
<!--显示全部按钮-->
<div v-show="isNewComment" class="showMoreComment">
    <span @click="showAllComment">查看所有泡泡</span>
</div>
</scroll>
</div>

<!--图片预览控件-->
<div class="phoenix-2-layer">	
	<div class="phoenix-mask"  :class="{ 'hide' : imgShow, 'transparent' : false }" @click="closeImageShow">
        <img :src="showImagePath" alt="">
    </div>
</div>


</template>

<script>
    import Phoenix from 'phoenix';
    import confirm from 'phoenixUI/confirm';
    import alert from 'phoenixUI/alert';
    import avatar from 'tm-m-avatar';
    import scroll from 'tm-m-scroll';
    import oss from 'tm-c-oss';

    export default Phoenix.createView({
        name: 'tm-m-comment',
        props: {
            comment_msg: {
                type: Function,
                required: true,
                twoWay: true,
                default: function() {

                }
            },
            theme: {
                type: [String, Number],
                required: true
            },
            default_avatar: {
                type: String,
                required: true
            },
            error_handle: {
                type: Function
            },
            refresh_comment: {
                type: Function,
                twoWay: true,
                default: function() {}
            },
            delete_comment: {
                type: Function,
                twoWay: true,
                default: function() {}
            },
            isNewComment: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                imgShow:true,//是否显示图片
                showImagePath:'',//展示的图片地址
                commentHide: true,
                outsideStyle: '',
                comment_arr: [],
                deleted_arr: [],
                cdn_host: process.env.STATIC_CDN,
                confirmShow: false,
                alertShow: false,
                alertMsg: '网络错误',
                currentIndex: 0,
                currentEvent: '',
                currentCommentId: '',
                pageSize: 50,
                pageIndex: 1,
                deleteIndex: 1,
                totalPage: 1
            };
        },
        created() {},
        watch: {
            'comment_arr': function(val, oldVal) {
                this.commentHide = !(val.length > 0);
            }
        },
        ready() {
            if(this.isNewComment){
                this.getLastComments();
            }else{
                this.getComments();
            }
            this.refresh_comment = this.refresh;
        },
        methods: {
            //锚点到刚发的评论
            gotoComment() {
                var commentPosition = document.getElementsByClassName('showMoreComment')[0].offsetTop;
                var contentArea = document.getElementsByClassName('theme-comments')[0];
                contentArea.parentElement.scrollTop = commentPosition;
            },
            //获取最后几条评论
            getLastComments(){
                this.api('listSubjectCommentDetail').send({
                    objectId: this.theme,
                    type: 'subject',
                    sortType:'gmtCreateDesc',
                    pageInfo: {
                        pageSize: 10,
                        pageIndex: 1
                    }
                }).then((data,err)=>{
                    if(err) return console.log(err);
                    data.result.result.reverse();
                    this.comment_arr = data.result.result;
                    

                    //遍历冒泡数组，取出回复评论的引用，仅展示第一个dom元素，其余不展示
                    data.result.result.forEach((item,index) => {
                        //判断回复引用内容，取出第一个标签，作为引用内容显示
                        if(item.quoteCommentStatus === 'ok'){
                            var commentLabel = document.createElement('div');
                            commentLabel.innerHTML = item.quoteComment.content;
                            var label = document.createElement('div');
                            label.appendChild(commentLabel.firstChild) ;
                            item.quoteComment.content = label.innerHTML;
                        }

                        data.result.result[index] = item;
                    });

                    setTimeout(()=> {
                        //定位到评论区
                        this.gotoComment();
                    }, 120);
                });
            },
            //获取全部评论
            getComments() {
                this.api('listSubjectCommentDetail').send({
                    objectId: this.theme,
                    type: 'subject',
                    pageInfo: {
                        pageSize: this.pageSize,
                        pageIndex: this.pageIndex
                    }
                }).then(res => {
                    if (res.error) {
                        throw new Error(res.error.err_msg || res.error);
                    }
                    this.totalPage = res.result.pageInfo.totalPage || 1;
                    res.result.result = res.result.result || [];

                    //遍历冒泡数组，取出回复评论的引用，仅展示第一个dom元素，其余不展示
                    res.result.result.forEach((item,index) => {
                        //判断回复引用内容，取出第一个标签，作为引用内容显示
                        if(item.quoteCommentStatus === 'ok'){
                            var commentLabel = document.createElement('div');
                            commentLabel.innerHTML = item.quoteComment.content;
                            var label = document.createElement('div');
                            label.appendChild(commentLabel.firstChild) ;
                            item.quoteComment.content = label.innerHTML;
                        }

                        res.result.result[index] = item;
                    });

                    this.$set('comment_arr', this.comment_arr.concat(res.result.result));
                    var _this = this;
                    setTimeout(function() {
                        var labelArray = document.getElementsByClassName('tm-m-comment-single-content');

                        for (var index = 0; index < labelArray.length; index++) {
                            var element = labelArray[index];
                            var pics = element.getElementsByTagName('img');
                            for (var i = 0; i < pics.length; i++) {
                                var pic = pics[i];
                                try {
                                    var key = pic.attributes["data-key"].nodeValue;
                                    var w = pic.attributes["data-width"].nodeValue;
                                    (function (key,w) {
                                        pic.addEventListener('click', ()=>{
                                            _this.showImageOnMask(key,w);
                                        } , true);
                                    })(key,w);
                                } catch (error) {
                                    var src = pic.src;
                                    (function (src) {
                                        pic.addEventListener('click', ()=>{
                                            _this.showImageWithSrc(src);
                                        } , true);
                                    })(src);
                                }
                            }
                        }
                    }, 1000);

                }).catch(err => {
                    this.wrap_error_handle(err, (err) => {
                        this.alert('网络异常');
                    });
                });
            },
            likeClick(event, objectId, commentId, receiver, index, type) {
                type = type || 'comment';
                if (this.hasClass(event, 'tm-m-comment-liked')) {
                    return this.cancelLike(event, index, {
                        objectId: commentId,
                        type: type
                    });
                }
                return this.addLike(event,index, {
                    objectId: commentId,
                    receiver: receiver,
                    type: type
                });
            },
            deleteClick(event, index) {
                // 保存被点击的对象位置，在confirm_callback中使用
                this.currentIndex = index;
                // 显示confirm弹窗
                this.confirmShow = true;
                this.currentEvent = event;

            },
            confirm_callback() {
                var index = this.currentIndex;
                this.finishComment(this.currentEvent);
                this.api('deleteByUser').send({
                    id: this.comment_arr[index].id
                }).then(res => {
                    if (res.error) {
                        throw new Error(res.error.err_msg || res.error);
                    }
                    // 结束confirm弹框
                    this.confirmShow = false;
                    // 记录删除操作的数组页码
                    this.deleteIndex = parseInt(index / this.pageSize);
                    // 保留删除页面之前的评论
                    this.$set('comment_arr', this.comment_arr.slice(0, this.deleteIndex * this.pageSize));
                    // 转换为翻页使用的页码
                    this.pageIndex = this.deleteIndex + 1;
                    // 删除评论的动画class，改为刷新，暂时不用了
                    //				this.deleted_arr[index] = true;
                    //				this.$set('deleted_arr[' + index + ']', true);
                    this.getComments();
                    //返回删除了一条评论回调
                    this.delete_comment();
                }).catch(err => {
                    this.wrap_error_handle(err, (err) => {
                        this.alert('网络异常');
                    });
                });
            },
            wrap_error_handle(err, fn) {
                err = err.message || err;
                err = err.err_msg || err;
                fn = fn || function() {};
                if (this.error_handle && typeof this.error_handle === 'function') {
                    this.error_handle(err);
                } else {
                    if (err === 'need_login') {
                        window.location.href = '/i/login?referrer=' + window.encodeURIComponent(location.pathname + location.search);
                    }

                    fn(err);
                }
            },
            commentClick(event, themeId, commentId, nickName) {
                var content;
                nickName = nickName || 'nickName';
                this.addClass(event, 'tm-m-comment-choose');
                content = !commentId || !nickName ? '冒个泡' : '回复' + nickName;
                content += '(5-500个字)...';
                this.comment_msg({
                    parentComment: {
                        themeId: themeId,
                        id: commentId,
                        nick_name: nickName
                    },
                    content: content,
                    comment: (content) => {
                        return this.doComment(event, themeId, commentId, content);
                    },
                    cancel: () => {
                        return this.finishComment(event);
                    }
                });
            },
            animationLike(event) {
                this.addClass(event, 'animation-like');
            },
            addLike(event,index,query) {
                this.api('praise').send(query).then(res => {
                    if (res.error) {
                        throw new Error(res.error.err_msg || res.error);
                    }
                    this.animationLike(event);//执行点赞动画
                    this.comment_arr[index].isPraise = !this.comment_arr[index].isPraise;//赞数变色
                    this.comment_arr[index].praiseNum ++;//赞数+1
                    // var likeCount = event.target.previousSibling.textContent;
                    // if (likeCount.indexOf('k') < 0 && parseInt(likeCount).toString() !== 'NaN') {
                    //     event.target.previousSibling.textContent = parseInt(likeCount) + 1;
                    //     this.addClass(event.target.previousSibling, 'tm-m-comment-liked');
                    // }
                }).catch(err => {
                    this.wrap_error_handle(err, (err) => {
                        this.alert('网络异常');
                    });
                });
            },
            cancelLike(event, index,query) {
                // this.removeClass(event, 'tm-m-comment-liked');
                this.removeClass(event, 'animation-like');
                this.api('cancelPraise').send(query).then(res => {
                    if (res.error) {
                        throw new Error(res.error.err_msg || res.error);
                    }
                    this.comment_arr[index].praiseNum --;//赞数-1
                    this.comment_arr[index].isPraise = !this.comment_arr[index].isPraise;//赞数变灰
                    // if (likeCount.indexOf('k') < 0 && parseInt(likeCount).toString() !== 'NaN') {
                        // event.target.previousSibling.textContent = parseInt(likeCount) - 1;
                        // this.removeClass(event.target.previousSibling, 'tm-m-comment-liked');
                    // }
                }).catch(err => {
                    this.wrap_error_handle(err, (err) => {
                        this.alert('网络异常');
                        console.log('取消点赞失败 err: ', err);
                    });
                });
            },
            doComment(event, objectId, commentId, content, type) {
                type = type || 'subject';
                this.finishComment(event);
                if (!content) return Promise.reject('回复不能为空');
                if (content.length < 5) return Promise.reject('回复长度不能小于5');
                if (content.length > 500) return Promise.reject('回复不能大于500');

                return this.api('commentSave').send({
                    objectId: objectId,
                    commentId: commentId,
                    type: type,
                    content: content
                }).then(res => {
                    if (res.error) {
                        throw new Error(res.error.err_msg || res.error);
                    }

                    this.refresh();

                    return res;
                }).catch(err => {
                    //					this.wrap_error_handle(err, function(err){
                    //						switch (err){
                    //							case '回复不能为空':
                    //							case '回复长度不能小于10':
                    //							case '回复不能大于500':
                    //								this.alert(err);
                    //								break;
                    //							default:
                    //								this.alert('网络异常');
                    //						}
                    //					});
                    // 评论的错误不处理
                    return Promise.reject(err);
                });
            },
            finishComment(event) {
                this.removeClass(event, 'tm-m-comment-choose');
            },
            addClass(event, name) {
                event = event.target || event;
                event.className += ' ' + name;
                return event;
            },
            hasClass(event, name) {
                var has = false;
                event = event.target || event;
                event.className.split(' ').forEach(item => {
                    if (item === name) has = true;
                });

                return has;
            },
            removeClass(event, name) {
                event = event.target || event;
                event.className = event.className.split(' ').filter(item => {
                    return item.trim() !== name.trim();
                }).join(' ');

                return event;
            },
            scroll(cb) {
                if (this.pageIndex >= this.totalPage) {
                    return cb(true);
                }
                this.pageIndex += 1;
                this.getComments();
            },
            alert(msg, sleep) {
                msg = msg || this.alertMsg;
                sleep = sleep || 1000;
                this.alertShow = true;
                setTimeout(() => {
                    this.alertShow = false;
                }, sleep);
            },
            refresh() {
                this.comment_arr = [];
                this.pageIndex = 1;
                this.getComments();
            },
            // 展示图片
            showImageOnMask(key,width){
               var path =  oss({ id: key ,w:width ,e: 2} );
               this.imgShow = false;//是否显示图片
                this.showImagePath = path;//展示的图片地址
            },
            showImageWithSrc(src){
                this.imgShow = false;//是否显示图片
                this.showImagePath = src;//展示的图片地址
            },
            //关闭图片展示
            closeImageShow(){
                this.imgShow=!this.imgShow;
                this.showImagePath='';
            },
            showAllComment(){
                this.isNewComment = false;
                this.comment_arr = [];
                this.getAllComments();
            },
            getAllComments(){
                this.api('listSubjectCommentDetail').send({
                    objectId: this.theme,
                    type: 'subject',
                    pageInfo: {
                        pageSize: this.pageSize,
                        pageIndex: this.pageIndex
                    }
                }).then(res => {
                    if (res.error) {
                        throw new Error(res.error.err_msg || res.error);
                    }
                    this.totalPage = res.result.pageInfo.totalPage || 1;
                    res.result.result = res.result.result || [];

                    //遍历冒泡数组，取出回复评论的引用，仅展示第一个dom元素，其余不展示
                    res.result.result.forEach((item,index) => {
                        //判断回复引用内容，取出第一个标签，作为引用内容显示
                        if(item.quoteCommentStatus === 'ok'){
                            var commentLabel = document.createElement('div');
                            commentLabel.innerHTML = item.quoteComment.content;
                            var label = document.createElement('div');
                            label.appendChild(commentLabel.firstChild) ;
                            item.quoteComment.content = label.innerHTML;
                        }

                        res.result.result[index] = item;
                    });

                    this.$set('comment_arr', this.comment_arr.concat(res.result.result));
                    var _this = this;
                    setTimeout(function() {
                        var labelArray = document.getElementsByClassName('tm-m-comment-single-content');

                        for (var index = 0; index < labelArray.length; index++) {
                            var element = labelArray[index];
                            var pics = element.getElementsByTagName('img');
                            for (var i = 0; i < pics.length; i++) {
                                var pic = pics[i];
                                try {
                                    var key = pic.attributes["data-key"].nodeValue;
                                    var w = pic.attributes["data-width"].nodeValue;
                                    (function (key,w) {
                                        pic.addEventListener('click', ()=>{
                                            _this.showImageOnMask(key,w);
                                        } , true);
                                    })(key,w);
                                } catch (error) {
                                    var src = pic.src;
                                    (function (src) {
                                        pic.addEventListener('click', ()=>{
                                            _this.showImageWithSrc(src);
                                        } , true);
                                    })(src);
                                }
                            }
                        }
                            var contentArea = document.getElementsByClassName('theme-comments')[0];
                            contentArea.parentElement.scrollTop = contentArea.offsetTop-50;
                    }, 1000);

                }).catch(err => {
                    this.wrap_error_handle(err, (err) => {
                        this.alert('网络异常');
                    });
                });
            },
            //解析跳转个人首页
            parseUserId2href(v) {
                let temporaryDom = document.createElement('div');
                temporaryDom.innerHTML = v;
                temporaryDom.className = 'temporaryDom';
                let allUserId = temporaryDom.querySelectorAll('[data-userid]');
                Array.prototype.slice.call(allUserId, 0).map((o, i) => {
                    // if(temporaryDom.hasAttribute("href")){
                    if(!o.hasAttribute("href")){
                        let userId = o.dataset.userid;
                        o.removeAttribute('onclick');
                        o.setAttribute('style', '-webkit-user-modify: read-only;vertical-align: baseline;color: #4ab7ed;display: inline;overflow: visible;text-align: left;margin-right: 1px;background: none;text-decoration: none;cursor: text;');
                        o.setAttribute('href', '/designer/perhome?userId=' + userId);
                    }
                });
                return temporaryDom.outerHTML;
            }
        },
        components: {
            avatar,
            scroll,
            confirm,
            alert,
            oss
        },
        filters: {
            floor(number) {
                switch (number) {
                    case 1:
                        return '沙发';
                    case 2:
                        return '板凳';
                    case 3:
                        return '地板';
                    default:
                        return number + '楼';
                }
            },
            get_time(str) {
                var recordTime = new Date(str);
                var now = new Date();
                var diffSeconds = parseInt((now - recordTime) / 1000, 10);

                //
                if (diffSeconds < 60 && diffSeconds >0) {
                    return diffSeconds + '秒前';
                } else if(diffSeconds <= 0){
                	return '1秒前';
                }else if (diffSeconds < 3600) { //分
                    return Math.floor(diffSeconds / 60) + '分钟前';
                } else if (diffSeconds < 86400) { //天
                    return Math.floor(diffSeconds / 3600) + '小时前';
                } else if (diffSeconds < 604800) { //周
                    return Math.floor(diffSeconds / 86400) + '天前';
                } else {
                    return `${recordTime.getFullYear()}/${recordTime.getMonth() + 1}/${recordTime.getDate()} ${recordTime.getHours()}:${recordTime.getMinutes()}`;
                }
            },
            format_zan_number(num) {
                num = parseInt(num) || 0;
                if (num >= 1000) {
                    num = parseInt(num / 1000);
                    num += 'k';
                }
                return num;
            }
        }
    });
</script>

<style type="text/css" src="./assets/iconfont.css"></style>
<style lang="less" src="./index.less"></style>

<style lang="less" scoped>
	.phoenix-mask {
        display: flex;
        align-items: center;
		width: 100%; 	
		height: 100%;
		position: fixed;	
		left:0;
		top:0;
		z-index: 9999;
		background:rgba(55,55,55,.6);	
		&.hide {
			display: none;
		}
		&.transparent {
			opacity: 0 !important;
		}
        img{
            margin: auto;
            max-width: 7rem;
        }
	}

    .showMoreComment{
        background: #f0f0f0;
        padding-top: .3rem;
        text-align: center;
        font-size: 0.3rem;
        span{
            border: 1px solid #ccc;
            font-size: .24rem;
            padding: 5px 10px;
            color: #666;
        }
    }

</style>`