<template>
	<mask :show="show"></mask>
	<div class="tm-m-picker" v-show="show" transition="fade">
		<div class="picker-confirm">
			<span @click="cancel">取消</span>
			<span @click="ok">确定</span>
		</div>
		<div class="picker-selector"
			 @touchstart.stop.prevent="moveStart"
			 @touchmove.stop.prevent="moving"
			 @touchend.stop.prevent="moveEnd" >
			<div class="selector-window">
				<div class="selector-list"
					 :style="{ top: top + 'rem' }">
					<div class="selector-item"
						 :class="{ active: current == i }"
						 v-for=" ( i, v ) in value ">
						 {{ v }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="less">
	.tm-m-picker {
		z-index: 10000;
		position: fixed; left: 0; right: 0; bottom: 0;

		.fade-transition {
			transition: all .5s ease;
		}

		.fade-enter, .fade-leave { bottom: 100%; }

		.picker-confirm {
			height: .86rem; width: 100%;
			display: flex; justify-content: space-between;
			background-color: #f0f0f0;
			span {
				font-size: .36rem; color: #ccc;
				line-height: .86rem;
				&:first-child { margin-left: .55rem; color: #999; }
				&:last-child { margin-right: .55rem; color: #4ab7ed; }
			}
		}
		.picker-selector {
			height: 4.4rem; width: 100%;
			background-color: #fff; font-size: .36rem;
			overflow: hidden; position: relative;
			-webkit-overflow-scrolling: touch;
		}
		.selector-window {
			background-color: #f0f0f0; color: #333;
			height: .88rem; width: 100%;
			position: absolute; top: 50%; transform: translate3d(0,-50%,0);
		}
		.selector-list {
			position: absolute; top: 0; left: 50%; transform: translate3d(-50%,0,0);
			text-align: center;
		}
		.selector-item {
			height: .88rem; line-height: .88rem; color: #ccc;
			overflow: hidden; width: 100%;
			text-overflow: ellipsis; white-space: nowrap;

			&.active { color: #333; }
		}
	}
</style>
<script>
	import mask from 'phoenixUI/mask';

	let touchTarget = null;

	export default {
		name: 'tmMPicker',
		props: {
			show: {
				type: Boolean,
				twoWay: true,
				default: false
			},
			value: {
				type: [ Array, Object ],
				required: true
			},
			selected: {
				type: [ Number, String ],
				twoWay: true,
				default: -1
			}
		},
		components: { mask },
		data() {
			return {
				locs:[],
				top: 0,
				step: .88,
				topMin: 0,
				lastLoc: 0,

				current: 0,
				len: 0
			};
		},
		created() {
			// this.value = [ 'Einstart-Q', 'Einstart-X', 'Einstart-S', 'Einstart-L', 'EOS-SHING 3D' ];
			this.init();
		},
		events: {
			'tm-picker-value-changed'(v) {
				// this.value = v;
				// this.init();
			}
		},
		watch: {
			value: function(v){
				this.value = v;
				this.init();
			}
		},
		methods: {
			init () {
				// convert array to object if needed
				this.value = Object.assign( {}, this.value );

				let keys = Object.keys( this.value );

				this.selected === -1 && ( this.selected = keys[ 0 ] )
				this.current = this.selected;

				this.len = keys.length;
				this.topMin = ( this.len - 1 ) * this.step * -1;

				let index = 0;

				this.locs = keys.map( (v, i) => {
					if ( v === this.selected ) index = i;

					return {
						key: v,
						val: i * this.step * -1
					};
				});
				this.top = index * this.step * -1;
			},
			moveStart( e ) {
				this.lastLoc = e.touches[ 0 ].clientY;
			},
			moving( e ) {
				// 注意：这里的top是负值
				touchTarget = e.touches[ 0 ];
				if ( !touchTarget ) return;

				let dis = ( touchTarget.clientY - this.lastLoc ) * 0.01;

				if ( Math.abs( dis ) <= 1e-6 ) return;
				// move down
				// stop when distance == 0
				if ( dis > 0 && this.top >= 0 ) return
				// move up
				// stop when distance
				if ( dis < 0 && this.top <= this.topMin ) return;

				this.top += dis;

				this.locs.forEach( v => v.val -= dis );

				this.lastLoc = touchTarget.clientY;
			},
			moveEnd( e ) {
				let min = Infinity;
				let key, index;

				this.locs.forEach( (v, i) => {
					let _v = Math.abs( v.val );

					if ( _v < min ) {
						min = _v;
						key = v.key;
						index = i;
					}
				});
				this.top = index * this.step * -1;
				this.current = key;
			},
			ok() {
				this.selected = this.current;
				this.show = false;
			},
			cancel() {
				this.show = false;

				let index;
				this.locs.forEach( (v, i) => {
					if ( v.key === this.selected ) {
						index = i;
					}
				});

				// 重置到旧的位置
				this.current = this.selected;
				this.top = index * this.step * -1;
			}
		}
	};
</script>
