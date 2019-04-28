# 手机端各种头部

记录在手机端碰到的各种头

    npm install tm-m-headers --save

默认body的样式是这样的

    .body {
        height: 100%;
        padding-top: .88rem;
    }

根据*type*字段得到头的类型

引入:
   
    import mHeader from 'tm-m-headers';

## 普通


    <m-header title="title">
        <div slot="middle"></div>    
        <div slot="right"></div>    
    <m-header>

## 返回
    <m-headder title="title" back="{路由对象 或者 函数}">
        <div slot="middle"></div>    
        <div slot="right"></div>
    </m-headder>

    单击返回的时候，会自动播发 **back** 事件
## 搜索

    <m-header title="ttile">
        <div slot="left"></div>
        <div slot="right"></div>
    </m-header>
