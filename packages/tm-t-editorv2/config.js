/**
 * 编辑器的配置文件
 */
/* eslint-disable */
let config =  {
    langguage: 'zh-cn', 
    removePlugins: 'elementspath',
    extraPlugins: 'widget,confighelper',
    fontSize_defaultLabel: '14',
    fontSize_sizes: '14/14px;16/16px;20/20px;24/24px;28/28px;36/36px;',
    allowedContent: true,
    extraAllowedContent: 'a(*)'
};
config.toolbar = 'threeDker';
config.toolbar_threeDker = [
    { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','-','RemoveFormat' ] },
    { name: 'clipboard', items: [ 'Undo','Redo' ] },
    '-',
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList' , '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    '-',
    { name: 'colors', items: [ 'TextColor' ] },
    { name: 'styles', items : [ 'FontSize' ] },
    '-',
    { name: 'insert', items: [ 'imagechose', 'Insertlabel' ] },
    { name: 'links', items: [ 'Link','Unlink' ] },
    { name: 'tools', items : [ 'Maximize' ] }
]
export default config; 