# tm-c-contact

## description

Olaf配套的node端contact

## 使用示例

```js
const contact = require( 'tm-c-contact' );

module.exports = {
	dataList(){
		return Promise.resolve( [
			{
				"dataId": 27435,
				"userId": "58d3f3ac468d5f000713108d",
				"name": "不知掉什么东西",
				"classifyId": 36
			},
			{
				"dataId": 27435,
				"userId": "58d3f3ac468d5f000713108d",
				"name": "不知掉什么东西",
				"classifyId": 36
			}
		] ).then( contact.user ).then( res => {
			res = [
				{
					"dataId": 27435,
					"userId": "58d3f3ac468d5f000713108d",
					"name": "不知掉什么东西",
					"classifyId": 36,
					"$user": {
						"userId": "561e542131d4d06001f11bd5",
						"siteCode": "cn",
						"nickName": "preable",
						"id": 5949
					}
				},
				{
					"dataId": 27435,
					"userId": "58d3f3ac468d5f000713108d",
					"name": "不知掉什么东西",
					"classifyId": 36,
					"$user": {
						"userId": "561e542131d4d06001f11bd5",
						"siteCode": "cn",
						"nickName": "preable",
						"id": 5949
					}
				}
			]
		} )
	}
};

```

## 约定
对于contact下的任何方法，例如`contact.user`方法会有两个参数分别是想要处理的数据和`options`可选项(<span style="color: red;"> 警告 </span>：option设置任何的值都会生效，包括不限于空字符串、null)。

* 数据来源：想要遍历的数据
* options: 
	* keyword: 遍历`数据来源`上的哪个字段，例如`contact.user`中默认遍历的是`userId`字段，可以通过传递此选项改变想要遍历的字段。
	* rename: 根据遍历指定的字段经过处理之后生成的数据需要挂载在一个新的字段上，例如`contact.user`默认生成的字段是`$user`。
	* 其它的字段会根据不同的需求而产生，这需要根据各个方法的实际情况而定，但以上的两种options字段是一定存在的。

## 适用场景
> 此contact需要将处理过的数据挂载在一个对象上（挂载位置和检索到指定keyword的位置同一级)

* 数据源非基本类型。

 [x]
  ```
  data: null | undefined | Boolean | String | Number
  ```  
 [√]
 ```
 data: { userId: 'objectId' } | [ { userId: 'objectId' }, { userId: 'objectId2' } ]
 ```
  
* 数据源不能是个基本类型的数组

	[x]
	```
	data: [ 1, 2, 3 ]
	```  
	[√]
	```
	data: [ 1, 2, {userId: 'objectId'} ]
	```
  
* 指定字段（ keyword ）的值如果是`Object`也会被捕获，但是不一定能够正常处理，所以除非明确知道该`contact`支持对`Object`类型的处理，否则请避免出现这样的情况；无论上级的数组或对象是否匹配都不会终止遍历。

	```
	data: [
		{
			userId: 'objectId'  // 匹配
		}, 
		{
			userId: {           // 匹配，但可能引发错误
				...
			},
			userId: [           // 匹配，但可能引发错误
				'objectId',
				'objectId',
				{
					userId: 'objectId'  // 匹配
				}
			]
		}, 
		{
			userId: {           // 匹配，但可能引发错误 
				name: 'nick',
				sub: [
					1,
					2,
					{
						userId: 'objectId'  // 匹配
					}
				],
				userId: [ 'objectId', 'objectId' ] // 匹配
			}
		}
	]
	```
	
# 方法列表

<table>
	<thead>
	<tr>
		<th> 方法 </th>
	
		<th> keyword </th>
		
		<th> rename </th>
		
		<th> type </th>
		
		<th> loginUserId </th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<th> user </th>
		<td> userId </td>
		<td> $user </td>
		<td> X </td>
		<td> X </td>
	</tr>
	<tr>
		<th> isFollow </th>
		<td> userId </td>
		<td> $isFollow </td>
		<td> X </td>
		<td> (当前登陆的用户) </td>
	</tr>
	<tr>
		<th> isLike </th>
		<td> dataId </td>
		<td> $isLike </td>
		<td> data </td>
		<td> (当前登陆的用户) </td>
	</tr>
	<tr>
		<th> isFav </th>
		<td> dataId </td>
		<td> $isFav </td>
		<td> data </td>
		<td> (当前登陆的用户) </td>
	</tr>
	<tr>
		<th> isDesigner </th>
		<td> dataId </td>
		<td> $isDesigner </td>
		<td> X </td>
		<td> (当前登陆的用户) </td>
	</tr>
	<tr>
		<th> activity </th>
		<td> activityId </td>
		<td> $activity </td>
		<td> X </td>
		<td> X </td>
	</tr>
	<tr>
		<th> banner </th>
		<td> bannerId </td>
		<td> $banner </td>
		<td> X </td>
		<td> X </td>
	</tr>
	<tr>
		<th> menuList </th>
		<td> activityId </td>
		<td> $menuList </td>
		<td> X </td>
		<td> X </td>
	</tr>
	<tr>
		<th> theme </th>
		<td> stemplateId </td>
		<td> $theme </td>
		<td> X </td>
		<td> X </td>
	</tr>
	<tr>
		<th> dataById </th>
		<td> dataId </td>
		<td> $data </td>
		<td> X </td>
		<td> X </td>
	</tr>
	<tr>
		<th> acticleById </th>
		<td> articleId </td>
		<td> $article </td>
		<td> X </td>
		<td> X </td>
	</tr>
	</tbody>
</table>


# ChangeLog

* 0.0.5
	添加dataById方法，获取数据的时候会合并调用，节省开销、提升性能