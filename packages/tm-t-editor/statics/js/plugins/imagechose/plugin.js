/**
 * 图片选择插件
 * @author wangtao
 */
CKEDITOR.plugins.add('imagechose', {
    init: function(editor) {
        editor.addCommand('imagechose', {
            exec: function(editor) {
                /**
                 * 开始图片选择 
                 */
                editor.fire('imagechose');
            }
        });
        editor.ui.addButton('imagechose', {
            label: '上传图片',
            icon: this.path + '/img.png',
            command: 'imagechose'
        });
    }
});