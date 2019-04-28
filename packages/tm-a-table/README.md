## 使用方式

```
    <tm-a-table
        :cols="cols"
        :url="url",
        :param="[ param, { pageIndex: pageIndex, pageSize: pageSize } ]",
        :page-index.sync="pageIndex"
        :mapping="mapping"
        :batch-btns="batchBtns">
    </tm-a-table>

	import tmATable from 'teemo/tm-a-table';

	export default {
		name: 'vue-page',
		data() {
			return {
				url: 'materialQuery',
				param: { name: '', classifyId: '' },
				pageIndex: 1,
				pageSize: 20,

                cols: [ 'check', '材料分类', '材料名称', '唯一名', '价格', '密度', '状态', '创建时间', '操作' ],

                batchBtns: [
					{ label: '批量禁用', onclick: this.batchSwitchStatus('disable') },
					{ label: '批量启用', onclick: this.batchSwitchStatus('enable') },
					{ label: '批量删除', onclick: this.remove }
				]
			}
		},
		components: { tmATable },
		methods: {
            mapping( v ) {
                // row example 将请求获取的每一行数据，以列为单位转换成(数据类型和值)的结构的数组
                // 即一行单元格组成的数组

                // 如果想忽略掉当前这条数据，则直接 return [];
                return [
                    { type: 'check', value: false }, // checkbox
                    { type: 'img', value: 'http://test-img.3dker.cn/12593957e2f429d11ad76fc8645f727b' },
                    { type: 'text', value: '透明光敏树脂' },
                    { type: 'html', value: '135987562251</br>我是一只大啊西瓜' },
                    { type: 'text', value: '1' },
                    { type: 'text', value: (v => { if ( v === 1 ) return '已通过'; })(1), color: 'green' },
                    { type: 'datetime', value: 1482372616073 },
                    { 
                    	type: 'btns', 
                    	value: [{ label: '编辑', onlick: () => console.log('编辑') },
                    			{ label: '删除', onlick: () => console.log('删除') }] 
                    }
                ],
            }
		}
	};

	props: 
		cols: Array, 表格的列名
		url: String, 表格中数据请求接口的URL
        param: Array, 表格中数据请求接口中传递的参数, 就是this.api(url).post()中的参数
        pageIndex.sync: Number, 分页查询的pageIndex，此变量在父组件缓存, 
        mapping: Function, 请求后的数据, 都将通过该方法，转化成表格中的数据.(使用方式Demo)
        batch-btns: Array, 表格下方的批处理btns，参数格式如Demo，
        pageable: Boolean, 表格是否需要分页查询,
        inited: Boolean, 表示是否在页面加载时拉去第一页数据，由于PhoenixUI中paging组件的使用方式，默认是拉去第一数据
                         如：用户可能需要先拉去一些参数数据，再拉去本页数据，就可以设施其为false, 
                            然后在使用 this.$broadcast('table-dataset-refresh', 1 /* 不分页则不传 */);

    events: 
        table-dataset-refresh: 请求当前页数据
            如: this.$broadcast('table-dataset-refresh', 1 /* 不分页则不传 */);


    说明:
        表格中单行操作btn, 和表格下方批量操作btn, 绑定的 click Function 中的参数
        是： mapping 方法返回的值(该值为数组), 同时将请求返回的该行元数据绑定在返回值得value值上
        如： let ret = [ ceil1, ceil2, ceil3 ]; ret.value = v; 

        单行操作的btn中的参数(当前行)是: ret, 批量操作的btn中的参数(选中的数组)是: [ ret ]

        请求如果是自己在server中wrap的，则需要保留其中的 result.pageInfo
```