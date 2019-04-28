###模糊搜索
>使用 demo

```
html:
   <template>
    <div class="place">
     <fuzzysearch screening="phone|email" 
                  :tips-list.sync = "tipslist" 
                  :tips-status.sync="tipsstatus" 
                  :singer-tips-str-length = '12' 
                  :max-tips-length = "6" 
                  :search-tips-list.sync = "searchTipsList">
     </fuzzysearch>
</div>
</template>

js:
    import fuzzysearch from 'teemo/tm-at-fuzzysearch';
     events: {
            //前台需要监听的搜索查询接口事件
            searchTips (n) {
                this.api('searchUserByAccount').send(n).then(data => {
                    var result = data.result.result;
                    if(result.length) {
                        this.searchTipsList = result;
                    }
                }).catch(err => {
                    console.log(err);
                    this.searchTipsList = [];
                });
            }
     }
```

>传入属性说明

```
1.已经选中的标签列表,数组形式
tipsList : {  
                type: Array,
                twoWay: true,
                default: function () {
                    return [];
                }
}

2.输入框每次输入,查询出来的所有数据,数组形式
searchTipsList: {          
                type: Array,
                twoWay: true,
                default: function () {
                    return [];
                }
}

3.允许添加的最多标签数量
 maxTipsLength: {    //可选择最大标签数
                type: Number,
                default: 6
 }
4.单个标签输入的最长字数
 singerTipsStrLength: {   //输入标签时的最长字数
                type: Number,
                default: 12  
}
5. searchTipsList属性数组里所需要展示的字段名称,可多选|分割(最多支持两个,多了没什么意义)
 screening: {           
                type: String,   
                required: true
}
6.最外层.wrap(用谷歌查看元素会用吧)的补充或者覆盖的 class 名称 建议 填写的 class属性的内部的 css 属性最好加上@important的属性 不然又可能css 的权限不够
 wrapAddClass : {    
                type: String  
}
7.输入框的补充 class
inputAddClass: {
                type: String   //input 输入框的额外补充 Class
}
8.下拉框的高度
allItemHeight: {   //下拉框的高度
                type: Number,
                default: 200
}
9.下拉框单个选项的高度,必须能被下拉框的总高度整除不然会有问题😁
 singerItemHeight: {  
                type: Number,
                default: 40
}
```

