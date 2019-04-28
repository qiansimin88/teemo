<template>
	<div class="tm-m-swipe" 
		 :style="{ height: height }"
		 @touchstart="moveStart"
		 @touchmove="moving"
		 @touchend="moveEnd" >
		<div class="img-list" :style="{ width: listWidth + 'px', left: listLeft + 'px' }">
			<img v-for="img in imgs" 
				 track-by="$index"
				 :src="img" 
				 :style="{ width: imgWidth + 'px' }" >
		</div>
		<div class="status">
			<span class="current">{{ current }}</span>/<span class="total">{{ total }}</span>
		</div>
	</div>
</template>
<script>
	let lastLocation = 0;

	export default {
		name: 'tmMSwipe',
		props: {
			height: {
				type: String,
				default: '4rem'
			}
		},
		data() {
			return {
				imgs: [],
				current: 0,
				total: 0,

				listWidth: 0,
				listLeft: 0,
				imgWidth: 0
			};
		},
		created() {
			this.init();
		},
		events: {
			'tm-m-swipe-value-changed'( v ) {
				this.imgs = v;
				this.init();
			}
		},
		methods: {
			init() {
				this.imgWidth = window.innerWidth;
				this.listWidth = this.imgWidth * this.imgs.length;
				this.current = 1;
				this.total = this.imgs.length;
			},
			moveStart( e ) {
				lastLocation = e.touches[ 0 ].clientX;
			},
			moving( e ) {
			},
			moveEnd( e ) {
				let currentLocation = e.changedTouches[ 0 ].clientX;

				if ( currentLocation === lastLocation ) return;

				if ( currentLocation > lastLocation ) {
					if ( this.current === 1 ) return;

					this.current -= 1;
					this.listLeft += this.imgWidth;
				} else {
					if ( this.current === this.total ) return;

					this.current += 1;
					this.listLeft -= this.imgWidth;
				}
			}
		}
	};
</script>
<style lang="less">
	.tm-m-swipe {
		position: relative; overflow: hidden;
		height: 4rem; width: 100%;
		margin-top: 0.1rem;

		.img-list {
			position: absolute; top: 0;
			display: flex; height: 100%;
			transition: left 0.2s ease;

			img {
				flex: 1; height: 100%;
			}
		}
		.status {
			background:rgba(51,51,51,0.80);
			border-radius:.15rem;
			width:.8rem;
			height:.3rem;
			line-height:.3rem;
			color:#fff;
			font-size:.24rem;
			text-align: center;
			position: absolute; right: 0.1rem; bottom: 0.1rem;
			.current{
				font-size:.3rem;
			}
		}
	}
</style>