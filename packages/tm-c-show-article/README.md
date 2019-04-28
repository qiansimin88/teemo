文本展示区域，跟编辑器组件tm-c-editor是好基友，一个负责展示，一个负责输入，

该展示区域主要解决

* 解决文本中的at问题，将at处理成链接
* 解决pc与移动端的字体大小问题
* 解决图片的大小问题

# 使用

import articleArea from 'tm-c-show-article';

    <article-area :content="你的页面html"></article-area>

    1.1.1 正式PC show-article 版本

就可以了 