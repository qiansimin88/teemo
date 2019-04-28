# activate-https

### 使用

> 安装

`npm i activate-https --save`

> 代码中引用

```js
const app = require('express')();
require('activate-https')(app);
```

> 注意
 
请勿在build/production-server文件中引用此组件，组件中强制添加了`NODE_ENV==='production'`时禁用此组件。

>登录配置

修改server/project.js

```
'proxyTable': {
	"/i": {
		target: 'https://develop.3dker.cn',
		changeOrigin:true,
		secure: false
	}
}
      
```

### 最近更新

* v0.0.6:

	> 调整传入参数
	
	require('activate-https')(app, /* port, host */);  
	建议去处注释，这样可以保持和http时启动保持一致
	
	`默认值:`  
	port: 443  
	host: 127.0.0.1
	

	
	> 启用提示
	
	启用时提示https状态，避免因为启用不同协议导致页面无法打开时，不必要的调试时间