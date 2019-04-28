<template>
	<div class="phoenix-2-layer">
		<mask :show="show" :transparent="true"></mask>
		<layer :show="show" :is-center="true">
			<div class="toast-content">
				<div class="bg"></div>
				<div class="text">
                    升级为{{number}}星用户
                    </br>
                    <star :number="number" :show-hollow='true'></star>
					<!-- <slot></slot> -->
				</div>
			</div>
		</layer>
	</div>
</template>
<script>
	import layer from './layer.vue';
	import mask from './mask.vue';
	import star from './star.vue';
	let timer = null;
	export default {
		name : 'toast',
		props : {
			show : {
				type : Boolean,
				twoWay : true
            },
            number:{
                type : Number,
                default:1
            },
			duration : {
				type : Number,
				default : 1500
			}
		},
		created(){
			this.number = this.number > 5 ? 5 : this.number;
            this.number = this.number < 0 ? 0 : this.number;
		},
		watch : {
			show ( value ){
				if( timer ) clearTimeout( timer );
				timer = setTimeout(() => {
					this.show = false;
				}, this.duration);
			}
		},
		components : {
			layer,
            mask,
            star
		},
		methods : {
		}
	};
</script>
<style lang="less" scoped>
	.toast-content {
		position: relative; background: rgba(3, 3, 3, .7); border-radius: 3px;
		.bg {
			position: absolute;
			left:0; top:0; border-radius: 3px; width: 100%; height:100%;
			z-index: -1;
		}
		.text {
			word-wrap:break-word; line-height: 22px;
			text-align: center; padding:15px; color:#fff;
			font-size: 14px;
		}
	}
</style>