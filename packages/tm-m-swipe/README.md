## 使用方式

```
	<tm-m-swipe 
		height="4rem" >
	</tm-m-swipe>

	import tmMSwipe from 'tm-m-swipe';

	export default {
		name: 'vue-page',
		components: { tmMSwipe },
		ready() {
			this.$nextTick( this.getImgs );
		},
		methods: {
			getImgs() {
				this.api()
					.post()
					.then( (err, data) => {
						// 异步获取图片后， 通过Vue事件传递滑动展示的图片数组
						this.$broadcast( 'tm-m-swipe-value-changed', imgs );
					});
			}
		}
	};

	props: 
		height: 图片展示的高度，
```