<template>
	<span v-text="value" :class="['badge', {'badge-single': value.length === 1}]"></span>
</template>
<script>
	export default {
		name: 'badge',
		props: {
			value:[ String, Number ]
		}
	};
</script>
<style lang="less" scoped>
	.badge {
	  display: inline-block;
	  text-align: center;
	  background: #ff653f;
	  color: #fff;
	  font-size: .2rem;
	  height: .3rem;
	  line-height: .3rem;
	  border-radius: 1.5rem;
	  padding: 0 .1rem;
	  background-clip: padding-box;
	}
	.badge-single {
	  padding: 0;
	  width: .3rem;
	}
</style>