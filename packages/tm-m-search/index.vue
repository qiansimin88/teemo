<template>
	<div class="search-bar">
		<div class="search-bar-wrap">
			<form action="#" onsubmit="return false;">
				<div class="search-input">
					<i class="iconfont icon-search icon-sousuo" @click="searchFn"></i>
					<input ubt="search-out" type="search" placeholder="{{ placeholder }}" 
						v-model="keywords"
						@keyup="clear($event)"
						@keyup.enter="search">
					<i class="iconfont icon-clear icon-guanbi" 
					   v-show="clearBtnVisible"
					   @click="clear()"></i>
				</div>
			</form>
			<a class="btn-cancel" @click.stop.prevent="cancel">取消</a>
		</div>
	</div>
</template>
<script>
    export default {
        name: 'tm-m-search',
        props: {
            keywords: {
                type: String,
                default: '',
                twoWay: true
            },
            searchFn: {
                type: Function,
                required: true
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                clearBtnVisible: false
            };
        },
        methods: {
            clear(e) {
                if (e) {
                    this.clearBtnVisible = !!e.target.value.length;
                } else {
                    this.keywords = '';
                    this.clearBtnVisible = false;
                }
            },
            cancel() {
                window.history.back();
            },
            search() {
                // hide keyboard auto
                document.activeElement.blur();
                this.searchFn();
            }
        }
    };
</script>
<style lang="less" scoped>
    .search-bar {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2;
        padding: 0.2rem;
        border-bottom: 1px solid #e4e4e4;
        height: .92rem;
        width: 100%;
        font-size: 0.28rem;
        background-color: #4ab7ed;
        .search-bar-wrap {
            display: flex;
            align-items: center;
            form {
                flex: 1;
            }
            .search-input {
                flex: auto;
                display: flex;
                height: .52rem;
                line-height: 0.52rem;
                padding: 0rem 0.2rem;
                background-color: #fff;
                border-radius: 0.03rem;
                input {
                    flex: 1;
                    margin: 0 0.1rem;
                    &:focus {
                        outline: none;
                    }
                    border: none;
                    vertical-align: middle;
                }
                .icon-search {
                    color: #ccc;
                }
                .icon-clear {
                    color: #999;
                }
            }
            a {
                text-decoration: none;
                color: #fff;
                margin-left: 0.2rem;
            }
        }
        // input[type="search"]::-webkit-search-decoration,
        // input[type="search"]::-webkit-search-cancel-button,
        // input[type="search"]::-webkit-search-results-button,
        // input[type="search"]::-webkit-search-results-decoration {
        //   display: none;
        // }
        // 
        input[type="search"]::-webkit-search-cancel-button {
            display: none;
        }
    }
</style>