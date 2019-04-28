### tm-m-comment

#### 使用规则

1. 设置属性
	
// 用户触发评论之后的回调函数
comment_msg： {
    type: Function,
    required: true
},
// 主题的id
theme: {
    type: [String, Number],
    required: true
},
// 默认头像的地址，绝对路径
default_avatar: {
    type: String,
    required: true
}

2. 处理comment_msg返回的对象
	msg: {
		parentComment: {
			themeId: 主题id,
			id: 父级评论id,
			nick_name: 父级评论所有者的用户名,
		},
		content: 需要展示给用户的提示,
		comment: Funtion | 回复。把回复的内容传进来就可以了,
		cancel: Funtion | 取消回复
}

#### 使用示例

```
<template>
	<div style="heigth: 875px;">
		<mcomment :comment_msg="comment_msg" theme="1" default_avatar="/statics/img/default_avatar.png"></mcomment>
	</div>
</template>

<script>
	import Phoenix from 'phoenix';
	import mcomment from 'teemo/tm-m-comment';

	export default Phoenix.createView({
		data (){
			return {
			};
		},
		ready (){
			this.$broadcast('bind-scroll-target', this.$el);
		},
		methods: {
			comment_msg(msg){
				msg.comment('评论改为泡泡，盈缺思婷').then(res => {  
					console.log('res: ', res);
				}).catch(err => {
					console.log('err: ', err);
				});
			}
		},
		components : {mcomment}
	});
</script>

<style>

</style>
```