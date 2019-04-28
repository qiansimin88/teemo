<template>
	<mask :show="show"></mask>
	<div class="tm-m-datepicker" v-show="show">
		<div class="picker-confirm">
			<span @click.stop="show = false">取消</span>
			<span @click.stop="ok">确定</span>
		</div>
		<div class="picker-selector" >
			<div class="selector-window">
				<div class="selector-list year"
					 :style="{ top: yearTop + 'rem' }"
					 @touchstart.stop.prevent="moveStart( $event, 'year' )"
					 @touchmove.stop.prevent="moving"
					 @touchend.stop.prevent="moveEnd" >
					<div class="selector-item"
						 :class="{ active: yearCurrent === $index }"
						 v-for=" v in years ">
						 {{ v + '年' }}
					</div>
				</div>
				<div class="selector-list month"
					 :style="{ top: monthTop + 'rem' }"
					 @touchstart.stop.prevent="moveStart( $event, 'month' )"
					 @touchmove.stop.prevent="moving"
					 @touchend.stop.prevent="moveEnd" >
					<div class="selector-item"
						 :class="{ active: monthCurrent === $index }"
						 v-for=" v in monthes ">
						 {{ v + '月' }}
					</div>
				</div>
				<div class="selector-list day"
					 :style="{ top: dayTop + 'rem' }"
					 @touchstart.stop.prevent="moveStart( $event, 'day' )"
					 @touchmove.stop.prevent="moving"
					 @touchend.stop.prevent="moveEnd" >
					<div class="selector-item"
						 :class="{ active: dayCurrent === $index }"
						 v-for=" v in days ">
						 {{ v + '日' }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="less">
	.tm-m-datepicker {
		z-index: 10000;
		position: fixed; left: 0; right: 0; bottom: 0;

		.picker-confirm {
			height: .86rem; width: 100%;
			display: flex; justify-content: space-between;
			background-color: #f0f0f0;
			span {
				font-size: .36rem; color: #ccc;
				line-height: .86rem;
				&:first-child { margin-left: .55rem; }
				&:last-child { margin-right: .55rem; color: #4ab7ed; }
			}
		}
		.picker-selector {
			height: 4.4rem; width: 100%;
			background-color: #fff; font-size: .36rem;
			overflow: hidden; position: relative;
		}
		.selector-window {
			background-color: #f0f0f0; color: #333;
			height: .88rem; width: 100%;
			position: absolute; top: 50%; transform: translate3d(0,-50%,0);
		}
		.selector-list {
			position: absolute;  text-align: center;
			-webkit-overflow-scrolling: touch;

			&.year { left: 1rem; }
			&.month { left: 50%; transform: translate3d(-50%,0,0); }
			&.day { right: 1rem; }
		}
		.selector-item {
			height: .88rem; line-height: .88rem; opacity: 0.5;
			&.active { opacity: 1; }

		}
	}
</style>
<script>
	import mask from 'phoenixUI/mask';

	let touchTarget = null;
	let DATE_METHOD_MAP = {
		YYYY: [ 'getFullYear', 4 ],
		YY:   [ 'getFullYear', 2 ],
		MM:   [ 'getMonth', 2, 1 ],
		M:    [ 'getMonth', 1, 1 ],
		DD:   [ 'getDate', 2 ],
		D:    [ 'getDate', 1 ]
	};

	export default {
		name: 'tmMDatepicker',
		props: {
			show: {
				type: Boolean,
				twoWay: true,
				default: false
			},
			selected: {
				type: String,
				twoWay: true,
				default: ''
			},
			format: {
				type: String,
				default: 'YYYY-MM-DD'
			}
		},
		components: { mask },
		data() {
			return {
				step: .88,
				lastLoc: 0,
				lastDayLen: 0,

				yearTop: 0,
				monthTop: 0,
				dayTop: 0,

				yearTopMin: 0,
				monthTopMin: 0,
				dayTopMin: 0,

				yearLocs: [],
				monthLocs: [],
				dayLocs: [],

				yearCurrent: 0,
				monthCurrent: 0,
				dayCurrent: 0,

				years: [],
				monthes: [],
				days: [],

				target: ''
			};
		},
		watch: {
			show( v ) {
				if ( !v ) return;

				// 初始化选中的日期
				this.selected && this.init();
			}
		},
		created() {
			let year = new Date().getFullYear();

			// 年份范围，当前年的前后10年
			for ( let i = year - 10, l = year + 10; i <= l; i++ ) {
				this.years.push( i );
			}

			for ( let i = 1; i <= 12; i++ ) {
				this.monthes.push( i );
			}

			let locating = ( who, tail ) => {
				this[ `${who}TopMin` ] = ( this[ `${who}${tail}` ].length - 1 ) * -this.step;
				this[ `${who}Locs` ] = this[ `${who}${tail}` ].map( (v, i) => i * this.step );
			}

			locating( 'year', 's' );
			locating( 'month', 'es' );

			this.uploadDays();
		},
		methods: {
			isLeapYear( year ) {
				return ( year % 400 === 0 ) || ( year % 100 !== 0 && year % 4 === 0 );
			},
			uploadDays() {
				let dayLen = 0;

				switch( this.monthes[ this.monthCurrent ] ) {
					case 2 :
						if ( this.isLeapYear( this.years[ this.yearCurrent ] ) ) {
							dayLen = 29;
						} else {
							dayLen = 28;
						}
						break;
					case 4 :
					case 6 :
					case 9 :
					case 11 :
						dayLen = 30;
						break;
					default :
						dayLen = 31;
						break;
				}

				// 如果两次的天数一致，则不作更新
				if ( this.lastDayLen === dayLen ) return;
				this.lastDayLen = dayLen;

				this.days = [];
				for ( let i = 1; i <= dayLen; i++ ) {
					this.days.push( i );
				}
				this.dayTopMin = ( this.days.length - 1 ) * this.step * -1;
				this.dayLocs = this.days.map( (v, i) => {
					return i * this.step
				});

				if ( this.dayCurrent >= dayLen ) {
					// 之前选中的天大于当前月份的最大天, 重置选中第一天
					// 由于dayCurrent记录的是数组下标，所以为大于等于
					this.dayTop = 0;
					this.dayCurrent = 0;
				} else {
					// 之前选中的天小于当前月份的最大天，
					// 由于区块偏移数组是新建的，
					// 则需要根据当前选中的天，调整位置偏移
					let dis = this.dayCurrent * this.step;
					this.dayLocs.forEach( (v, i, arr) => arr[ i ] -= dis );
				}
			},
			init() {
				let current = this.str2date( this.selected );

				if ( current.toString() === 'Invalid Date' ) return;

				// 如果年份不存在，即不再当前日期选择器范围内，则不再继续
				if ( this.years.indexOf( current.getFullYear() ) === -1 ) return;

				let locating = ( who, tail, method, offset = 0 ) => {
					let index, dis;

					// 选中日期的位置和选中状态
					index = this[ `${who}${tail}` ].indexOf( current[ method ]() + offset );
					this[ `${who}Current` ] = index;
					this[ `${who}Top` ] = index * this.step * -1;

					// 更新选中日期中所有位置偏移量
					dis = index * this.step;
					this[ `${who}Locs` ].forEach( (v, i, arr) => arr[ i ] = i * this.step - dis );
				}

				locating( 'year', 's', 'getFullYear' );
				locating( 'month', 'es', 'getMonth', 1 );
				locating( 'day', 's', 'getDate' );
			},
			moveStart( e, target ) {
				this.target = target;
				this.lastLoc = e.touches[ 0 ].clientY;
			},
			moving( e ) {
				// 注意：这里的top是负值
				touchTarget = e.touches[ 0 ];
				if ( !touchTarget ) return;

				let dis = ( touchTarget.clientY - this.lastLoc ) * 0.01;

				if ( Math.abs( dis ) <= 1e-6 ) return;

				let who = `${this.target}Top`;

				// move down
				// stop when distance == 0
				if ( dis > 0 && this[ who ] >= 0 ) return

				// move up
				// stop when distance
				if ( dis < 0 && this[ who ] <= this[ `${this.target}TopMin` ] ) return;

				// 更新当前滑动对象的列表的top值
				this[ who ] += dis;

				// 更新当前滑动对象列表中每个的位置，
				// 便于滑动结束时计算偏离最近的区块
				this[ `${this.target}Locs` ].forEach( (v, i, arr) => arr[ i ] += dis );

				this.lastLoc = touchTarget.clientY;
			},
			moveEnd( e ) {
				let min = Infinity;
				let index;

				// 调整位置，去除偏移的距离
				// 遍历计算出距离显示区最近的区块
				this[ `${this.target}Locs` ].forEach( (v, i) => {
					let _v = Math.abs( v );

					if ( _v < min ) {
						min = _v;
						index = i;
					}
				});

				this[ `${this.target}Top` ] = index * this.step * -1;
				this[ `${this.target}Current` ] = index;

				// 选择月份后，更新其对应的天数
				this.target === 'month' && this.uploadDays();
			},
			ok() {
				let year = this.years[ this.yearCurrent ];
				let month = this.monthes[ this.monthCurrent ];
				let day = this.days[ this.dayCurrent ];

				this.selected = this.formatting( new Date( year, month - 1, day ) );
				this.show = false;
			},
			formatting( date ) {
				if ( typeof date === 'string' ) {
					date = this.str2date( date );
					if ( date.toString() === 'Invalid Date' ) return;
				}

				return this.format.replace( /([YMD]{2,4})(:\/-)?/g, (_, key, sep = '') => {
					let increment = DATE_METHOD_MAP[ key ];

					let result = '00' + ( date[ increment[0] ]() + ( increment[2] || 0 ) );

					return result.slice( -increment[1] ) + sep;
				});
			},
			str2date( str ) {
				return new Date( ( str || '' ).replace( /-/g, '/' ) );
			}
		}
	};
</script>
