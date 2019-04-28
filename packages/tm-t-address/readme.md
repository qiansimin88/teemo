# tm-t-address

### 说明
此组建仅提供了创建、修改收货地址的窗口，用户收货地址列表的获取、展示还需自定义

### 依赖

确保项目有`AddressApiService`这个服务，编辑收货地址的时候需要通过`AddressApiService.getAddress`获取省份等地址信息，并确保按照一下方式wrap这两个接口

```
var Api = require('../../build/api');
const Utils = require('../utils');

module.exports = {
	getUserAddressByUserId(pvg){
		const userId = Utils.get_user(this).userId;
		if(!userId) return Utils.error('need_login');

		pvg = pvg || {};

		return Api.AddressApiService.getUserAddressByUserId(userId, pvg);
	},
	createUserAddress(userAddressDto, pvg){
		const userId = Utils.get_user(this).userId;
		if(!userId) return Utils.error('need_login');

		userAddressDto = userAddressDto || {};
		userAddressDto.userId = userId;

		pvg = pvg || {};

		return Api.AddressApiService.createUserAddress(userAddressDto, pvg);
	}
};
```

### 使用

> 安装

`npm i tm-t-address --save`

> 参数解释

* `show`: 

 	__type__: Boolean
 	
 	__usage__: 控制地址编辑窗口的显隐；
 	
* `edit`:

	__type__: Function | arguments: 将完整的用户地址信息对象传入即可
	
	__usage__: 编辑收货地址，如果没有id则保存时会新建收货地址
	
* `setDefault`:

	__type__: Function | arguments: 将完整的用户地址信息对象传入即可
	
	__usage__: 会将传入的对象设置为默认地址
	
	__remark__: 可配合`addressArr`参数一起使用
	
* `addressArr(可选参数)`:

	__type__: Array (用户收货地址的数组).  
	__usage__: 在使用setDfault的时候，会遍历这个数组，将原有的默认收货地址在本地修改为非默认
	
* `forbidClose`:

	__type__: Boolean.
	__usage__: 收货地址的编辑窗口是否禁用关闭功能，为true的时候编辑窗口的关闭按钮将会被隐藏
	
> 事件

* 修改收货地址

	name: updateUserAddress  
	value: 请求结果的整个res

* 新建收货地址

	name: createUserAddress	   
	value: 请求结果的整个res

> 使用示例

```
<template>
<t-address :address-arr="addressArr" :show.sync="addressDetailShow" :edit.sync="modifyAddress" :set-default.sync="setDefault"></t-address>
</template>

<script>
export default Phoenix.createView({
	data(){
		return {
			addressDetailShow: false,
			addressArr: []
		};
	},
	methods: {
		modifyAddress(){},
		setDefault(){}
	}
});
</script>
```

### Change Log

v0.0.5

 * 添加调用上传、修改收货地址之后的事件

v0.0.6

 * 在调用edit的时候，如果传入的参数有收货地址的id则弹窗显示为“修改收货地址”，如果没有则显示“新增收货地址”

v0.0.7

 * 收货地址填写时，字符长度限制为40个字符，添加了相应的判断和提示

v0.0.8

 * 限制收货人长度最大为12
 * 去除固话和邮编的填写部分


v0.0.15

* 手机号新增199段号的扩展