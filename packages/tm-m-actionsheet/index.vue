<template>
	<!-- 底部的弹框 -->
	<div class="actionsheet_wrap" >
		<!-- 遮罩 -->
		<div v-if="needMask" :class="{action_mask:true, 'action_sheet_fade_toogle': show }"  v-show="show" :style="{ zIndex: zindex}" @click='handleClose()'>
			
		</div>
		<!-- 弹框实体 -->
		<div :class="{'hy-actionsheet':true,'action_sheet_toggle':show }" :style="{zIndex: zindex+1}">
			<div class="actionsheet-box">
				<slot></slot>
			</div>
		</div>
	</div>
</template>
<style lang='less'>
	.action_mask {
		background: transparent;transition: .3s;position: fixed;z-index: 1;width: 100%;height: 100%;top:0;left: 0;
		&.action_sheet_fade_toogle {
			background: rgba(0,0,0,.6)
		}
	}
	.hy-actionsheet {
		position: fixed;left: 0;bottom: 0;transform: translateY(100%);backface-visibility: hidden;z-index: 2;width: 100%;background-color: #efeff4;transition: transform .3s;
		.actionsheet-box {background: #fff;}
		&.action_sheet_toggle {
			transform: translate(0);
		}
	}
</style>
<script>
	export default {
		name: 'action_sheet',
		props: {
			show : {
				type: Boolean,
				default: false
			},
			needMask : {
				type:Boolean,
				default:true
			},
			zindex: {
				type: String,
				default:112
			}
		},
		methods:{
			handleClose() {
				this.show = false;
                this.$dispatch('hideShare', 'hide')
			}
		}
	}
</script>