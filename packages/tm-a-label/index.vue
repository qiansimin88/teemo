<!--
    模糊搜索,名字是吕泽义起的
-->

<template>
    <div id="label">
        <!--添加标签的最外层框-->
        <div :class="{wrap: true, focusClass: isFocus}" :style="{width: wrapWidth + 'px'}">
            <!--添加的标签的区域-->
            <div class="addspan-area" v-for="(i, o) in tipsList">
                <span :class="{tagValue: true, deletOn: deletOn && i === tipsList.length -1 }"
                      v-text="handleshowTips(o)">
                </span>
                <i class='iconfont icon-guanbi search-guanbi' @click="deleteTipsclose(o)" v-if="canDel"></i>
            </div>
            <!--输入标签的地方-->
            <input v-if="tipsList.length < maxTipsLength" :maxlength="singerTipsStrLength" type="text" id="inputtext"
                   v-model="inputValue" @focus="handleFocus(true)" @blur.prevent="handleFocus(false)"
                   @keyup.enter="enterAddTips($event)" @keydown.delete="deleteTips($event)">
        </div>
        <!--标签的结果区域-->
        <div style="position:relative; z-index: 999;">
            <div v-el:scrollwrap id="scrollwrap" :style="{height: allItemHeightCatch + 'px', width: wrapWidth + 'px'}"
                 :class="{'result-pull': true, empty: !searchTipsList.length, listFocus: isFocus}" v-show="isFocus">
                <p :style="singerItemHeightCatch"
                   v-show="!inputValue.length && tipsList.length < maxTipsLength || !searchTipsList.length "
                   v-text="placetext"></p>
                <p :style="singerItemHeightCatch" v-show="searchTipsList.length" v-for=" (i, o) in searchTipsList"
                   v-text="handleshowTips(o)" :class="{showlist: true, selectd: selectIndex === i}"
                   @click="clickAddTips(o)">
                </p>
            </div>
        </div>
    </div>
</template>
<script>
	import Phoenix from 'phoenix';

	export default Phoenix.createView({
		name: "tm-a-label",
		props: {
			maxTipsLength: {    //可选择最大标签数
				type: Number,
				default: 6
			},
			singerTipsStrLength: {   //输入标签时的最长字数
				type: Number,
				default: 12
			},
			tipsStatus: {           //传给父级的实时信息, 父级只需要监听即可
				twoWay: true,
				type: Object,
				default: function () {
					return {
						status: false,
						result: ''
					}
				}
			},
			screening: {            //必传   就是你数组里面的一大坨 我需要知道我要显示的字段 (支持多字段 意思是某个字段没有 就选择备选字段 竖线|分割,最多两个,多了没意义)
				type: String,
				required: true
			},
			tipsList: {    //标签的列表数组,展示,增加,删除
				type: Array,
				twoWay: true,
				default: function () {
					return [];
				}
			},
			searchTipsList: {           //输入框每次输入查询出来的标签列表
				type: Array,
				twoWay: true,
				default: function () {
					return [];
				}
			},
			wrapAddClass: {    //最外层.wrap(开发者用谷歌查看元素会用吧)的补充或者覆盖的 class 名称 建议 填写的 class属性的内部的 css 属性最好加上@important的属性 不然又可能css 的权限不够
				type: String
			},
			wrapWidth: {
				type: Number,
				default: 380
			},
			addspanAddClass: {
				type: String
			},
			inputAddClass: {
				type: String   //input 输入框的额外补充 Class
			},
			allItemHeight: {   //下拉框的高度
				type: Number,
				default: 200
			},
			singerItemHeight: {  //下拉框单个选项的高度
				type: Number,
				default: 40
			},
			targetKey: { // 对应多个label
				type: String,
				default: 'label_1'
			},
			enableDel: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				deletOn: false,   //删除焦点
				isFocus: false,           //是否 focus
				inputValue: '',            //输入框的当前值
				timer: null,
				searchList: [],             //搜索成功的列表并且筛选过字段的数组,仅仅作为展示存在
				placetext: '请输入1个或更多个字符',  //辅助提示文字
				tar: this.targetKey,
				canDel: this.enableDel
			}
		},
		ready() {
			this.init();
		},
		compiled() {
		},
		methods: {
			init() {
				if (this.wrapAddClass) {
					document.querySelector('.wrap').classList.add(this.wrapAddClass);
				}
				if (this.inputAddClass) {
					document.getElementById('inputtext').classList.add(this.inputAddClass);
				}
			},
			handleFocus(isShow) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.isFocus = isShow;
				}, 200);
			},
			//仅仅展示需要被用户看到的字段
			handleshowTips(o) {
				return o[this.screening.split('|')[0]] ? o[this.screening.split('|')[0]] : o[this.screening.split('|')[1]]
			},
			//回车键添加标签
			enterAddTips() {
				console.log('v', this.inputValue);
				if (this.inputValue.trim() && !this.tipsList.some((o, i) => this.handleshowTips(o) === this.inputValue)) {
					this.$dispatch('insertLabel', this.inputValue, this.tar);    //触发事件
				}
			},
			//当前添加的标签是否已经存在了  true已经存在 false 不存在  只接受字符串
			isExist(str) {
				return this.tipsList.some((o, i) => {
					return this.handleshowTips(o) === str;
				});
			},
			clickAddTips(j) {
				let isEX = this.tipsList.some((o, i) => {
					return this.handleshowTips(o) === this.handleshowTips(j);
				});
				//存在就删除
				if (isEX) {
					this.tipsList.map((o, i) => {
						if (this.handleshowTips(o) === this.handleshowTips(j)) {
							this.tipsList.splice(i, 1);
						}
					});
				} else {
					this.tipsList.push(j);
				}
			},
			deleteTips(e) {
				if (!this.canDel) return;
				let nowValue = e.target.value;
				let len = this.tipsList.length;
				if (nowValue === '' && len > 0 && !this.deletOn) {
					this.deletOn = true;
				} else if (nowValue === '' && len > 0 && this.deletOn) {
					let lastIndex = len - 1;
					let lastTagItem = this.tipsList[lastIndex];
					this.tipsList.$remove(lastTagItem);
					this.deletOn = false;
					this.$dispatch('delLabel', this.tar);
				}
			},
			deleteTipsclose(o) {
				this.tipsList.$remove(o);
				this.$dispatch('delLabel', this.tar);
			}
		},
		watch: {
			inputValue(n) {
				if (!n) {
					this.searchTipsList = [];
					this.placetext = '请输入1个或更多个字符';
				} else {
					this.deletOn = false;
					this.$dispatch('addLabel', n, this.tar);    //触发事件
				}
			},
			//过滤重复的添加
			tipsList(n) {
				this.inputValue = '';
			},
			searchTipsList(n) {
				if (!n.length && this.inputValue) {
					this.placetext = '查询不到该标签';
				}
			}
		}
	})
</script>
<style type="text/css" src="./assets/iconfont.css"></style>
<style lang="less" scoped>
    @main_color: #4ab7ed;
    @font_color_1: #333;
    @font_color_2: #666;
    @font_color_3: #999;
    @font_size_small: 12px;
    @font_size_normal: 14px;
    @font_size_large: 16px;
    @wrap_width: 1180px;
    @splite_color: #dbdbdb;

    .wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 380px;
        padding: 0 20px;
        user-select: none;
        color: @font_color_2;
        font-size: @font_size_normal;
        background: #fff;
        border: 2px solid @splite_color;
        border-radius: 2px;
    }

    .focusClass {
        border: 2px solid @main_color;
        border-bottom: 0;
    }

    #inputtext {
        border: 1px dashed @splite_color;
        border-radius: 2px;
        outline: 0;
        width: 80px;
        height: 24px;
        line-height: 24px;
        padding: 0 8px;
        margin: 4px 0;
        font-size: @font_size_normal;
    }

    .result-pull {
        position: absolute;
        width: 380px;
        height: 200px;
        overflow: auto;
        top: 0;
        left: 0;
        background: #fff;
        p {
            font-size: 14px;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            margin-bottom: 0px !important;
        }
        .selectd {
            background: @main_color;
            color: #fff;
        }
    }

    .listFocus {
        border: 2px solid #4ab7ed;
    }

    .empty {
        height: 40px;
        line-height: 40px;
    }

    .showlist {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        &:hover {
            background: @main_color;
            color: #fff;
        }
    }

    .addspan-area {
        display: flex;
        align-items: center;
        margin: 4px 8px 4px 0;
        padding: 0 4px;
        border: 1px dashed @splite_color;
        font-size: @font_size_normal;
        color: @main_color;
        height: 24px;
        text-align: center;
        span:nth-of-type(1) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 200px;
        }
    }

    .teemo-guanbi {
        display: inline-block;
        font-size: 8px !important;
        color: #666;
        margin-left: 4px;
        width: 18px;
        height: 18px;
    }

    .deletOn {
        color: #ff5b2d;
    }

    .search-guanbi {
        display: inline-block;
        font-size: 8px !important;
        color: #666;
        margin-left: 4px;
        width: 18px;
        height: 18px;
    }
</style>
