## 使用方式

```
	<tm-m-select 
		:value="[], {}"
		:selected.sync="selectedVal"
		placeholder="placeholder"
		:style="{ width: '200px' }" >
	</tm-m-select>

	import tmTSwitch from 'tm-t-select';

	export default {
		name: 'vue-page',
		data() {
			return {
				value: false
			}
		},
		ready() {
			this.$nextTick( this.getVals );
		},
		components: { tmTSwitch },
		methods: {
			getVals() {
				this.api()
					.post()
					.then( (err, data) => {
						// 异步获取选项后， 通过Vue事件选项值
						this.$broadcast( 'tm-select-value-changed', vals );
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
				this.$broadcast( 'tm-select-value-changed', value );
			});

	props: 
		value: 数组或对象
		label: String, 
				如果数组里的值为对象，设置显示的key值
				如：[ { k1: 'v1', k2: 'v2', k3: v3 } ]
					label设置为k1, 则显示v1值

				如果对象中的val值为对象，设置方式如数据
				如： { 1: { k1: 'v1', k2: 'v2', k3: v3 } }
		selected: 当前选中项的下标（数组），或key值（对象）
		placeholder: 未选中任何项时的提示, 默认：请选择...
		style: Object， 改组件点击区的样式, 默认： 200px
```