<template>
	<div class="tm-a-table">
		<table>
			<thead>
				<tr>
					<th v-for="v in cols">
						<input v-if="v === 'check'" type="checkbox" v-model="allSelected">
						<span v-else>{{ v }}</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in rows">
					<td v-for="v in row">
						<input v-if="v.type === 'check'" type="checkbox" v-model="v.value">
						<img   v-if="v.type === 'img'" :src="v.value">
						<span  v-if="v.type === 'text'" :style="{ color: v.color }">{{ v.value }}</span>
						<span  v-if="v.type === 'html'" v-html="v.value"></span>
						<span  v-if="v.type === 'datetime'">{{ v.value | timestamp }}</span>
						<span  v-if="v.type === 'btns'">
							<!-- 每行的btn上的事件，传入当前行的数据(原始数据&mapping后的数据) -->
							<button v-for="_v in v.value" @click="_v.onclick( row )">{{ _v.label }}</button>
						</span>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="table-footer">
			<div class="batch-action" v-if="batchBtns">
				<label><input type="checkbox" v-model="allSelected">全选</label>
				<span class="action-btns">
					<button v-for="v in batchBtns" @click="batchInvoke( v.onclick )">{{ v.label }}</button>
				</span>
			</div>
			<div class="paging-wrap" v-if="pageable">
				<paging :total="totalPage"></paging>
			</div>
		</div>
	</div>
</template>
<script>
	// row example 将每一行的数据，以列为单位转换成(数据类型和值)的结构的数组
	// [
	// 	{ type: 'img', value: 'http://test-img.3dker.cn/12593957e2f429d11ad76fc8645f727b' },
	// 	{ type: 'text', value: '透明光敏树脂' },
	// 	{ type: 'html', value: '135987562251</br>我是一只大啊西瓜' },
	// 	{ type: 'text', value: '金属' },
	// 	{ type: 'text', value: '1' },
	// 	{ type: 'text', value: (v => { if ( v === 1 ) return '已通过'; })(1), style: { color: 'green' } },
	// 	{ type: 'datetime', value: 1482372616073 },
	// 	{ 
	// 		type: 'btns', 
	// 		value: [{ label: '编辑', onlick: () => console.log('编辑') },
	// 				{ label: '删除', onlick: () => console.log('删除') }] 
	// 	}
	// ],
	
	import Phoenix from 'phoenix';
	import paging from 'phoenixUI/paging';
	import { timestamp } from './utils';

	export default Phoenix.createView({
		name: "tmATable",
		props: {
			cols: {
				type: Array,
				default: []
			},
			url: {
				type: String,
				required: true
			},
			param: {
				type: Array,
				default: []
			},
			// 因为param中的pageInfo不确定是第几个参数，
			// 所在这里的pageIndex同步父级的pageIndex
			// 而param中的pageInfo中的pageIndex依赖于
			// 父级的pageIndex
			pageIndex: {
				type: Number,
				twoWay: true,
				default: 1
			},
			pageSize: {
				type: Number,
				default: 20
			},
			// 是否默认记载首页数据
			inited: {
				type: Boolean,
				default: true
			},
			pageable: {
				type: Boolean,
				default: true
			},
			// API获取的数据，都将通过这个map方法，转化成
			// rows中的数据集
			mapping: {
				type: Function,
				required: true
			},
			batchBtns: {
				type: Array,
				default: null
			}
		},
		data() {
			return {
				rows: [],
				totalPage: 1,
				allSelected: false
			};
		},
		created() {
			// 如果没有分页, 则直接获取数据
			// 如果是分页，paging 组件会自动获取第一页
			this.pageable || this.fetchPage();
		},
		computed: {
			allSelected: {
				set( v ) {
					this.rows.forEach( _v => ( _v[0].value = v ) );
				},
				get() {
					if ( this.rows.length === 0 ) return false;
					return this.rows.filter( v => v[0].value ).length === this.rows.length;
				}
			}
		},
		events: {
			onPagingJump( v ) {
				this.pageIndex = v;
				this.$nextTick( this.fetchPage );
			},
			'table-dataset-refresh'( pageIndex ) {
				// 如果没有分页，或者分页了，但是为第一页，则直接获取数据
				// paging组件中paging-reset事件是跳到第一页，
				// 而组件中当前页跳转时，不jumpPage
				if ( pageIndex ) {
					if ( ( this.pageIndex = pageIndex ) === 1 ) {
						// nextTick FOR pageIndex数据更新到param中
						this.$nextTick( this.fetchPage );
					} else {
						this.$broadcast( 'paging-reset', this.pageIndex );
					}
				} else {
					this.$nextTick( this.fetchPage );
				}
			}
		},
		filters: { timestamp },
		components: { paging },
		methods: {
			fetchPage() {
				// 不自动加载首页数据，
				if ( !this.inited ) {
					this.inited = true;
					return;
				}
				
				let http = this.api( this.url );

				http.post
					.apply( http, this.param )
					.then( (err, data) => {
						if ( err ) return console.log(err);
						
						// 获取包含数据的result & totalPage
						while( data && ( data.pageInfo || data.result ) ) {
							data.pageInfo && ( this.totalPage = data.pageInfo.totalPage );
							data = data.result;
						}

						if ( data && data.length > 0 ) {
							this.rows = data.map( v => {
								// 将原来的 v 值绑定在该table ceil数组上, 
								// 便于针对单个或批量操作
								let ret = this.mapping( v );
								ret.value = v; 
								return ret;
							})
							.filter( v => v.length > 0 ); //过滤空数据
						} else {
							this.rows = [];
						}
					});
			},
			batchInvoke( action ) {
				action( this.rows.filter( v => v[0].value ) );
			}
		}
	});
</script>
<style lang="less">
	.tm-a-table {
		table {
			width: 100%;

			thead tr { height: 40px; background-color: #f0f0f0; }
			th, td { vertical-align: middle; text-align: left; }
			th:first-child { padding-left: 15px; }
			td:first-child { padding: 15px 0 15px 15px; }
			tbody tr {
				&:nth-child(2n) { background-color: #f9f9fA; }
				&:hover { background-color: #fff9ee; }
			}
			img { height: 50px; width: 50px; }
		}

		.table-footer {
			padding: 15px; input { margin-right: 10px; } button { margin: 0 5px; }

			.batch-action { display: inline-block; margin-top: 5px; }
			.paging-wrap { float: right; .phoenix-paging { line-height: 0; } }
		}

		button {
			border: 1px solid #d5d5d5; background-color: #f5f5f5; 
			padding: 2px 15px; margin-right: 5px; outline: none;
			&:hover { background-color: #e5e5e5; }
		}

		input[type="checkbox"] { appearance: checkbox; vertical-align: baseline; }
	}
</style>