# tm-c-fallback

## 作用

用于将非statics目录的静态资源去除.html，使fallback能够响应静态化之后的路由

## 使用

在一下文件中 `connect-history-api-fallback` 的引用位置之前使用

* build/dev-server.js
* build/production-server.js

```
require('tm-c-fallback')(app, project.host);
```