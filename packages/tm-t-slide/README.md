## 使用方式

```
	<tm-m-slide 
		:height="height"
		:width="width" >
	</tm-m-slide>

	import tmMSlide from 'tm-m-slide';

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
						this.$broadcast( 'tm-t-slide-value-changed', imgs );
					});
			}
		}
	};

	props: 
		height: Number, 图片展示的高度，
		width: Number, 图片展示的宽度，
```