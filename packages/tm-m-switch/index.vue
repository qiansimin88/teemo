<template>
	<div class="switch-circel-btn" 
		 :ubt="value ? ubt.close : ubt.open" 
		 :class="{ active: value }" 
		 @click="change">
		<div class="fan-shaped left"></div>
		<div class="fan-shaped right"></div>
		<div class="circle"></div>
	</div>
</template>
<script>
	export default {
		name: 'tm-m-switch',
		props: {
			value: {
				type: Boolean,
				default: false,
				twoWay: true
			},
			hook: {
				type: Function,
				default: null
			},
			ubt:{
				type:Object,
				default:function(){
					return {};
				}
			}
		},
		methods: {
			change() {
				this.value = !this.value;
				this.hook && this.hook( this.value );
			}
		}
	};
</script>
<style lang="less" scoped>
	.switch-circel-btn {
		display: flex; position: relative;
		> div { border: 1px solid #dfdfdf; }
		.fan-shaped { 
			height: 0.6rem; width: 0.5rem;
			background-color: #f0f0f0;
			transition: background-color 0.3s ease;
			&.left {
				border-right: none;
				border-radius: 0.6rem 0 0 0.6rem; 
			}
			&.right {
				border-left: none;
				border-radius: 0 0.6rem 0.6rem 0; 
			}
		}
		.circle {
			position: absolute; left: 0;
			height: 0.6rem; width: 0.6rem;
			background-color: #fff;
			border-radius: 0.6rem;
			transition: left 0.3s ease;
		}
		&.active {
			.fan-shaped { 
				background-color: #4ab7ed; 
				border-color: #4ab7ed;
			}
			.circle { 
				border-color: #4ab7ed;
				left: 0.4rem;
			}
		}
	}
</style>
