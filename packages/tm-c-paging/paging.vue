<template>
	<div class="phoenix-paging" v-if="total > 1">
		<!-- 上一页 -->
		<div class="paging-list-item"
			 v-if="current > 3 && total > 5"
			 @click="jump( current - 1 )">&#60;</div>

		<!--  3,4,[5],6,7  -->
		<span v-if="current > 3 && total - current > 1">
			<!-- 1 -->
			<div class="paging-list-item"
				 @click="jump( current - 2 )">{{ current - 2 }}
			</div>
			<!-- 2 -->
			<div class="paging-list-item"
				 @click="jump( current - 1 )">{{ current - 1 }}
			</div>
			<!-- 3 -->
			<div class="paging-list-item active"
				 @click="jump( current )">{{ current }}
			</div>
			<!-- 4 -->
			<div class="paging-list-item"
				 @click="jump( current + 1 )">{{ current + 1 }}
			</div>
			<!-- 5 -->
			<div class="paging-list-item"
				 @click="jump( current + 2 )">{{ current + 2 }}
			</div>
		</span>
		<span v-else>
			<span v-if="current < 5">
				<div v-for="i in total >= 5 ? 5 : total"
					 class="paging-list-item"
					 :class="{ active : current === ($index + 1) }"
					 @click="jump( i + 1 )">
					{{ i + 1 }}
				</div>
			</span>
			<span v-else>
				<div v-for="i in five"
					 class="paging-list-item"
					 :class="{ active : current === (total - 5 + i + 1) }"
					 @click="jump( total - 5 + i + 1 )">
					{{ total - 5 + i + 1 }}
				</div>
			</span>
		</span>

		<div v-if="total - current > 3 && total > 5"
			 class="paging-list-item">
			...
		</div>

		<div class="paging-list-item"
			 v-if="total - current > 3 && total > 5"
			 @click="jump( total )">{{ total }}
		</div>

		<!-- 下一页 -->
		<div class="paging-list-item"
			 v-if="total - current > 2 && total > 5"
			 @click="jump( current + 1 )">&#62;</div>

		<div class="other">
			<span>共<b class="bold">{{ total }}</b>页</span>
			<span class="ml20" v-if="total >= 5">到第&nbsp;
				<input class="goto" type="number" min="1" :max="total" v-model="gotoPn" @keyup.enter="jump( gotoPn )"/>&nbsp;页
			</span>
		</div>
	</div>
</template>
<script>

	import Parser from './Parser';

	export default {
		name: 'paging',
		props: {
			total: {
				type: Number,
				default: 1
			}
		},
		data (){
			return {
				pageName: 1,
				current: 1,
				gotoPn: 1,
				five: 5,
				url: {
					host: '',
					protocol: '',
					pathname: '',
					name: '',
					pageIndex: '',
					search: '',
					postfix: ''
				}
			};
		},
		watch: {
			'$route'(){
				this.parseUrl();
			}
		},
		methods: {
			jump ( n ){
				n = 0 | n;
				//当前页面不触发
				if ( this.current === n || n > this.total || n < 1 ) return;
				this.current = n;

				this.url.jump( n );
			},
			parseUrl(){
				this.url = new Parser( window.location.href );

				let pn = 0 || this.url._pageNum;

				if ( pn === 0 ) pn = 1;

				if ( pn > 0 ) {
					this.current = pn;
					this.$nextTick( () => {
						this.$dispatch( 'onPageJump', this.current );
					} );
				}
			}
		},
		created (){
			this.parseUrl();
		},
		ready (){
			this.$on( 'page-reset', function() {
				setTimeout(() => {
					this.jump( 1 );
				})
			} );
		}
	};
</script>
<style lang="less" rel="stylesheet/less" scoped>
	.phoenix-paging {
		display: inline-block;
		font-size: 12px;
		line-height: 34px;
	}

	.paging-list-item {
		width: 32px;
		height: 32px;
		line-height: 32px;
		font-size: 14px;
		margin: 0 5px;
		float: left;
		background-color: #fff;
		color: #999;
		list-style: none;
		text-align: center;
		cursor: pointer;
		border-radius: 4px;

		&.active {
			background-color: #0074ff !important;
			color: #fff !important;
		}

		&:hover {
			background-color: #f0f0f0;
			color: #666;
		}

	}

	.other {
		color: #ccc;
		float: left;

		.submit {
			border: 1px solid #ccc;
			padding: 5px 10px;
			background: transparent;
			border-radius: 2px;
		}

		.goto {
			width: 50px;
			height: 32px;
			border: 1px solid #ddd;
			border-radius: 4px;
			text-align: center;
		}

		.bold {
			font-weight: bold;
			font-size: 14px;
			color: #999;
			vertical-align: middle;
			padding: 0 2px;
		}

		.ml20 {
			margin-left: 20px;
		}

	}

</style>