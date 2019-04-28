<template>
  <div class='emptyContain'>
    <span><i class='iconfont iconClass' :class='icon'></i></span>
    <span>{{msg}}</span>
  </div>
</template>
<script type='text/javascript'>
import Phoenix from 'phoenix';
export default Phoenix.createView({
  props:{
    icon:{
      type:String,
      default:'icon-empty-quesheng'
    },
    msg:{
      type:String,
      default:'抱歉，没有匹配的结果！'
    }
  },
	data() {
		return {
		};
	},
	components: {
	},
	ready() {
	},
	methods: {
		update() {
		}
	}
});
</script>
<style lang="less" scoped>
  @import "./assets/iconfont/iconfont.css";
.emptyContain{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ccc;
}
.iconClass{
  color:#ccc;
  line-height: 160px;
  font-size: 180px;
}
</style>
