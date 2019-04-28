# 3dker-redis-session

### 使用

> 安装

npm install 3dker-redis-session --save

> 引用

* 手动替换


```js
app.use(require('3dker-redis-session')({
	host: minasConfig.redisHost,
	port: minasConfig.redisPort,
	password: minasConfig.redisPassword
}, minasConfig.secret));
```

* 使用pastor工具更新

```js
pastor update
```
`注意`: 在pastor执行之前先确保你本地的git是处于干净状态，在pastor update之后，可以根据git status查看到更新了那些信息，只需要保留dev-server.js和production-server.js中的更新，使用git checkout 还原其他更新即可

> minas

确保配置项中存在  
`redisHost`  
`redisPort`  
`redisPassword`  
`sercret`

> 注意

需要删除原有的session引用

```js
//app.use(require('./session')(api.DataService, appConfig.secret));
```

### Change Log

* v0.0.3:

	* redis重连日志显示 redis reconnecting...
	* redis重连次数设置为1000！！！