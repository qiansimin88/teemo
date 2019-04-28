## 使用方式

```
	<tm-m-datepicker 
		:show.sync="show"
		:selected.sync="current"
		format="YYYY-MM-DD">
	</tm-m-datepicker>

	import tmMDatepicker from 'tm-m-datepicker';

	export default {
		name: 'vue-page',
		data() {
			current: '2014-3-23',
			show: false
		},
		components: { tmMPicker }
	};

	props: 
		selected: String, datepicker显示时初始化的时间，而datepicker每次修改且确定后，该值同步更新
		show: Boolean, 是否显示
		format: String, selected值由此来格式化
			如：YYYY/MM/DD ---> 2014/03/21; YYYY/M/D ---> 2014/3/5; ( 分隔符支持：'/', '-', ':' )
```