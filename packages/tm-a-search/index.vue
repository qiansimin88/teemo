<template>
	<div class="tm-a-search-panel">
		<div :class="`input-${v.type}`"
			 v-for=" v in value " >
			<span>{{ v.left }}</span>
			<input type="text" v-if="v.type === 'text'" v-model="v.value">
			<select v-if="v.type === 'select'" v-model="v.value">
				<option 
					v-for=" ( _i, _v ) in v.option "
					:value="_i" >
					{{ _v }}
				</option>
			</select>
			<datepicker 
				style="width: 170px"
				v-if="v.type === 'date'"
				:range="true" 
				:start-time.sync="v.start"
				:end-time.sync="v.end">
			</datepicker>
			<span>{{ v.right }}</span>
		</div>
		<button @click="search">搜索</button>
	</div>
</template>
<script>
	// searchValues: 
	// 	[
	// 		{ type: 'text', left: '文章标题', right: '*支持模糊查询', value: '' },
	// 		{ type: 'select', left: '文章分类', option: [ '全部', '金属', '工程塑料', '通用塑料', 'Visijet', '光敏树脂' ], value: '0' },
	// 		{ type: 'date', left: '修改时间', start: '', end: '' }
	// 	]

	import datepicker from 'phoenixUI/datepicker';

	export default {
		name: 'searchPanel',
		props: {
			value: {
				type: Array,
				default() {
					return [];
				}
			},
			search: {
				type: Function,
				default: () => {}
			}
		},
		components: { datepicker }
	};
</script>
<style lang="less">
	.tm-a-search-panel {
		background-color: #f0f0f0; font-size: 13px;
		margin-bottom: 10px; padding: 10px 15px 0 15px; border-radius: 2px;
		display: flex; flex-wrap: wrap;

		> div { 
			display: flex; align-items: center; flex: 0 0 50%; margin-bottom: 10px; 

			&:last-of-type { flex: 0 0 auto; margin-right: 10px; }

			span:first-child { margin-right: 10px; width: 80px; }
			span:last-child { margin-left: 10px; }
		}

		input[type="text"], select { padding: 6px 12px; outline: none; }

		input, select { border: 1px solid #ccc; border-radius: 3px; }

		input[type="checkbox"] { appearance: checkbox; }
		input[type="radio"] { appearance: radio; }
		select { appearance: '' }

		button { 
			border: 1px solid #d5d5d5; background-color: #f5f5f5; 
			padding: 2px 15px; margin-bottom: 10px; outline: none;
			&:hover { background-color: #e5e5e5; }
		}
	}
</style>