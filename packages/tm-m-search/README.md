## 使用方式

```
	<tm-m-search 
		:placeholder="placeholder"
		:search-fn="search"
		:keywords.sync="keywords" >
	</tm-m-search>

	import tmMSearch from 'tm-m-search';

	export default {
		name: 'vue-page',
		data() {
			placeholder: '',
			keywords: ''
		},
		components: { tmMSearch },
		ready() {
		},
		methods: {
			search( ) {
				this.api()...
			}
		}
	};

	props: 
		placeholder: 输入提示
		search-fn: 输入关键之后，点击回车，则使用该方法获取数据
		keywords: 查询关键字（即输入框输入值）
```