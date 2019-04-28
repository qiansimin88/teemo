# tm-c-error

## 使用

### main.js

因为依赖关系，请务必保证 vue、phonenix、tm-t-error的加载顺序；
 
```
import Vue from 'vue';
import Phoenix from 'phoenix';
import error from 'tm-c-error';

// 此处的handle应该是一个funciton，在捕获到错误之后将会调用此方法

Vue.use( error, /* handle */ function(){} , /* options */ {} );

```

### 用法

使用了此组件之后，this.api会添加一个peace方法，调用peace方法的所有调用都会自动捕获错误；

```
<script>
	import Phoenix from 'phoenix';
	
	export default Phoenix.createView({
		data(){
			return {};
		},
		methods: {
			getList(){
				this.api('list').peace({}).then(result => {
					/*
					* result: {
					* 	errCode: '',
					* 	errMsg: '',
					*	result: null,
					*	success: true	
					*	pageInfo: { ... }	
					* }
					* 
					* */
				});
			}
		}
	});
	
</script>
```

## 参数

### handle

在捕获到错误的时候将执行此方法；  
值得注意的是：

* err - `String`: 捕获到的错误信息

* tools - `Object`: 下面有一些方法，便于大家处理错误( 当然你也可以不用 :-) )；tools的具体信息请看[这里](#tools)；

```
export default function ( err, tools ) {
	switch ( err ){
		case 'need_login':
			// goLogin不是一个Promise对象，组件会判断返回值
			// 如果返回值不是Promise对象，组件会返回伪Promise对象保证后续的调用不被执行也不会出错；
			// 伪Promise: {then: function(cb){ return this; }, catch: function(cb){return this}} 
			return tools.goLogin();
			break;
		default:
			tools.showToast('夭寿啦，出错了，快截图发给子良').then(() => {
				console.log('err: ', err);
			});
	}
}
```

### options

这是一个可选参数，可以不传

* methods

> Object

methods下的方法将会被挂载到 tools下;

## tools

> <span id="tools"><span>

### goLogin

> function

跳转登录

### showToast

> function - Promise.   

> 参数

 * toastMsg - `String`: 必须 | toast提示的信息，如果没有传入此参数，将会被忽略并调用Promise.resolve()以保证后续正常执行.  
 *  duration - `Number`: 可选 | 持续时间(单位: ms)，默认 1500. 

> 依赖

tm-c-error会在Vue.use的时候自动在全局注册一个error组件，用户必须自行引用此组件; 需要在页面级components或index.html中添加以下代码
 
```
<error></error> 
```

toast提示框

