## 使用方式

```
	<tm-t-modal 
        title="title"
        :show.sync="shown"
        :submit="submit">
        <div class="modal-form">
            <div class="form-item">
                <span class="form-label">物流公司:</span>
                <input type="text" placeholder="请输入物流公司" v-model="val1">
            </div>
            <div class="form-item">
                <span class="form-label">物流单号:</span>
                <input type="text" placeholder="请输入物流单号" v-model="val2">
            </div>
        </div>
    </tm-t-modal>

	import tmTModal from 'teemo/tm-t-modal';

	export default {
		name: 'vue-page',
		data() {
			return {
				shown: false,
                val1: '',
                val2: ''
			}
		},
		components: { tmTModal },
		methods: {
            submit() {
                ...
            }
		}
	};

	props: 
		title: String, 模态框的标题
		show.sync: Boolean, 是否显示 
        submit: Function, 确定Btn绑定的回调方法
```