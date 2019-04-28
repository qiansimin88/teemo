<template>
	<div class="tm-t-slide">
		<div class="slide-preview" 
			 :style="{ height: height + 'px', width: width + 'px' }">
			<div class="preview-btn prev" 
				 :class="{ disabled: prevDisabled }"
				 @click="prev"></div>
			<div class="preview-stage">
				<img :src="v" 
					 :class="{ active: current === $index }"
					 v-for=" v in imgs ">
			</div>
			<div class="preview-btn next" 
				 :class="{ disabled: nextDisabled }"
				 @click="next"></div>
		</div>
		<div class="slide-carousel" :style="{ width: width + 'px' }">
			<div class="img-list" 
				 :style="{ width: listWidth + 'px', left: listLeft + 'px' }" >
				 <img :src="v"
					  :class="{ active: current === $index }"
					  :style="{ width: eachWidth + 'px' }"
					  v-for=" v in imgs "
					  @click="current = $index" >
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'tmTSlide',
		props: {
			height: {
				type: Number,
				default: 400
			},
			width: {
				type: Number,
				default: 560
			},
			current: {
				type: Number,
				twoWay: true,
				default: 0
			}
		},
		created() {
			this.init();
		},
		data() {
			return {
				imgs: [],

				len: 0,

				prevDisabled: true,
				nextDisabled: false,

				eachWidth: 0,
				eachOutWidth: 0,
				listWidth: 0,
				listLeft: 0
			};
		},
		events: {
			'tm-t-slide-value-changed'( v ) {
				this.imgs = v;
				this.init();
			}
		},
		computed: {
			prevDisabled() {
				return this.current <= 0
			},
			nextDisabled() {
				return this.current >= ( this.len - 1 );
			}
		},
		methods: {
			init() {
				this.len = this.imgs.length;

				this.eachOutWidth = this.width / 5;
				this.eachWidth = this.eachOutWidth - 12;
				this.listWidth = this.eachOutWidth * this.len;
				this.listLeft = 6;

				this.current = 0;
			},
			prev() {
				if ( this.current <= 0 ) return;

				this.current--;

				if ( this.current > 3 ) {
					this.listLeft += this.eachOutWidth;
				}
			},
			next() {
				if ( this.current >= ( this.len - 1 ) ) return;

				this.current++;

				if ( this.current > 4 ) {
					this.listLeft -= this.eachOutWidth;
				}
			}
		}
	};
</script>
<style lang="less">
	.tm-t-slide {
		.slide-preview {
			border: 1px solid #ccc; position: relative;

			.preview-stage {
				position: relative; height: 100%; width: 100%;

				img {
					position: absolute; left: 0; top: 0;
					height: 100%; width: 100%; visibility: hidden;
					&.active { visibility: visible; }
				}
			}

			.preview-btn {
				position: absolute; top: 0; bottom: 0;
				margin: auto; height: 40px; width: 40px;
				background-color: #666; border-radius: 50%;
				outline: none; user-select: none; cursor: pointer;
				opacity: 0.75; z-index: 999;

				
				&.disabled { cursor: not-allowed; }
				&.disabled:hover { opacity: 0.75; }

				&:hover { opacity: 1; }

				&:after {
					content: '';
					display: block; height: 17px; width: 17px;
					border: 2px solid #fff; border-top: none; border-radius: 2px;
					position: absolute; top: 0; bottom: 0; margin: auto;
				}

				&.prev {
					left: 20px;
					&:after { border-right: none; left: 15px; transform: rotateZ(45deg); }
				}

				&.next {
					right: 20px;
					&:after { border-left: none; right: 15px; transform: rotateZ(-45deg); }
				}
			}
		}

		.slide-carousel {
			margin-top: 16px; height: 120px;
			position: relative; overflow: hidden;

			.img-list {
				position: absolute; top: 10px; height: 100px;

				img {
					height: 100%; border: 1px solid #ccc; cursor: pointer;

					&:not(:first-child) { margin-left: 12px; }

					&.active { transform: scale(1.1); border-color: #4ab7ed; }
				}
			}
		}
	}
</style>