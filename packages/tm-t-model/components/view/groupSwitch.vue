<template>
    <div class="group-switch">
        <label class="group-order-radio">
            <input type="radio" :value="true" : v-model="isGroup"/>
            <div class="group-radio-wrap" :class="{ active: isGroup }">
                <div class="radio-btn"></div>
                <div class="radio-content">
                    <span>￥{{ groupPrice }}<h5>{{`${groupDesc}天交付`}}</h5></span>
                </div>
            </div>
        </label>
        <label class="group-order-radio">
            <input type="radio" :value="false" v-model="isGroup"/>
            <div class="group-radio-wrap" :class="{ active: !isGroup }">
                <div class="radio-btn"></div>
                <div class="radio-content">
                    <span>￥{{ defaultPrice }}<h5>{{`${desc}天交付`}}</h5></span>
                </div>
            </div>
        </label>
    </div>
</template> 
<script>
    export default {
        props: {
            groupPrice: String, 
            defaultPrice: String,
            groupDesc: String,
	        desc: String,
            isGroup: {
                type: Boolean,
                default: true,
                twoWay: true
            }
        },
        data() {
            return {
            };
        },
        created (){
        },
        methods: {
        }
    };  
</script>
<style lang="less">
    .group-switch { width: 85%; }
    .group-order-radio { display: block; }
    .group-radio-wrap { 
        display: flex; cursor: pointer; border-radius: 4px;
        height: 50px; padding: 15px; font-size: 18px; color: #666;
        span { position: relative; }
        h5 {
            color: #fff;background: #ff653f;
            border-radius: 16px;
            padding: 10px 6px;
            padding-left: 2px;
            border-bottom-left-radius: 0px;
            line-height: 0;
            text-align: center;
            white-space: nowrap;
            position: absolute; top: -10px; left: 105%; font-size: 12px;
        }

        h5:before{
            content: '';
            position: absolute;
            top: 18px;
            left: -2px;
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 8px solid #ff653f;
            transform:rotate(24deg);
            -ms-transform:rotate(24deg); 	/* IE 9 */
            -moz-transform:rotate(24deg); 	/* Firefox */
            -webkit-transform:rotate(24deg); /* Safari 和 Chrome */
            -o-transform:rotate(24deg);
        }

        p { font-size: 12px; color: #999; display: inline; position: relative; left: 45px; }
        &.active {
            height: 60px; background: #f8f8f8; color: #ff653f; font-size: 24px;
            .radio-content { line-height: 30px; }
            span { font-weight: bold; }
        }
    }
    .radio-btn {
        width:20px; height:20px; border-radius: 50%; 
        background: #f8f8f8; align-self:center;
        border:1px solid #dbdbdb;
    }
    .radio-content {
        vertical-align: middle; text-indent: 5px; line-height: 20px; width: 100%;
    }
    .group-order-radio {
        input {
            display: none;
            &:checked ~ .group-radio-wrap > .radio-btn {
                &:before {
                    content : ''; display: block; width:10px; height:10px; 
                    background: #4ab7ed; border-radius:50%; margin:4px;
                }
            }
        }
    }
</style>




