/**
 * 在文本中插入一个标签
 * @author wangtao
 * 备注: 目前用于插入@好友的标签功能
 */
CKEDITOR.plugins.add('insertlabel', {
    requires: 'widget',
    icons: 'insertlabel',
    init: function(editor) {
        editor.widgets.add('insertlabel', {
            button: 'at好友',
            template: '<a data-userid="userId"></a>',
            init: function(ele)  {
                this.data.name = this.element.$.innerHTML;
                this.data.userId = this.element.$.getAttribute('data-userid');
            },
            data: function(ele) {
                this.element.setText(this.data.name);
                this.element.setAttribute('data-userid',this.data.userId);
            },
            upcast: function( element ) {
                return !!element.attributes['data-userid'] 
            }
        })
    }
});