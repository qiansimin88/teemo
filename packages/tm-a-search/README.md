## 使用方式

```
    <tm-a-search :value="searchVals" :search="search"></tm-a-search>


	import tmASearch from 'teemo/tm-a-search';

	export default {
		name: 'vue-page',
		data() {
			return {
                searchVals: [
					{ type: 'text', left: '账号', right: '*支持模糊查询', value: '' },
					{ type: 'text', left: '物流单号', right: '*支持模糊查询', value: '' },
                    { type: 'select', left: '文章分类', option: [ '全部', '金属', '工程塑料', '通用塑料', 'Visijet', '光敏树脂' ], value: '0' },
					{ type: 'date', left: '申请时间', startTime: '', endTime: '' }
				],
			}
		},
		components: { tmASearch },
		methods: {
            search() {
                ...
            }
		}
	};
    
    option: 数组或对象
```