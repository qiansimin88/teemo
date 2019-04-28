<template>
    <div class="tm-t-multiselect"
        :class="{
            active: expand,
            cleanly: !!selected,
            sm: size === 'sm',
            md: size === 'md',
            lg: size === 'lg'
        }"
        :style="style"
        @click.stop="activate">

        <span class="multiselect-caret"></span>
        <div
            class="multiselect-clean"
            v-if="!multiple && cleanable"
            @click.stop="clean">
            <span>&times;</span>
        </div>
        <div class="multiselect-action">
            <ul v-if="multiple">
                <li v-for="v in alterSelected">
                    <span v-text="v[label]"></span>
                    <span v-show="suppostDelete" @click="unselect( v )">&times;</span>
                </li>
                <span
                    v-if="!alterSelected.length && !searchable"
                    v-text="placeholder">
                </span>
            </ul>
            <input
                v-if="searchable"
                type='text'
                :placeholder="searchPrompt"
                v-model="keyword"
                @keyup.enter="search"
                @keydown.enter.stop.prevent="addTag">
            <span
                v-if="!multiple && !searchable"
                v-text='alterSelected[label] || placeholder'>
            </span>
        </div>
        <ul class="multiselect-dropdown"
            :class="{ multiple: multiple, single: !multiple }">
            <li v-for="v in filteredOptions"
                track-by="$index"
                :class="{ active: v.selected }"
                :style="tplstyle"
                @click="select( v )">
                <partial v-if="tplable" name="option"></partial>
                <span v-else v-text="v[label]"></span>
            </li>
        </ul>
    </div>
</template>
<script>
    // 单项和多选中都有：可搜索、不搜索、对象数组、简单数组
    // 备选项和选中项都有：对象类型，简单类型
    export default {
        props: {
            // 同步或异步通知组件已经选中的元素
            selected: [ String, Object, Array ],
            // 同步或异步通知组件可选的元素列表
            options: Array,
            // 对象数据需要提供key(比较对象)，label(显示对象)
            key: String,
            label: String,
            searchable: Boolean,
            multiple: Boolean,
            suppostDelete: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            tplable: Boolean,
            tplstyle: Object,
            size: {
                type: String,
                default: 'md',
                validator( v ) {
                    return ['sm', 'md', 'lg'].indexOf( v ) > -1;
                }
            },
            style: Object,
            cleanable: Boolean
        },
        data() {
            return {
                // so ugly why
                name: 'tmTMultiselect',

                alterSelected: '',
                alterOptions: '',

                filteredOptions: [],

                expand: false,

                keyword: ''
            };
        },
        created() {
            this.isObject = !!this.key && !!this.label;
            // 如果是简单类型，则默认key和label
            if ( !this.isObject ) {
                this.key = 'key';
                this.label = 'label';
            }

            this.defaultSelectedObj = {
                key: '',
                label: ''
            },

            this.initSelected();
            this.initOptions();

            window.document.body.addEventListener( 'click', this.deactivate );
        },
        beforeDestroy() {
            window.document.body.removeEventListener( 'click', this.deactivate );
        },
        watch: {
            selected( v ) {
                this.initSelected();
            },
            options( v ) {
                this.initOptions();
            },
            keyword( v ) {
                this.search();
            }
        },
        computed: {
            searchPrompt() {
                return this.alterSelected.length ? '' : this.placeholder;
            }
            // cleanly() {
            //     return !!this.selected
            // }
        },
        methods: {
            // 统一数据结构，便于比对, 其中没有selected字段
            initSelected() {
                if ( this.multiple ) {
                    if ( !Array.isArray( this.selected ) ) {
                        console.warn( 'selected should be array when multiple is true' );
                        return;
                    }
                    if ( this.isObject ) {
                        // 对象数组
                        this.alterSelected = this.selected || [];
                    } else if ( this.selected ) {
                        // 简单数组
                        this.alterSelected = this.selected.map( (v, i) => {
                            return { key: v, label: v };
                        });
                    } else {
                        this.alterSelected = [];
                    }
                } else {
                    if ( this.isObject ) {
                        // 对象元素
                        this.alterSelected = this._isEmpty( this.selected )
                            ? this.defaultSelectedObj
                            : this.selected;
                    } else if ( this.selected ) {
                        // 简单元素
                        this.alterSelected = { key: this.selected, label: this.selected };
                    } else {
                        this.alterSelected = this.defaultSelectedObj;
                    }

                    this.searchable
                        && !this._isEmpty( this.alterSelected )
                        && ( this.keyword = this.alterSelected[ this.label ] );
                }

                // 如果selected在options之后，怎要同步options上的选中状态
                if ( this._isEmpty( this.alterOptions ) ) {
                    return;
                }

                let selected = this.alterSelected;
                Array.isArray( selected ) || ( selected = [ selected ] );

                this.alterOptions.forEach( v => {
                    v.selected = selected.filter( _v => {
                        return _v[ this.key ] === v[ this.key ];
                    }).length > 0;
                });
            },
            // 给备选元素上绑定一个selected字段
            initOptions() {
                if ( !this.options ) {
                    this.alterOptions = [];
                    return;
                }

                let selected = this.alterSelected, fn;
                Array.isArray( selected ) || ( selected = [ selected ] );

                if ( this.isObject ) {
                    // 对象类型
                    fn = (v, i) => {
                        let _v = {};
                        _v[ this.key ] = v[ this.key ];
                        _v[ this.label ] = v[ this.label ];
                        _v.selected = selected.filter( __v => {
                            return __v[ this.key ] === v[ this.key ]
                        }).length > 0;

                        // 绑定原始值
                        _v.orignal = v;

                        return _v;
                    }
                } else {
                    // 简单类型
                    fn = (v, i) => {
                        let _v = {};
                        _v[ this.key ] = _v[ this.label ] = v;
                        _v.selected = selected.filter( __v => {
                            return __v[ this.key ] === v;
                        }).length > 0;

                        _v.orignal = v;

                        return _v;
                    }
                }

                this.filteredOptions = this.alterOptions = this.options.map( fn );
            },
            activate() {
                this.$parent.$children.forEach( child => {
                    if ( child.name === 'tmTMultiselect' && child !== this ) {
                        child.expand = false;
                    }
                });

                this.expand = !this.expand;
            },
            deactivate() {
                this.expand = false;
                if ( !this.searchable ) return;
                if ( this.multiple ) {
                    this.keyword = '';
                } else {
                    let v = this.alterOptions.filter( v => v.selected )[0];
                    this.keyword = v ? v[ this.label ] : '';
                }
            },
            clean() {
                if ( this.multiple ) return;

                this.searchable && ( this.keyword = '' );

                this.$emit( 'update', null )
            },
            select( v ) {
                // 如果父级设置selected，这里应该本着代码统一性，不在这里维护selected
                // 而是由父级的update中重置selected后，再由prop传给组件
                // 然后watch中更新( 为了适配异步的selected )
                let hit;
                if ( this.multiple ) {
                    // 多选时，点击选中的元素，可赋为为选中
                    if ( v.selected ) {
                        this.unselect( v )
                    } else {
                        hit = ( this.selected || [] ).slice();
                        hit.push( v.orignal );
                        v.selected = true;
                    }
                } else {
                    // 单选时，选中元素，依旧是选中
                    hit = v.orignal;
                    if ( !v.selected ) {
                        this.alterOptions.forEach( v => v.selected = false );
                        v.selected = true;
                    }
                }

                if ( this.searchable ) {
                    if ( this.multiple ) {
                        this.keyword = '';
                    } else {
                        this.keyword = v[ this.label ];
                    }
                }

                // 通过update事件通知父级当前选中项
                this.$emit( 'update', hit );
            },
            unselect( v ) {
                let hit
                if ( this.multiple ) {
                    hit = ( this.selected || [] ).slice();

                    let l = hit.length - 1, _v;
                    if ( this.isObject ) {
                        while ( l >= 0 ) {
                            if ( hit[ l ][ this.key ] === v[ this.key ] ) break;
                            l--;
                        }
                    } else {
                        while ( l >= 0 ) {
                            if ( hit[ l ] === v[ this.key ] ) break;
                            l--;
                        }
                    }

                    l >= 0 && hit.splice( l, 1 );
                } else {
                    hit = null;
                }

                let l = this.alterOptions.length - 1, _v;
                while ( l >= 0 ) {
                    _v = this.alterOptions[ l-- ];
                    if ( v[ this.key ] === _v[ this.key ] ) {
                        _v.selected = false;
                        break;
                    }
                }

                this.$emit( 'update', hit );
            },
            search() {
                let keyword = this.keyword.trim();
                if ( this._events['fetch'] ) {
                    this.$emit( 'fetch', keyword );
                } else {
                    if ( this.keyword ) {
                        this.filteredOptions = this.alterOptions.filter( v => {
                            return v[ this.label ].indexOf( keyword ) > -1;
                        });
                    } else {
                        this.filteredOptions = this.alterOptions;
                    }
                }
            },
            addTag() {
                let keyword = this.keyword.trim();
                if ( !keyword || !this._events[ 'tag' ] ) return;

                // 通知父级添加元素，然后再由selected传到组件中
                this.$emit('tag', keyword);

                this.keyword = '';
            },
            _isEmpty( v ) {
                if ( !v ) return true;
                if ( Array.isArray( v ) ) return v.length === 0;
                return !v[ this.key ];
            }
        }
    };
</script>
<style lang="less">
    .tm-t-multiselect {
        position: relative; padding: 0 24px 0 6px;
        background: #fff; cursor: pointer;
        border: 1px solid #dbdbdb; border-radius: 3px;

        ul { margin-bottom: 0 }

        &:hover, &.active { border-color: #4ab7ed; }
        &.cleanly:hover {
            .multiselect-clean { display: block; }
        }
        &.active {
            border-bottom: 1px solid #f6f6f6;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .multiselect-caret { transform: rotateZ(180deg); bottom: 45%; }
            .multiselect-dropdown { display: block; border-color: #4ab7ed; }
        }
        &.sm {
            min-height: 24px; width: 140px; font-size: 12px;
            .multiselect-action {
                min-height: 22px; line-height: 22px;
                li { height: 22px; line-height: 20px; }
            }
            .multiselect-dropdown li { line-height: 22px; height: 22px; }
        }
        &.md {
            min-height: 32px; width: 200px; font-size: 14px;
            .multiselect-action {
                min-height: 30px; line-height: 30px;
                li { height: 24px; line-height: 22px; }
            }
            .multiselect-dropdown li { line-height: 30px; height: 30px; }
        }
        &.lg {
            min-height: 36px; width: 240px; font-size: 16px;
            .multiselect-action {
                min-height: 34px; line-height: 34px;
                li { height: 28px; line-height: 26px; }
            }
            .multiselect-dropdown li { line-height: 34px; height: 34px; }
        }
    }
    .multiselect {
        &-caret {
            position: absolute; right: 6px; top: 25%; bottom: 0;
            height: 0; width: 0; margin: auto; cursor: pointer;
            border: 6px solid #999; border-radius: 3px;
            border-color: #999 transparent transparent transparent;
        }
        &-clean {
            position: absolute; right: 6px; top: 25%; bottom: 0;
            height: 15px; width: 15px; background: #80848f; color: #fff;
            border-radius: 50%; display: none;
            span { position: absolute; bottom: -1px; left: 3px; }
        }
        &-action {
            display: flex; align-items: center; flex-wrap: wrap;
            ul {
                display: flex; align-items: center; flex-wrap: wrap;
                height: 100%; color: #666;
                li {
                    padding: 0 6px 0 8px; margin: 3px 4px 2px 0;
                    border: 1px solid #dbdbdb; border-radius: 3px;
                    max-width: 150px; min-width: 50px;
                    background-color: #f3f3f3;
                    display: flex; justify-content: space-between;
                    span:first-child {
                        max-width: 85%; overflow: hidden;
                        text-overflow: ellipsis; white-space: nowrap;
                    }
                    span:first-child {
                        margin-right: 8px; color: #999;
                        &:hover { color: darken(#999, 15%); }
                    }
                }
            }

            input {
                border: none; outline: none;
                height: 24px; flex: 1;
            }

            > span {
                color: #666; user-select: none;
                max-width: 85%; overflow: hidden; display: inline-block;
                text-overflow: ellipsis; white-space: nowrap;
            }
        }
        &-dropdown {
            position: absolute; left: -1px; right: -1px;
            padding: 4px 0; display: none;
            border: 1px solid #dbdbdb; border-top: none; border-radius: 3px;
            border-top-left-radius: 0; border-top-right-radius: 0;
            max-height: 260px; overflow: auto;
            z-index: 999; background: #fff;

            li {
                padding: 0 16px; color: #666; cursor: pointer;
                position: relative; text-align: left;
                &:hover { background-color: #f3f3f3; }
                span {
                    display: inline-block; line-height: 100%;
                    max-width: 100%; overflow: hidden;
                    text-overflow: ellipsis; white-space: nowrap;
                }
            }

            &.multiple li {
                span { max-width: 85%; }
                &.active {
                    background-color: #fff; color: #4ab7ed;
                    &:after {
                        content: ''; width: 10px; height: 5px;
                        border-left: 1px solid #4ab7ed; border-bottom: 1px solid #4ab7ed;
                        transform: rotateZ(-45deg);
                        position: absolute; right: 16px; top: 5px; bottom: 15px; margin: auto;
                    }
                }
            }
            &.single li {
                span { max-width: 100%; }
                &.active { background-color: #4ab7ed; color: #fff; }
            }
        }
    }
</style>
