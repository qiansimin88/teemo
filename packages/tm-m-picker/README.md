## 使用方式

```
	<tm-m-picker 
		:show.sync="show"
		:value="[1, 2, 3, 4] OR {1: '1', 2: '2', 3: '3'}"
		:selected.sync="current">
	</tm-m-picker>

	import tmMPicker from 'tm-m-picker';

	export default {
		name: 'vue-page',
		data() {
			current: '',
			show: false
		},
		ready() {
			this.$nextTick( this.getVals );
		},
		components: { tmMPicker }
		methods: {
			getVals() {
				this.api('')
					.post()
					.then( (err, data) => {
						this.$broadcast( 'tm-picker-value-changed', value );
					});
			}
		}
	};

	同步传值：
		<tm-m-picker :value="value"></tm-m-picker>
	异步传值：
		this.api('')
			.post()
			.then( (err, data) => {
				this.$broadcast( 'tm-picker-value-changed', value );
			});
	props: 
		value 为数组或对象
		selected 数组下标或对象Key值
		show: 是否显示
```