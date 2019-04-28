<template>
	<div class="wrap">
		<div class="flex-row">
			<input v-model="valiCode" class="input input-height codeInput" :style="{'width':inputWidth+'px'}"
				   :placeholder="`输入${phKey}`" autocomplete="off" type="text"/>
			<button :class="['btn','btn-sm','valiCodebtn',isProcess ? 'valiCodebtn-disable':'btn-primary']"
					:style="{'width':btnWidth+'px'}"
					@click.stop="getValiCode" v-text="title"></button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import Phoenix from 'phoenix';
	import { dataset } from 'phoenix';

	export default Phoenix.createView({
		name: 'valiCode',
		components: [],
		props: {
			'btnWidth': {
				default: '120'
			},
			'inputWidth': {
				default: '170'
			},
			'action': {//must be return promise
				type: Function,
				default: function () {
				}

			},
			'phKey': {
				type: String,
				default: '短信验证码'
			},
			'valiCode': {
				type: String,
				twoWay: true
			},
			'count':{
				default:5
			}
		},
		data(){
			return {
				timer: null,
				time:'',
				isProcess:false
			};
		},
		ready(){
			let countDownTimeExt = this.hibernate.countDownTime && this.hibernate.countDownTime > 0;
			this.time = countDownTimeExt ? this.hibernate.countDownTime : this.count;
			if(this.time && countDownTimeExt) this.run();
		},
		methods: {
			getValiCode(){
				if( this.isProcess ) return;
				if (this.action && typeof this.action === 'function') {
					let promiseRet = this.action();
					promiseRet.then(data=>{
						if(data){
							this.run();
						}
					}).catch(err=>{
						err = '';
					});
				}
			},
			run () {
				clearInterval(this.timer);
				this.time = this.hibernate.countDownTime || this.count;
				this.timer = setInterval(() => {
					if (this.time > 0) {
						this.time = this.time - 1;
						this.isProcess = true;
						this.hibernate.countDownTime = this.time;
						if (this.time === 0) {
							this.isProcess = false;
							this.stop();
						}
					}
				}, 1000);
			},
			stop () {
				clearInterval(this.timer);
			}
		},
		computed:{
			'title': function(){
				return this.isProcess?`${this.time}s后重新获取`:`获取${this.phKey}`;
			}
		}
	});
</script>
<style lang="less" scoped>
	@import "./assets/phoenix.min.css";
	/*@import "./assets/common.less";*/

	.valiCodebtn {
		height: 38px;
		font-size: 14px;
	}
	.valiCodebtn-disable{
		cursor: not-allowed;
		background: #ccc;
		border-color: transparent;
	}

	.input-height{
		height: 40px;
	}

	.codeInput {
		margin-right: 10px;
	}

</style>
