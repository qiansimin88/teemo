/**
 * 图片选择插件
 * @author wangtao
 */
CKEDITOR.plugins.add('videoupload', {
    init: function(editor) {
        editor.addCommand('videoupload', {
            exec: function(editor) {
                /**
                 * 开始图片选择 
                 */
                editor.fire('videoupload');
            }
        });
        editor.ui.addButton('videoupload', {
            label: '上传视频',
            icon: this.path + '/video.png',
            command: 'videoupload'
        });
    }
});