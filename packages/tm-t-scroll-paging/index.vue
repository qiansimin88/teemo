<template>
    <div class="phoenix-paging" v-el:paging v-if="total > 1">
        <!-- 上一页 -->
        <div class="paging-list-item prePage"
             v-if="current > 1"
             @click="jump( current - 1 )">&#60;&nbsp;&nbsp;上一页</div>

        <div class="paging-list-item"
             :class="{ active : current === 1 }"
             @click="jump( 1 )">1</div>

        <div v-if="current - 3 > 1" class="paging-list-item" >...</div>
        <div v-if="current - 2 > 1" class="paging-list-item" @click="jump( current - 2 )">{{ current - 2 }}</div>
        <div v-if="current - 1 > 1" class="paging-list-item" @click="jump( current - 1 )">{{ current - 1 }}</div>
        <div v-if="current != 1 && current != total" class="paging-list-item active" @click="jump( current )">{{ current }}</div>
        <div v-if="current + 1 < total" class="paging-list-item" @click="jump( current + 1 )">{{ current + 1 }}</div>
        <div v-if="current + 2 < total" class="paging-list-item" @click="jump( current + 2 )">{{ current + 2 }}</div>
        <div v-if="current + 3 < total" class="paging-list-item" >...</div>

        <div
                v-if="total > 1"
                class="paging-list-item"
                :class="{ active : current === total }"
                @click="jump( total )">{{ total }}</div>

        <!-- 下一页 -->
        <div class="paging-list-item nextPage"
             v-if="current < total"
             @click="jump( current + 1 )">下一页&nbsp;&nbsp;&#62;</div>

        <div class="other">
            <span class="totalDesc ml">共<b class="bold">{{ total }}</b>页</span>
            <span>到第&nbsp;
                <input class="goto" type="number" min="1" :max="total" v-model="gotoPn" @keyup.enter="jump( gotoPn )" />&nbsp;页
            </span>
        </div>
        <loading v-if="showLoading" :show="isLoading"></loading>
    </div>
</template>
<script>
	import Phoenix from 'phoenix';
	import loading from 'phoenixUI/loading';

	export default Phoenix.createView({
		name: 'scroll-paging',
		props: {
			total: {
				type : Number,
				default : 1
			},
			inited: {
				type: Boolean,
				default: true
			},
			fetch: Function,
			anchor: {
				type: Object,
				default() {
					return {
						x: 0,
						y: 0
					}
				}
			},
			showLoading: {
				type: Boolean,
				default: true
			}
		},
		data (){
			return {
				current : 1,
				gotoPn : 1,
				five : 5,
				lastPn: 1,
				scrollable: true,
				isLoading: false
			};
		},
		created() {

			/**
			 * 禁用刷新页面跳回上一次滚动位置
			 * https://developer.mozilla.org/en-US/docs/Web/API/History
			 * Allows web applications to explicitly set default scroll restoration behavior on history navigation.
			 * This property can be either auto or manual.
			 * @type {string}
			 */
			window.history.scrollRestoration = 'manual';

			const pn = ( 0 | this.$route.query.pn ) || 1;
			this.lastPn = this.current = parseInt(pn, 10);

			this.$nextTick(() => {
				this.inited && this._notifyPaging();
				window.addEventListener( 'scroll', this.scrolling );
			});

			// 1.x 中使用broadcast分发事件
			// 2.0 中使用$refs直接代用resetPage( query )
			this.$on( 'paging-reset', this.resetPage );
		},
		beforeDestroy() {
			window.removeEventListener( 'scroll', this.scrolling );
		},
		components: { loading },
		methods: {
			jump( n, append ) {
				n = 0 | n;
				//当前页面不触发
				if( this.current === n || n > this.total || n < 1 ) return;
				this.current = n;
				if(!append) this.lastPn = n;
				this._resetScroll( append );
				this.$router[ append ? 'replace' : 'go']({
					query: Object.assign( {}, this.$route.query, { pn: this.lastPn } )
				});
				// append 是否滚屏自动下一页
				this._notifyPaging( append );
			},
			scrolling: (function() {
				let timer = null;
				let pagingEl = null;

				return function( e ) {
					// 已经滚屏一次 || timer尚未完成 || 滚屏时视口中尚未出现分页组件
					pagingEl = this.$els.paging;
					if ( !this.scrollable || timer || !pagingEl ||
						pagingEl.getBoundingClientRect().bottom >
						window.innerHeight ) {
						return;
					}
					timer = setTimeout(() => {
						timer = null;
						this.jump( this.current + 1, this.scrollable );
						this.scrollable = false;
					}, 500);
				};
			})(),
			resetPage( query ) {
				let routeObj = this.$route;
				let pn = routeObj.params.pn || routeObj.query.pn || 1;
				this.current = this.lastPn = query ? parseInt(query.pn || 1, 10) : parseInt(pn, 10);
				this._resetScroll();
				// 带有query的，记录history
				// 重置搜索条件时，一定要query
				this.$router[ query ? 'push' : 'go' ]({
					query: Object.assign( {}, query || routeObj.query || {} )
				});
				this._notifyPaging();
			},
			_resetScroll( append ) {
				// 点击之后( 点击分页button OR 父组件直接调用jump )，
				// 重置到可滚动状态
				// 然后再有scrolling(滚动触发)，赋为不可滚动状态
				// 同时回到顶部
				if ( !append ) {
					this.scrollable = true;
					window.scrollTo(0, 0);
				}
			},
			_notifyPaging( append ) {
				// 通知父组件拉去当前页面数
				// event或者prop(二者只能直接父子之前), 取其一即可
				// @on-paging-jump OR :fetch (1.x & 2.0都可)
				const pn = this.current;
				this.setIsLoading(true);
				if ( this.fetch ) {
					this.fetch( pn, append, this.fetchCb );
				} else {
					this.$emit( 'paging-jump', pn, append, this.fetchCb );
				}
			},
			setIsLoading(isLoading){
				this.isLoading = isLoading;
			},
			fetchCb(){
				this.setIsLoading(false);
			}
		}
	});
</script>
<style lang="less" scoped>
    .phoenix-paging {
        display: inline-flex;
        font-size:12px;
        align-items: center;
    }
    .paging-list-item {
        width:32px; height:32px; line-height: 32px;
        font-size: 14px;
        margin:0 5px; float: left;
        background-color:#fff;
        color:#999; list-style: none;  text-align: center;
        cursor: pointer; border-radius: 4px;
        &.active {
            background-color:#4ab7ed !important;
            color:#fff !important;
        }
        &:hover {
            background-color:#f0f0f0;
            color:#666;
        }
    }
    .other {
        color:#ccc; float: left;font-size: 14px;
        .submit {
            border:1px solid #ccc; padding:5px 10px; background: transparent; border-radius: 2px;
        }
        .goto {
            width:32px; height: 32px; border:1px solid #ddd;
            border-radius: 4px; text-align: center;
        }
        .bold { font-weight: bold; font-size: 14px; color:#999; vertical-align: middle; padding:0 2px; }
        .ml {
            margin-left: 10px;
        }
        .totalDesc{
            display: inline-flex;
            font-size: 14px;
            flex-direction: row;
            align-items: center;
        }
    }
    .prePage, .nextPage{
        width: 80px !important;
    }
</style>