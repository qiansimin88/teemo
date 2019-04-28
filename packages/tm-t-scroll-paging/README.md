## 使用方式

```
    <paging 
        :total="" 
        @paging-jump="fetchData">
    </paging>

    import scrollPage from 'tm-t-scroll-paging';

    export default {
        name: 'vue-page',
        data() {
            return {
                isClient: process.evn.VUE_ENV
            }
        },
        components: { scrollPage },
        methods: {
            fetchData( pageIndex, append, fetchCb ) {
                // pageIndex: 请求数据的页数
                // append: true: dataList.concat( data.result ) )
                //         false: dataList = data.result
                
                ps: append 代表是否滚动翻页
            }
        }
    };

    props: 
        total (Number) : 总页数

        showLoading (Boolean) : 请求数据时，是否显示PhoenixUI中的loading，默认为true
                                需要在调用在加载完数据之后调用fetchCb
                                
        @paging-jump (Function) : 绑定一个请求数据的方法。
                                  当页面加载，点击翻页，滚动翻页，重置到第一页
                                  该方法会被执行
                                  

    重置到第一页：
        vue(1.x): this.$broadcast( 'paging-reset', query )
        vue(2.0): this.$refs.paging.resetPage( query );

        ps: query(参数对象)会添加到URL上


    main.js中( 添加支持 data/1.html 的路由 )：

        // 这里解决参数可有可无的情况( 没有视为第一页 )
        let handler = {
            name: 'root',
            component( resolve ) {
                require( [ './views/dataList.vue' ], resolve );
            },
            seo: true
        };

        Phoenix.createView({
            '/': handler,
            '/:pageNum': handler
        });


    ps: 你的项目中的页面跳转，请使用v-link，而非href

        2.0中( 浏览器渲染时再编译paging ): <paging v-if="isClient"></paing>
```