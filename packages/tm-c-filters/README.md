
## shorter

the string shorter

shorter(str,len = 16,kep = 0,sep = '...')

```js
    shorter('xxxxxxxxxxxxxxxx')   // 'xxxxxxxxxxxxxxxx'     长16不变
    shorter('xxxxxxxxxxxxxxxxx')  // 'xxxxxxxxxxxxxxxx...'  16长继续不变,多出的用...表示
    shorter('xxx',3)              // 'xxx'   设置长度限制为 3
    shorter('xxxx',3)             // 'xxx...'
    shorter('xxxxxx.aa',3,-3)     // 'xxx....aa'   设置长度限制是3 并且保留最后的三位
    shorter('xxxxxx.aa',3,6)      // 'xxx....aa'   效果和上面的一个一样,只是保留字段漂移是正数
    shorter('xxxxxx.aa',3,-3,'---')// 'xxx---.aa'  同时设置了分隔符
```

## count
数量：超过1千的均以K为单位进行显示，如1.1K；50K（四舍五入、精确到0.1）

```js
	import count from 'tm-c-filters/count';

	export default {
		name "vue-commponent",
		filters: { count }
	};

	OR 

	import filtes from 'tm-c-filters';

	export default {
		name "vue-commponent",
		filters: { filtes.count }
	};

	val | count  ---->  原始数据转化为格式化后的数据
```

## timestamp
时间：用“1秒前、1分钟前、1小时前、1天前、1周前”的方式显示。
例如：59秒，显示59秒前。61秒，显示1分钟前。
23小时，显示23小时前；25小时，显示1天前。
超出1周的，显示具体时间：2016/9/26  11:23

```
	import timestamp from 'tm-c-filters/timestamp';

	export default {
		name "vue-commponent",
		filters: { timestamp }
	};

	OR 

	import filtes from 'tm-c-filters';

	export default {
		name "vue-commponent",
		filters: { filtes.timestamp }
	};

	datetimeVal | timestamp ----> 时间戳转化成格式化后的数据
```
