## 使用方式

```
	<tm-m-switch 
		:value.sync="value"
		:hook="change" >
	</tm-m-switch>

	import tmMSwitch from 'tm-m-switch';

	export default {
		name: 'vue-page',
		data() {
			return {
				value: false
			}
		},
		components: { tmMSwitch },
		methods: {
			change( v ) {
				// v 为当前切换到的值
				console.log(v)；
			}
		}
	};

	props: 
		value: 当前切换值
		hook: 切换时回调方法
```