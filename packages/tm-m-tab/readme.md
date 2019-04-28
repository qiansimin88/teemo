### 使用示例

```html
<template>
	<tab :tabs="tabArr"></tab>
</template>

<script>
	import Phoenix from 'phoenix';
	import tab from 'tm-m-tab';
	Phoenix.createView({
		data(){
			return {
				tabArr: [{name: '标签1', link: {name: 'tab1'}}]
			};
		},
		components: {
			tab
		}
	});
	
</script>
```

### 注意事项

1. 传入的参数中，link参数将会用在v-link标签上，但是并未绑定。
2. 因为所有的tab点击之后都是跳转页面，所以这里的tab组件适用于利用tab切换子路由的情况。

`@author`: 黄警官