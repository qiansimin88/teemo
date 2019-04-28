## 使用方式

```
     // 1.0
    <multiselect 
        :selected="selected"
        :options="options"
        key="",
        label="",
        :searchable="true",
        :multiple="false",
        :placeholder="请选择"
        :size="sm OR md OR lg"
        :tplable="false"
        :tplstyle=""
        @update="update"
        @fetch="fetch" >
    </multiselect>
    
    // 2.0
    <multiselect
        :selected="selected"
        :options="options"
        :multiple="true"
        :searchable="true"
        vkey="k"
        vlabel="v"
        vstyle=""
        @update="select"
        @tag="addTag">
    </multiselect>

    import multiselect from 'tm-t-multiselect';

    export default {
        name: 'vue-page',
        data() {
            return {
                // 字符串，对象，或者数组
                selected: [],
                options: []
            }
        },
        components: { multiselect },
        methods: {
            // 该方法必须配置
            update( v ) {
                // v 为当前选中项( 单选或多选中的option中的值 )
                this.selected = v;
            },

            // 如果通过搜索异步获取数据，则通过该发方法请求数据
            fetch( v ) {
                // v 为当前搜索框中输入的关键字
                this.api(url)
                    .post(param)
                    .then( data => {
                        this.options = data.map( v => {
                            return { k:'', v: '' };
                        });
                    });
            }
        }
    };

    props: 
        selected ( String OR Object OR Array ):
            表示当前选中的数据，父级通过 update 方法获取选中数据后，赋值该字段
            其数据类型由 options 和 multiple 字段决定

        options: ( Array ):
            下拉选项中的备选项，该数组可为简单数组, 或对象数组
            简单数组: [ 1, 2, 3, 4], selected 字段为 String; 
            对象数组: [ { k: 'k', v: 'v' }, { k: 'k', v: 'v' } ], selected 字段为Object
            如果是多选的情况下 ( multiple = true )，selected 为上述两者的数组
            不论是哪种类型，selected 都是 options 的子集   

        key ( String ): 对象比较时依据的字段，options 是对象数组时，该字段必须
        label ( String ): 对象选中是显示的字段，options 是对象数组时，该字段必须

        说明: 2.0中 key 和 label 的字段名为: vkey 和 vlabel
        
        searchable ( Boolean ): 是否搜索
        multiple ( Boolean ): 是否多选

        placeholder ( String ): 输入提示

        @update ( Function ): 
            参数为当前选中的数据，
            每次选择或是删除时，通知父级当前选中数据，获得数据赋值给 selected 字段

        @fetch ( Function ): 
            参数为当前输入框中的内容，
            异步搜索数据的回调方法，请求获取的数据赋值给 options 字段

        @tag ( Function ): 
            参数为当前添加的标签的内容
            支持输入回车添加标签的回调方法，获得标签值后，需要转化和 options 中的元素一样的对象
            如：options: [ { k: 'k', 'v': 'v' } ], tag: { k: '', v: v }
            然后，this.selected.push( tag ), 同时可能还需要将该tag发送给后端

        tplable (是否自定义下拉框中的HTML): 
            true 的情况，需要Vue全局注册一个 name="option" 的 partial
            如：Vue.partial( 'option', '<div v-text="v[label]"></div>' );
            其中 v 代表 option 字段的每个迭代值( 即 v-for="v in option" )

        tplstyle ( Object ): 
            设置下拉框中每个选项div的style，当 tplable=true 时，特别需要足够的高度，来满足自定义的HTML
            如：{ height: '50px' } 下拉框中每个选项的div高度为 50px,

        size ( String ): sm, md, lg 取其一

        style ( Object ): 自定样式 ( 2.0时，字段名为: vstyle )

```