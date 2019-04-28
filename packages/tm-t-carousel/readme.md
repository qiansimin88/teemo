
### PC轮播组件

#### 使用方法
import:
```
    import { carousel,CarouselItem } from 'tm-t-carousel';
```


HTML：
```
        <carousel :indicators="true" :auto="2000"  :loop="true"  :style="{height: bannerHeight}">
            <carousel-item v-for="img in imgs">
                <img class="banner" :src="img" >
            </carousel-item>
        </carousel>
```
**
   // carousel-item标签内为轮播内容，样式需要自定义 
**

props：
-------------------------------------------------------------   
| name        | type     | default  | description                                                       |   
| ----------- |----------| -------- | ----------------------------------------------------------------- |   
| loop        | Boolean  | true     | 是否循环播放                                                        |   
| auto        | Number   | 3000     | 轮播时的interval                                                   |        
| indicators  | Boolean  | true    | 是否开启屏点（记录轮播index的圆点）                                    |   
| onSlidEnd   | Function | -        | 轮播切换完成时的回调                                                 |   
-------------------------------------------------------------
