<!--
    模糊搜索,名字是吕泽义起的
-->

<template>
    <div id="fuzzy">
        <!--添加标签的最外层框-->
        <div :class="{wrap: true, focusClass: isFocus}">
            <!--添加的标签的区域-->
            <div class="addspan-area" v-for="(i, o) in tipsList">
                <span class="tagValue" v-text="handleshowTips(o)">
                </span>
                <i class='iconfont icon-guanbi search-guanbi' @click="deleteTipsclose(o)"></i>
            </div>
            <!--输入标签的地方-->
            <input v-if = "tipsList.length < maxTipsLength" autocomplete="off" type="text" id="inputtext" v-model="inputValue" @focus="handleFocus(true)" @blur.prevent="handleFocus(false)" @keyup.enter="enterAddTips($event)" @keyup.down="changeSelectIndex('down')" @keyup.up="changeSelectIndex('up')" @keydown.delete="deleteTips($event)">
        </div>
        <!--标签的结果区域-->
        <div style="position:relative;">
             <div v-el:scrollwrap id="scrollwrap" :style="{height: allItemHeightCatch + 'px'}" :class="{'result-pull': true, empty: !searchTipsList.length, listFocus: isFocus}" v-show = "isFocus">
                <p :style="singerItemHeightCatch" v-show="!searchTipsList.length" v-text="placetext"></p>
                <p :style="singerItemHeightCatch" v-show="searchTipsList.length" v-for = " (i, o) in searchTipsList" v-text="handleshowTips(o)" :class="{showlist: true, selectd: selectIndex === i}" @click.stop="clickAddTips(o)">
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    import Phoenix from 'phoenix';
    export default Phoenix.createView({
        name: "fuzzysearch",
        props: {
            uniqName: {
                type: String,
                default: ''
            },
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
                        status : false,
                        result: ''
                    }
                }
            },
            screening: {            //必传   就是你数组里面的一大坨 我需要知道我要显示的字段 (支持多字段 意思是某个字段没有 就选择备选字段 竖线|分割,最多两个,多了没意义)
                type: String,   
                required: true
            },
            tipsList : {    //标签的列表数组,展示,增加,删除
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
            wrapAddClass : {    //最外层.wrap(开发者用谷歌查看元素会用吧)的补充或者覆盖的 class 名称 建议 填写的 class属性的内部的 css 属性最好加上@important的属性 不然又可能css 的权限不够
                type: String  
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
			notNull: {
				type: Boolean,
				default: true
			}
        },
        data () {
            return {
                 isFocus : false,           //是否 focus
                 inputValue: '',            //输入框的当前值
                 timer: null,               
                 selectIndex: -1,   //初始化选择的 Index
                 searchList: [],             //搜索成功的列表并且筛选过字段的数组,仅仅作为展示存在
                 placetext: '请输入1个或更多个字符',  //辅助提示文字
                 allItemHeightCatch: 0,  //下拉框高度的缓存
                 singerItemHeightCatch: {       //单个下拉框的样式
                    height: '40'
                 },
                 thresholdValue: 0 //方向键控制的阈值 
            }
        },
        ready () {
            this.init();
        },
        compiled() {
        },
        methods: {
            init () {
                this.allItemHeightCatch = this.singerItemHeight;
                this.thresholdValue = this.allItemHeight / this.singerItemHeight;
                this.singerItemHeightCatch = {
                    height: this.singerItemHeight + 'px',
                    lineHeight: this.singerItemHeight + 'px'
                } 
                if(this.wrapAddClass) {
                    document.querySelector('.wrap').classList.add(this.wrapAddClass);
                }
                if(this.inputAddClass) {
                    document.getElementById('inputtext').classList.add(this.inputAddClass);
                }
            },
            handleFocus (isShow) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.isFocus = isShow;
                }, 300);
            },
            //仅仅展示需要被用户看到的字段
            handleshowTips (o) {
                return o[this.screening.split('|')[0]] ? o[this.screening.split('|')[0]] : o[this.screening.split('|')[1]] 
            },
            //回车键添加标签
            enterAddTips () {
                if(this.tipsList.length < this.maxTipsLength && this.searchTipsList.length) {
                    let nowSelectIndex = this.searchTipsList[this.selectIndex];
                    this.clickAddTips(nowSelectIndex);
                }
            },
            //当前添加的标签是否已经存在了  true已经存在 false 不存在  只接受字符串
            isExist (str) {
                return this.tipsList.some((o, i) => {
                    return this.handleshowTips(o) === str;
                });
            },
            //查询当前标签的 后台数据结构
            insertTips () {
                // this.$dispatch('searchTips', n);
            },
            //方向键
            changeSelectIndex (str) {
                if(str === 'down') {
                    this.selectIndex++;
                    this.scrollHandle('down');
                }
                if(str === 'up') {
                    this.selectIndex--;
                    this.scrollHandle('up');
                }
            },
            scrollHandle (dir) {
                //如果向下
                if(dir === 'down' && (this.selectIndex >= this.thresholdValue && this.selectIndex <= this.searchTipsList.length - 1)) {
                    this.$els.scrollwrap.scrollTop += this.singerItemHeight;
                }
                if(dir === 'up' && (this.selectIndex <= this.searchTipsList.length - this.thresholdValue - 1)) {
                    this.$els.scrollwrap.scrollTop -= this.singerItemHeight;
                }
            },
            clickAddTips (j) {
                let isEX = this.tipsList.some((o, i) => {
                    return this.handleshowTips(o) === this.handleshowTips(j);
                });
                //存在就删除
                if(isEX) {
                    this.tipsList.map((o, i) => {
                        if(this.handleshowTips(o) === this.handleshowTips(j)) {
                            this.tipsList.splice(i, 1);
                        }
                    });
                }else {
                  this.tipsList.push(j);
                }
                this.inputValue = '';
                this.selectIndex = -1;
                console.log(this.selectIndex);
            },
            deleteTips (e) {
                let nowValue = e.target.value;
                let len = this.tipsList.length;
                if(nowValue === '' && len > 0) {
                  let lastIndex = len - 1;
                  let lastTagItem = this.tipsList[lastIndex];
                  this.tipsList.$remove(lastTagItem);
                }
            },
            deleteTipsclose (o) {
                this.tipsList.$remove(o);
            }  
        },
        watch: {
            inputValue (n) {
                    //每次输入都触发父级搜索功能
                if(this.singerTipsStrLength && n.length > this.singerTipsStrLength) {
                    n = n.substr(0, this.singerTipsStrLength);
                    this.inputValue = n;
                    document.getElementById('inputtext').value = this.inputValue;
                }
                if( this.notNull && !n) {
                    this.searchTipsList = [];
                    this.placetext = '请输入1个或更多个字符';
                }else {
                    this.$dispatch('searchTips', n, this.uniqName);
                }
            },
            searchTipsList (n) {
                if(!n.length && this.inputValue !== '') {
                    this.placetext = '没有搜索到任何结果,请换个关键字试试';
                    this.allItemHeightCatch = this.singerItemHeight; 
                }
                if(!n.length) {
                    this.allItemHeightCatch = this.singerItemHeight; 
                }else{
                    this.allItemHeightCatch = this.allItemHeight; 
                }
            },
            selectIndex (n) {
                if(n >= this.searchTipsList.length) {
                    this.selectIndex = this.searchTipsList.length - 1;
                }
                if(n <= -1) {
                    this.selectIndex = -1;
                }
            }
        }
    })
</script>
<style type="text/css" src="./assets/iconfont.css" scoped></style>
<style lang="less" scoped>
@main_color: #4ab7ed;
@font_color_1: #333;
@font_color_2: #666;
@font_color_3: #999;
@font_size_small: 12px;
@font_size_normal: 14px;
@font_size_large: 16px;
@wrap_width:1180px;
@splite_color: #dbdbdb;

.wrap {
    display: flex;flex-wrap: wrap;align-items: center;width: 380px;padding: 0 20px;user-select: none;color: @font_color_2;font-size: @font_size_normal;background: #fff;border: 2px solid @splite_color;border-radius: 2px;
}
.focusClass {
  border: 2px solid @main_color; border-bottom: 0;
} 
#inputtext {
    border: 1px dashed @splite_color;border-radius: 2px;outline: 0;width: 80px;height: 24px;line-height: 24px;padding: 0 8px;margin: 4px 0;font-size: @font_size_normal;
}
.result-pull {
    position: absolute;width: 380px;height: 200px;overflow: auto;top: 0;left: 0;background: #fff;
    p { font-size: 14px; height: 40px; line-height: 40px; padding: 0 20px; margin-bottom: 0px!important;}
    .selectd {
        background: @main_color; color:#fff;
    }
}
.listFocus {
    border:2px solid #4ab7ed;
}
.empty {
    height: 40px;
    line-height:40px;
}
.showlist {
    &:hover {
        background: @main_color; color: #fff;
    }
}
.addspan-area {
    display: flex;align-items: center;margin: 4px 8px 4px 0;padding: 0 4px;border: 1px dashed @splite_color;font-size: @font_size_normal;color: @main_color;height: 24px;text-align: center;
    span:nth-of-type(1) {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        max-width: 200px;
    }
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