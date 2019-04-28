<template>
	<div class="tm-m-paging-wrapper" v-show="show">
		<slot></slot><!-- slot page-list -->
		<div class="tm-m-paging-status" v-el:status>
			<div class="tm-m-paging-loading"
				:style="{ opacity: loadingOpacity }">
				<div class="triple-bounce triple-bounce-1"></div>
				<div class="triple-bounce triple-bounce-2"></div>
				<div class="triple-bounce triple-bounce-3"></div>
			</div>
			<div class="tm-m-paging-nothing" v-show="nothingVisible">到底了</div>
		</div>
	</div>
</template>
<script>
	import Api from 'phoenix/dist/core/gateway';

	let targetEl, http;

	export default {
		name: 'scrollPage',
		data() {
			return {
				show: true,

				loadingOpacity: 0,
				nothingVisible: false,
				stopPaging: false,

				scrolling: false,

				fetching: false
			};
		},
		props: {
			url: {
				type: String,
				required: true,
			},
			// 又父级的computed得出
			// 且其中包括pageInfo
			param: {
				type: Array,
				default() {
					return [];
				}
			},
			// pageIndex与param看似重复，
			// 因为后端接口中不确定pageInfo
			// 的位置，所以有父级确定到param中
			// 而这里的pageIndex为了父子组件中
			// 数据的同步
			pageIndex: {
				type: Number,
				default: 1,
				twoWay: true
			},
			// 是否组件加载后就立即请求数据
			// 如果请求数据的参数依赖于其他接口
			// 则这里设置false
			inited: {
				type: Boolean,
				default: true
			},
			collector: {
				type: Function,
				default: () => {}
			}
		},
		created() {
			http = new Api( this.url );

			// 默认加载第一页
			this.inited && this.getPage();
		},
		ready() {
			this.$nextTick(() => {
				targetEl = document.getElementById('tm-m-paging-target') || this.$el;
				targetEl.addEventListener( 'scroll',  this.scrollEvent );
			});
		},
		beforeDestroy() {
			targetEl && targetEl.removeEventListener( 'scroll', this.scrollEvent );
		},
		events: {
			'tm-m-paging-reset'() {
				targetEl.scrollTop = 0;

				this.pageIndex = 1;
				this.show = true;
				this.stopPaging = false;

				// 等pageIndex同步到父级后再请求数据，
				// 这样pageIndex才能写到param中
				this.$nextTick( this.getPage );
			}
		},
		methods: {
			scrollEvent: (function() {
				let timer = null;

				return function( e ) {
					if ( timer ) return;

					timer = setTimeout(() => {
						timer = null;

						let containerRect = targetEl.getBoundingClientRect();
						let statusRect = this.$els.status.getBoundingClientRect();

						this.scrolling = true;

						( statusRect.bottom - containerRect.bottom ) < 2 && this.getPage();
					}, 500);
				};
			})(),
			getPage() {
                if ( this.fetching || this.stopPaging ) return;

                this.fetching = true;

				this.loadingOpacity = 1;
				this.nothingVisible = false;

				http.post
					.apply( http, this.param )
					.then( (err, data) => {
						this.loadingOpacity = 0;

						this.fetching = false;

						if ( err ) return console.log(err);

						let pageInfo;

						// 获取包含数据的result & totalPage
						while( data && ( data.pageInfo || data.result ) ) {
							data.pageInfo && ( pageInfo = data.pageInfo );
							data = data.result;
						}

						// 第一页就没有拉取到任何数据，就隐藏paging组件
						this.show = this.pageIndex !== 1 || (data && data.length > 0);

						// 最后一页，不再拉取
						this.stopPaging = this.pageIndex >= pageInfo.totalPage;
						this.nothingVisible = this.stopPaging && this.scrolling;

						// 父级去收集请求返回到数据
						// 这里data若无null，则统一为[] 
						this.collector( data || [] );

						this.pageIndex++;
					});
			}
		}
	};
</script>
<style lang="less">
	// 自定义需要滑动的div
	#tm-m-paging-target {
		height: 100%; overflow: scroll;
		-webkit-overflow-scrolling:touch;
	}
	.tm-m-paging {
		&-wrapper {
			height: 100%; overflow: scroll;
			-webkit-overflow-scrolling:touch;
		}

		&-status { 
			position: relative; height: 0.6rem;
			> div {
				position: absolute; top: 0; bottom: 0; 
				width: 100%; line-height: 0.6rem;
				background: transparent;
			}
		}

		&-loading { 
			display: flex; justify-content: center;

			.triple-bounce {
				animation: bounce-animation 1.4s infinite ease-in-out both;
				height: 0.2rem; width: 0.2rem; border-radius: 100%;
				background-color: #4ab7ed;
				margin: auto 0.1rem;

			}
			.triple-bounce-1 { animation-delay: -0.32s; }
			.triple-bounce-2 { animation-delay: -0.16s; }

			@keyframes bounce-animation {
				0%, 80%, 100% { transform: scale(0); } 
				40% { transform: scale(1); }
			}
		}

		&-nothing {
			text-align: center; font-size: 0.3rem; 
			color: #ccc;
		}
	}
</style>