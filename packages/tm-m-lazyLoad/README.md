## 使用方式

```
	<img v-lazy="imgPath">

	import lazyload from 'tm-m-lazyLoad';
	import Vue from 'vue';

	Vue.use( lazyload );

	export default {
		name: 'vue-page',
		directives: { lazyload }
	};
```