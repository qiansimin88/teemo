<template>
	<layer :show.sync="show" :style="addressDetailStyle">
		<div id="address-detail">
			<div class="title">
				<h4>{{dialogTitle}}</h4>
				<i v-show="!forbidClose" class="teemo teemo-guanbi h3" @click.stop="show = false"></i>
			</div>
			<div class="body">
				<div class="item">
					<label>收货人<span style="color:red">*</span></label>
					<input class="input input-md special" type="text" v-model="addressInfo.receiver">&nbsp;
					<span class="warn" v-show="inspecting && !addressInfo.receiver">收货人</span>
					<span class="warn" v-show="inspecting && addressInfo.receiver.length > 12">收货人应不大于12个字符</span>
				</div>
				<div class="item">
					<label>所在地<span style="color:red">*</span></label>
					<tm-select :style="selectStyle" :value="provinceList" key="provinceId" label="provinceName"
							   :selected.sync="provinceId" placeholder="选择省份"></tm-select>
					<tm-select :style="selectStyle" :value="cityList" key="cityId" label="cityName"
							   :selected.sync="cityId" placeholder="选择城市"></tm-select>
					<tm-select :style="selectStyle" :value="districtList" key="districtId" label="districtName"
							   :selected.sync="districtId" placeholder="选择区县"></tm-select>
					<span class="warn" v-show="inspecting && (!provinceId || !cityId || !districtId)">请完善所在地</span>
				</div>
				<div class="item">
					<label>详细地址<span style="color:red">*</span></label>
					<input class="input input-md special" type="text" v-model="addressInfo.street">&nbsp;
					<span class="warn" v-show="inspecting && !addressInfo.street">请填写详细地址</span>
					<span class="warn" v-show="inspecting && addressInfo.street.length > 40">地址长度不能超过40个字符</span>
				</div>
				<div class="item">
					<label>手机号码<span style="color:red">*</span></label>
					<input class="input special" type="text" v-model="addressInfo.phone">&nbsp;
					<span class="warn" v-show="inspecting && !isPhone(addressInfo.phone)">请填写有效的手机号</span>
				</div>
				<!--<div class="item">-->
					<!--<label>固定电话：</label>-->
					<!--<input class="input input-xs" placeholder="区号" type="text">&nbsp;-&nbsp;-->
					<!--<input class="input" placeholder="电话号码" type="text">&nbsp;-&nbsp;-->
					<!--<input class="input input-xs" placeholder="分机" type="text">-->
				<!--</div>-->
				<!--<div class="item">-->
					<!--<label>邮编：</label>-->
					<!--<input class="input" type="text">-->
				<!--</div>-->
				<div class="item">
					<label></label>
					<input type="checkbox" v-model="addressInfo.isDefault | default">设置为默认收货地址
				</div>
				<div class="item">
					<label></label>
					<button class="btn btn-primary btn-md h3" @click.stop="saveAddress(addressInfo)">保存收货人信息
					</button>
				</div>
			</div>
		</div>
	</layer>

	<toast :show.sync="toastShow">{{toastMsg}}</toast>
</template>

<script>

	import Phoenix from 'phoenix';
	import mask from 'phoenixUI/mask';
	import layer from 'phoenixUI/layer';
	import tmSelect from 'tm-t-select';
	import toast from 'phoenixUI/toast';

	export default Phoenix.createView({
		name: 't-address',
		props: {
			show: {
				type: Boolean,
				default: false,
				twoWay: true
			},
			edit: {
				type: Function,
				default(){},
				twoWay: true
			},
			setDefault: {
				type: Function,
				default(){},
				twoWay: true
			},
			addressArr: {
				type: Array,
				default(){
					return [];
				}
			},
			forbidClose: {
				type: Boolean,
				default: false
			},
			userId: {
				default: ''
			}
		},
		data(){
			return {
				inspecting: false,
				addressDetailStyle: {
					width: '590px'
				},
				selectStyle: {
					width: '112px',
					'margin-right': '10px',
					height: '32px'
				},
				dialogTitle: '修改收货地址',
				addressInfo: {
					id: '',
					creator: '',
					fullPathId: '',
					fullPathName: '',
					gmtCreate: '',
					gmtModified: '',
					isDefault: '',
					isDeleted: '',
					modifier: '',
					phone: '',
					receiver: '',
					street: '',
					userId: ''
				},
				provinceList: [{name: 'name', value: 'value'}],
				cityList: [],
				districtList: [],
				provinceId: '',
				cityId: '',
				districtId: '',
				province: {},
				city: {},
				district: {},
				toastMsg: '',
				toastShow: false,
				ganged: true
			};
		},
		components: {
			mask,
			layer,
			tmSelect,
			toast
		},
		watch: {
			provinceId(cur){
				this.province = this.findFromArr(this.provinceList, 'provinceId', cur) || {};
				this.getCityList(this.province);

				// 是否联动；一直保持选择省份3级联动，在renderDetail的时候会导致2、3级将没有值
				if(this.ganged) {
					this.cityId = '';
					this.districtId = '';
				}
			},
			cityId(cur){
				this.city = this.findFromArr(this.cityList, 'cityId', cur) || {};
				this.getDistrictList(this.city);

				// 是否联动；一直保持选择省份3级联动，在renderDetail的时候会导致2、3级将没有值
				if(this.ganged){
					this.districtId = '';
				}
			},
			districtId(cur){
				this.district = this.findFromArr(this.districtList, 'districtId', cur) || {};
			}
		},
		ready(){
			this.wrap();
			this.getProvinceList();
		},
		methods: {
			wrap(){
				this.edit = this.modifyAddress;
				this.setDefault = this.setDefaultAddress;
			},
			getAddressList(){
				return this.api('getUserAddressByUserId').send({}).then(res => {
					this.addressArr = res && res.result && res.result.result || [];
					this.addressArr.forEach(address => {
						if (address && address.isDefault === 'y') this.chooseAddress = address;
					});

					return this.addressArr;
				});
			},
			getProvinceList(){
				this.api('getAddress').send({}).then(res => {
					this.provinceList = res && res.result && res.result.result || [];
				});
			},
			getCityList(province){
				this.cityList = province.cityArr || [];
				if (this.cityId) this.city = this.findFromArr(this.cityList, 'cityId', this.cityId) || {};
			},
			getDistrictList(city){
				this.districtList = city.disArrayList || [];
				if (this.districtId) this.district = this.findFromArr(this.districtList, 'districtId', this.districtId) || {};
			},
			saveAddress(address, msg){
				this.makeUpFullPath();
				address = address || this.addressInfo;
				this.renderDetail(address);
				//qsm
				if(this.userId) {
					address.userId = this.userId;
				}
                // 去掉首尾空格
                if(this.addressInfo && this.addressInfo.phone){
                    this.addressInfo.phone = this.addressInfo.phone.replace(/(^\s*)|(\s*$)/g, "")
                }
				return this.checkProp().then(success => {
					if (!success) return;
					var method = !address.id ? 'createUserAddress' : 'updateUserAddress';
					console.log(address);
					return this.api(method).send(address, {}).then(res => {
						this.$dispatch(method, res);
						this.show = false;
						if (res && res.result && res.result.success) {
							this.showToast(msg ||'地址保存成功');
							return res.result.result;
						} else {
							this.showToast('地址保存失败');
							return null;
						}
					});
				});
			},
			checkProp(){
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						if (!this.addressInfo.receiver || this.addressInfo.receiver.length > 12 || !this.provinceId || !this.cityId || !this.districtId || !this.addressInfo.street ||
								this.addressInfo.street.length > 40 || !this.isPhone(this.addressInfo.phone)) {
							this.inspecting = true;
							resolve(false);
						} else {
							this.inspecting = false;
							resolve(true);
						}
					});
				});
			},
			showToast(msg){
				this.toastMsg = msg || this.toastMsg;
				if (!this.toastMsg) return;
				this.toastShow = true;
				setTimeout(() => {
					this.toastShow = false;
				}, 1000);
			},
			modifyAddress(address){
				this.renderDetail(address);
				this.dialogTitle = address && address.id ? '修改收货地址' : '新增收货地址';
				this.show = true;
			},
			initAddress(){
				this.addressInfo = {
					id: '',
					creator: '',
					fullPathId: '',
					fullPathName: '',
					gmtCreate: '',
					gmtModified: '',
					isDefault: '',
					isDeleted: '',
					modifier: '',
					phone: '',
					receiver: '',
					street: '',
					userId: ''
				};

				this.provinceId = '';
				this.cityId = '';
				this.districtId = '';

				this.show = true;
			},
			renderDetail(address){
				this.ganged = false;
				address = address || {};
				var pathIdArr = (address.fullPathId || '').split('|');
				this.provinceId = pathIdArr[0] || '';
				this.cityId = pathIdArr[1] || '';
				this.districtId = pathIdArr[2] || '';
				this.addressInfo = {
					id: address.id || '',
					creator: address.creator || '',
					fullPathId: address.fullPathId || '',
					fullPathName: address.fullPathName || '',
					gmtCreate: address.gmtCreate || Date.now(),
					gmtModified: address.gmtModified || Date.now(),
					isDefault: address.isDefault || 'n',
					isDeleted: address.isDeleted || 'n',
					modifier: address.modifier || '',
					phone: address.phone || '',
					receiver: address.receiver || '',
					street: address.street || '',
					userId: address.userId || ''
				};

				setTimeout(() => {
					this.ganged = true;
				});
			},
			isDefault(address){
				if (address.isDefault === 'y') this.addressInfo = address;
				return address.isDefault === 'y';
			},
			setDefaultAddress(address){
				this.addressArr.forEach(address => {
					address.isDefault = 'n';
				});
				address.isDefault = 'y';
				this.saveAddress(address, '设置成功');
			},
			findFromArr(arr, type = 'id', key){
				var result;
				arr.forEach(obj => {
					if (obj[type] === key) result = obj;
				});

				return result || {};
			},
			isPhone(phone){//add hk phone support
                phone = phone.replace(/(^\s*)|(\s*$)/g,"")
                return /^[1][3-9]\d{9}$/.test(phone) || /^(2|3|5|6|9)\d{7}$/.test(phone);
			},
			makeUpFullPath(){
				this.addressInfo.fullPathId = [this.provinceId, this.cityId, this.districtId].join('|');
				this.addressInfo.fullPathName = [this.province.provinceName, this.city.cityName, this.district.districtName].join('|');
			}
		},
		filters: {
			parsePath(str){
				if (!str) return '';
				return str.split('|').join(' ');
			},
			safety(str){
				if (!str || str.length !== 11) return str;
				str = str.split('');
				[3, 4, 5, 6].forEach(key => {
					if (str[key]) str[key] = '*';
				});

				return str.join('');
			},
			default: {
				read(val){
					return val === 'y';
				},
				write(val){
					return val ? 'y' : 'n';
				}
			}
		}
	});

</script>

<style type="text/css" src="./assets/phoenix.css"></style>
<style type="text/css" src="./assets/iconfont.css"></style>
<style lang="less" rel="stylesheet/less" scoped>
.special {
	width: 354px!important; height: 32px!important; line-height: 32px!important;
}
	.pay {
		display: flex;
		justify-content: center;
		background: #f8f8f8;
		color: #333333;
		> .part {
			position: relative;
			margin-bottom: 100px;
			padding-right: 0;
			height: 50px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			> div {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				span {
					margin-right: 30px;
					color: #ff653f;
				}
			}
			p {
				position: absolute;
				top: 55px;
			}
		}
	}
	.component-address {
		display: flex;
		justify-content: center;
		background: #f8f8f8;
		> .part {
			margin: 20px 0 10px;
			padding: 15px 30px;
			width: 1180px;
			background: #fff;
			.part-title {
				margin-bottom: 10px;
				h3, .h3 {
					font-weight: 700;
				}
			}
			> ul {
				display: flex;
				flex-wrap: wrap;
				margin: 0 -10px;
				> li {
					color: #333333;
					&:hover {
						cursor: pointer;
					}
					> .title {
						height: 60px;
						line-height: 60px;
						h3, .h3 {
							font-weight: bold;
						}
					}
					.body {
						height: 80px;
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: flex-start;
						&.add {
							align-items: center;
							justify-content: center;
							color: #cccccc;
							i {
								font-size: 40px;
							}
						}
					}
					.foot {
						height: 56px;
						line-height: 56px;
						a {
							font-weight: bold;
							margin-right: 10px;
						}
						a:link {
							color: #0074ff;
							text-decoration: none;
						}
						a:hover {
							color: #0074ff;
							text-decoration: underline;
						}
					}
					position: relative;
					margin: 0 7px;
					width: 270px;
					height: 200px;
					border: 1px solid #dbdbdb;
					margin-bottom: 10px;
					padding: 0 15px;
					&.choose, &.choose:hover {
						border: 2px solid #0074ff;
					}
					&:hover {
						border: 1px solid #999;
					}
					&.default {
						&:after {
							position: absolute;
							top: 0;
							right: 0;
							content: '默认';
							display: inline-block;
							height: 20px;
							width: 40px;
							background: #0074ff;
							color: white;
							text-align: center;
							line-height: 20px;
						}
					}
				}
			}
		}
	}

	#address-detail {
		width: 100%;
		height: 410px;
		padding: 0 20px;
		.title {
			height: 60px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom: 1px solid #dbdbdb;
			font-weight: bold;
			position: relative;
			i {
				margin: 0;
				position: absolute;
				right: 0;
				color: #333333;
				&:hover {
					cursor: pointer;
				}
			}
		}
		.body {
			padding: 15px;
			.item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 50px;
				label {
					display: inline-block;
					width: 75px;
					text-align: left;
				}
				input[type='checkbox'] {
					appearance: checkbox;
					margin-right: 10px;
				}
				.input-xs {
					width: 55px;
				}
				.input-md {
					width: 300px;
				}
				button {
					font-size: 18px;
					font-weight: bold;
				}
			}
		}
	}
	.warn {
		color: #ff653f;
	}
</style>