<template>
<div class='item-wrap'>
    <div style='margin-bottom:6px;'>
        <label class='h3' :for="field.id">{{field.label}}</label>
        <span class='text-danger' v-if='field.required'>*</span>
        <span class='form-item-maohao'>:</span>
        <em class='text-danger' v-if='warnShow'>
          <i class='iconfont icon-gth'></i>
          <i>{{warnMsg}}</i>
        </em>
    </div>
    <slot>
        <!-- <input type="text" :id="field.id" :placeholder="field.placeholder" :field="field.name" v-validate="field.validate"> -->
    </slot>
</div>
</template>
<script type='text/javascript'>
import Phoenix from 'phoenix';
export default Phoenix.createView({
    data() {
        return {};
    },
    props: {
        'warnShow': {
            type: Boolean,
            default: false
        },
        'warnMsg': {
            type:String,
            default: ''
        },
        'field': {
            default: function() {
                return {
                    id: '',
                    label: '',
                    name: '',
                    required: false
                };
            }
        }
    },
    components: {},
    ready() {},
    methods: {},
    watch: {
        'field': function(val) {},
        'warnObj': function(val) {}
    }
});
</script>
<style lang="less" scoped>@import "./assets/style.less";
@import "./assets/phoenix_ui.less";
.item-wrap{
  font-size:@font_size_normal;
  margin-bottom: 16px;
  .icon-gth{
    font-size: 16px;
  }
}
</style>
<style type="text/css" src="./assets/iconfont/iconfont.css"></style>
