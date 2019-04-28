###confirm (取消和确定都带有callback函数)
>使用 demo

```
html:
   -.自定义html 
   <teemo-confirm :show.sync = 'confirmshowDelete' title="删除数据" :cancel-action = "cancelActionDelete" :confirm-action = "confirmActionDelete">
        <div slot="confirm-content" class="confirm-delete">
             呵呵😑
        </div>
    </teemo-confirm>

    二.使用一句话
    <teemo-confirm :show.sync = 'confirmshelves' title = "操作提示" :custom-content = "我还是呵呵🙄" :confirm-action = "confirmActionShelves">
	</teemo-confirm>
js:
    import teemoconfirm from 'teemo/tm-a-confirm';
    methods: {
        cancelActionDelete () {
            console.log('点击取消了😄');
        },
        confirmActionDelete () {
            console.log('点击确定了😂');
        }
    }
```

>传入属性说明 props
>show: 是否显示
>title: 自定义的一句话 （注意如果用了slot就别再用这个了，自行抉择 二选一 ）
>cancelAction:  取消回调
>confirmAction: 确定回调

