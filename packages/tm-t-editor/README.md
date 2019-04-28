# 编辑器接入
    
    import editor from 'tm-t-editor';

然后将该目录中的**statics**中的**js**文件拷贝到你的项目的**statics**文件中

# 编辑器的说明

根据ckeditor扩展而得，可以通过this.editor直接拿到ckeditor的实例，具体看源代码。

编辑器编辑的文本在展示的时候，根据情况可能要用组件tm-c-show-article，具体以需求而定

# 暴露出的属性

    <editor
        title="title"                        --> 编辑器的标题 {String}
        :width="width"                        --> 编辑器的宽度 {Number}
        :height="height"                      --> 编辑器的高度 {Number}
        :placeholder="placeholder"                 --> placeholder {String}
        plugins="plugins"                  --> 插件 {String} 插件之间逗号分隔
        remove-plugins="removePlugins"      --> 需要去除的插件 {String} 插件之间逗号分隔
        :load-addr                            --> 编辑器ckeditor.js的所在目录 例如： /statics/ckeditor/js/  
        :img-upload-addr="imgUploadAddr"      --> 图片的上传地址 {String}
        :get-content.sync="getContent"             --> 获取编辑器的内部值(html)  {Function} 最早在onEditorReady播发之后调用
        :set-content.sync="setContent"             --> 向编辑器里面插入值(初始化) {Function}
        :get-text.sync="getText"                --> 获取编辑器的内部值(不包含html) {Functuin} 最早在onEditorReady播发之后调用
        :on-change="onChange"                 -->编辑器内容变化的回调{Function}
    ></editor>

# 事件

## *onEditorReady*

在编辑器加载完成之后，会播发,获取编辑器内部值或者向编辑器内部插入值，应当在此时间播发之后进行


## *onEditorInsertImg(img)*

在编辑器插入图片之后会触发

# **插件**

## 说明

编辑器编辑器基础附带很多插件，自带的的插件可以通过**removePlugins**去除，额外的插件通过**plugins**添加,额外的插件如下

## 图片上传

    plugins= 'imagechose'
    :img-upload-addr="imgUploadAddr"

图片上传，插入插件，用于向编辑器内部插入图片,同时要给出图片上传地址，按照cdnKey自动转成1e_1c插入

## at好友

    plugins= 'insertlabel'

相关事件:


## 视频上传
plugins = 'videoupload'
:file-upload-addr="fileUploadAddr"

### onClickLabel

编辑器按钮被点击发送的事件

### onLabelInsert(userId, name)

向编辑器插入标签 ,编辑器会插入

    <a data-userid="{{userId}}">{{name}}</a>


# 维护说明

## 关于文字处理

文字在修改大小的时候，加入了**data-size**属性，用于展示时候的处理.在源代码中搜索**wangtao**,可以找到相应的地方

## 关于图片的处理

在插入的图片的时候加入了**data-key**属性，该属性指向阿里云cdn-key, **data-width,data-height**属性指向该图片的大小

## 关于placeholder

placeholder用的是confighelper插件，在插入的地方修改了源码，让它的默认样式与我们一致

## 关于at的处理

at好友功能在社区中做的，用的是weiget插件，修改了源码，将他默认的div标签修改成为p标签，并且修改了样式与添加了at事件，具体在代码中搜索

##注意：1.20版本为不带源码功能之编辑器
**wangtao**
