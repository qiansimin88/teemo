<!--
    tab组件  调用方法<tab tabs="[{name:'tabname',cb:function()},{name:'tabname',cb:function()}]"></tab>
 -->
<template>
	<div  class="tab-warp">
		<div v-for="tab in tabs" style="display:flex; justify-content:center; align-items:center;flex:1">
			<div  :class="['tab',{'tab-focus':index===$index}]" @click="click($index)" v-link="tab.link">
				{{tab.name}}
			</div>
			<div v-if="$index+1 !== this.tabs.length" class="tab-split">
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
	.tab-warp{
		font-size: .24rem;
		display: flex;
		flex-flow: row wrap;
		width:100%;
		height:0.9rem;
		border-bottom: 0.5px solid #e4e4e4;
		justify-content: center;
		align-items: center;
	}
	.tab{
		padding:0 0.1rem 0 0.1rem;
		line-height:.9rem;
		text-align: center;
		padding: 0;
		// margin: 0 2em 0 2em;
		width: 100%;
	&-focus{
		 color:rgb(74, 183, 237);
		 border-bottom: 2px solid rgb(74, 183, 237);
	 }
	&-split{
		 background-color: #e4e4e4;
		 width: 1px;
		 border: none;
		 height: .4rem;
	 // margin-top: .25rem
	 }
	}
</style>
<script>

	import Phoenix from 'phoenix';
	export default Phoenix.createView({
		name: 'tab',
		props: {
			tabs:{
				type:Array,
				default: function () { return []; }
			},
			index: {
				type: Number,
				twoWay: true,
				default: 0
			}
		},
		data(){
			return {
			};
		},
		ready() {
		},
		methods: {
			click(index){
				// console.log(this.tabs);
				let v = this.tabs[index];
				this.index = index;
				if(v && v.name && v.cb && typeof v.cb === 'function'){
					v.cb();
				}
			}
		},
		filters: {
			string(str){
				return JSON.stringify(str);
			}
		}
	});
</script>