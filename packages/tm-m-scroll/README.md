## 使用方式

```
	<scroll-page 
		:show="show"
		:paging="getPage" >
		<div v-for=" v in list ">
			...
		</div>
	</scroll-page>

	==================== 版本( 1.x.x ) ======================

	props: 
		// 请求地址
		url: { 
			type: String,
			required: true,
		},
		// 又父级的computed得出 且其中包括pageInfo
		param: {
			type: Array,
			default() {
				return [];
			}
		},
		// pageIndex与param看似重复，因为后端接口中不确定pageInfo 的位置，
		// 所以有父级确定到param中, 而这里的pageIndex为了父子组件中数据的同步
		pageIndex: {
			type: Number,
			default: 1,
			twoWay: true
		},
		// 是否组件加载后就立即请求数据, 如果请求数据的参数依赖于其他接口, 则这里设置false
		inited: {
			type: Boolean,
			default: true
		},
		// 请求返回的结果会传入该方法，由父级处理结果
		collector: {
			type: Function,
			default: () => {}
		}

	events:
		// 重置到第一页
		'tm-m-paging-reset'() {}

	说明：'#tm-m-paging-target' 自定义滑页Div， 如：<div id="tm-m-paging-target"></div>

	==================== 版本( 1.x.x ) ======================

	==================== 版本( 0.0.x ) ======================

	import scrollPage from 'tm-m-scroll';

	export default {
		name: 'vue-page',
		data() {
			list: []
		},
		components: { scrollPage },
		ready() {
			// 自定义滑页区域
			this.$nextTick( () => { 
				this.$broadcast( 'bind-scroll-target', element ) 
			});

			// 页面加载时，调用组件分页查询，（ 如果自己this.getPage()分页查询，则没有Loading显示 ）
			// 页面滑动时，组件会自动分页查询
			this.$broadcast('paging');
		},
		methods: {
			getPage( callback ) {
				this.api()...

				if ( 没有数据了 ) {
					callback(true);
				} else {
					callback();
				}
			}
		}
	};

	设置滑页的区域
		默认： 该组件所在的DOM区域，需设置其父级高度样式
		自定义：this.$broadcast( 'bind-scroll-target', this.$els.page )
	props: 
		paging: 分页获取数据函数
		show: 是否显示

	==================== 版本( 0.0.x ) ======================
```