<template>
	<div class="threelogin-contain">
		<h4>
			<span class="splite"></span>
			<span style="text-align: center;font-size: 14px;">第三方账号登录</span>
			<span class="splite"></span>
		</h4>
		<ul class="ul-container">
			<li>
				<a class="iconWrap border-qq"
				   :href="qqUrl"
				   @click.prevent="goBind('qq')">
					<i class="threelogin tl-qq color-qq" style="font-size: 26px;"></i>
				</a>
			</li>
			<li>
				<a class="iconWrap border-wechat"
				   :href="wechatUrl"
				   @click.prevent="goBind('wechat_pc')">
					<i class="threelogin tl-wechat color-wechat"></i>
				</a>
			</li>
			<li>
				<a class="iconWrap border-weibo"
				   :href="weiboUrl"
				   @click.prevent="goBind('weibo')">
					<i class="threelogin tl-weibo color-weibo"></i>
				</a>
			</li>
		</ul>
	</div>
</template>
<script src="../utils/index.js"></script>
<style scoped lang="less">
	@import "../assets/iconfont.css";

	.threelogin-contain {
		width: 300px;
		h4 {
			color: #999;
			font-size: 14px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.splite {
				width: 91px;
				height: 1px;
				background: #dbdbdb;
				display: inline-block;
			}
		}

		.ul-container {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 12px 28px 0;
			a {
				text-decoration: none;
			}

			.iconWrap {
				width: 52px;
				height: 52px;
				border-radius: 50%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				i {
					font-size: 32px;
				}
			}
			.color {
				&-qq {
					color: #4ab7ed !important;
				}
				&-wechat {
					color: #04d588 !important;
				}
				&-weibo {
					color: #ff653f !important;
				}
			}
			.border {
				&-qq {
					border: 2px solid #4ab7ed;
					&:hover{
						background: #4ab7ed;
						&>i{
							color: #fff!important;
						}
					}
				}
				&-wechat {
					border: 2px solid #04d588;
					&:hover{
						background: #04d588;
						&>i{
							color: #fff!important;
						}
					}
				}
				&-weibo {
					border: 2px solid #ff653f;
					&:hover{
						background: #ff653f;
						&>i{
							color: #fff!important;
						}
					}
				}
			}
			/*i:hover {*/
			/*opacity: .4;*/
			/*}*/

			/*.threelogin {*/
			/*font-size: 52px;*/
			/*}*/
			/*.qq {*/
			/*color: rgb(68, 179, 222);*/
			/*}*/
			/*.weibo {*/
			/*color: rgb(255, 97, 121);*/
			/*}*/
			/*.wechat {*/
			/*color: rgb(45, 193, 0);*/
			/*}*/
		}
	}

</style>