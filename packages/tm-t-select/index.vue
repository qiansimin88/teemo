<template>
	<div class="tm-t-select">
		<div class="dropdown-wrap" 
	    	 :class="{ active: expand }"
	    	 :style="style" 
	    	 @click.stop="expanding">
	    	<p :style="{ color: fontColor, 'line-height': lineHeight }">{{ selectedVal }}</p>
			<ul class="dropdown-list">
				<li v-for="( i, v ) in vals"
					:class="{ active: selected === i }"
					@click="selected = i">
					<div :style="{ color: fontColor }">
						<span>{{ v }}</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<style lang="less" scoped>
	.tm-t-select {
		text-align: left;

		.dropdown-wrap {
		    position: relative;  width: 200px; padding: 7px 10px;
		    background: #fff; cursor: pointer;
		    outline: none; user-select: none;
			border: 1px solid #ccc; border-radius: 2px;

			p {
				overflow: hidden; max-width: 85%; 
				white-space: nowrap; text-overflow: ellipsis;
			}

		    &:after {
			    content: ""; width: 0; height: 0;
			    position: absolute; right: 16px; top: 50%;
			    margin-top: -3px;
			    border-width: 6px 6px 0 6px; border-style: solid;
			    border-color: grey transparent;
		    }

		    .dropdown-list {
			    position: absolute; top: 100%; left: -1px; right: -1px;
			    list-style: none; background: white; z-index: 1;
			    opacity: 0; pointer-events: none;
			    transition: all 0.3s ease-out;
			    border-bottom: 1px solid #ccc;
			    max-height: 200px; overflow: auto;
				padding: 0;

			    li div {
				    display: block;padding: 10px;
				    text-decoration: none; color: #333;
					text-overflow: ellipsis; max-width: 100%;
					overflow: hidden; white-space: nowrap;
				    transition: all 0.3s ease-out;
				    border-left: 1px solid #ccc;
				    border-right: 1px solid #ccc;
				}

				li:hover{
					background: #f3f3f3;
				}
				li.active div { span { color: #fff; } background-color: #0074ff; }
		    }

		    &.active {
		    	border-color: #0074ff;
		    	&:after { border-width: 0 6px 6px 6px; }
		    	.dropdown-list { 
		    		opacity: 1; pointer-events: auto; border-color: #0074ff;
		    		li div { border-color: #0074ff; }
		    	}
		    }
		}
	}
</style>
<script>
	export default {
		name: 'tmTSelect',
		props: {
			value: {
				type: [ Array, Object ],
				required: true
			},
			key: String,
			label: String,
			selected: {
				type: [ Number, String, Object ],
				default: '',
				twoWay: true
			},
			placeholder: {
				type: String,
				default: '请选择...'
			},
			style: Object
		},
		data() {
			return {
				name: 'tmTSelect',
				expand: false,
				vals: {},
				keyLabel: false,
				fontColor: '#666',
				lineHeight: '15px'
			};
		},
		computed: {
			selectedVal() {
				let v = this.vals[ this.selected ];

				return v ? v : this.placeholder;
			}
		},
		created() {
			this.keyLabel = !!this.key && !!this.label;
			this.simplifyValue( this.value || [] );

			if ( this.style ) {
				this.fontColor = this.style.color || '#666';
				this.lineHeight = this.style.height ? parseInt( this.style.height.slice(0, -2) ) - 20 + 'px' : '15px';
			}

			window.document.body.addEventListener( 'click', this.unexpand );
		},
		detached() {
			window.document.body.removeEventListener( 'click', this.unexpand );
		},
		events: {
			'tm-select-value-changed'( v ) {
				this.simplifyValue( v );
			}
		},
		watch: {
			value( v ) {
				this.simplifyValue( v );
			}
		},
		methods: {
			simplifyValue( vals ) {
				if ( this.keyLabel ) {
					if ( Object.prototype.toString.call( vals ) === '[object Array]') {
						this.vals = vals.reduce( ( obj1, obj2 ) => {
							obj1[ obj2[ this.key ] ] = obj2[ this.label ];
							return obj1;
						}, {});
					} else {
						this.vals = {}; 
						Object.keys( vals ).forEach( k => {
							this.vals[ vals[ k ][ this.key ] ] = vals[ k ][ this.label ];
						});
					}
				} else {
					this.vals = vals;
				}

				this.selected = this.selected;
			},
			expanding() {
				this.$parent.$children.forEach( child => {
					if ( child.name === 'tmTSelect' && child !== this ) {
						child.expand = false;
					}
				});

				// 这里选择下拉项时，会冒泡事件到expanding上
				this.expand = !this.expand;
			},
			unexpand() {
				this.expand = false;
			}
		}
	};
</script>
