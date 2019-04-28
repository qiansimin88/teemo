# 项目的一些通用的方法,欢迎补充
* 手机端全局的字体大小设置
* toast函数加载
* loading函数加载

# 说明 

## 字体大小设置

从前老💰开天辟地,做了个项目叫**mobile**,一个苦逼实习生在里面找到了个计算字体大小的办法，现在抽象出来，供后世膜拜

### 使用方法

新建一个文件**.js**，写入:
    
        import { computedSize } from 'tm-c-util';
        computedSize();

在项目根目录找到**index.html**加入标签**script**,引入上述js文件

## toast，loading函数加载

引入: 
        import { toast, loading } from 'tm-c-util';

        toast('这里输出弹出的内容'[, 这里写入时间])

        loading.show(); // 页面弹出Loading标识
        loading.off(); // 页面关闭Loading标示

        loading([这里写入时间|默认1s]); // 页面加载Loading标识1s


 


