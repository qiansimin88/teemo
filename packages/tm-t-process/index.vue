<template> 
    <!--头部的进度  （表示当前页面是进行中的哪一步的意思 🙄）-->
    <div class="header-progress">
        <div class="progress-contenter">
             <div class="logo-area" v-text="title">
            </div>
            <div class="page-progress">
                <div :class="{active: active >= $index}" v-for="o in progreeArray" :style="{width: singerWidth + 'px'}" class="progress-part">
                    <span v-text="o"></span>
                    <div class="line"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type='text/javascript'>
	import Phoenix from 'phoenix';
	export default Phoenix.createView({
		name: 'headerProgress',
		data (){
			return {
				
			};	
		},
        props: {
            'title': {
                type: String,
                required: true
            },
            singerWidth: {
                type: String,
                default: '176'
            },
            progreeArray: {     //'购物车', '确认', '支付订单']
                type: Array,
                required: true 
            },
            active: {
                type: Number
            }
        },
		components : [	
		],
		ready (){

		}
	});					

</script>		
<style lang="less" scoped>
@bordercolor: #dbdbdb;
.header-progress {
    border: 1px solid @bordercolor; width: 100%;
    .progress-contenter {
        width: 1180px; margin: 0 auto; height: 120px; display: flex; justify-content: space-between;
    }
    .logo-area {
        background: url('https://test-img.3dker.cn/98c46a642c6880fe6d0224e1ee26cf3b') no-repeat left center;
        background-size: 71px 30px;
        height: 100%; line-height: 120px; text-indent: 75px; color:#999; font-size: 30px;
    }   
    .page-progress {
        display: flex; padding-top: 40px;
    }
    .progress-part {
        &.active {
            .line {
                background: #0074ff;
                   &::after {
                    display: block; width: 12px; height: 12px; border-radius: 50%; content: ''; background: #0074ff; margin: 0 auto; position: relative; top: -5px;
                }
            }
            span {
                color: #0074ff;
            }
        }
        text-align: center; 
        .line {
            width: 100%; height:2px; background: #dbdbdb; margin-top: 8px;
            &::after {
                    display: block; width: 12px; height: 12px; border-radius: 50%; content: ''; background: #ccc; margin: 0 auto; position: relative; top: -5px;
            }
        }
        span {
            color: #ccc;
        }
    }
}
</style>	