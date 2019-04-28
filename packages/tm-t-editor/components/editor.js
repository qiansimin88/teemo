/**
 * 对编辑器实例的操作
 */
import Config from '../config';
import Filter from './filter';
/*eslint-disable */
class Editor {
    /**
     * @param {name} String 编辑器实例的名称   
     */
    constructor() {
        this.name = null;
        this.title = null;
        this.content = null;
        this.events = {};
        this.instance = null;

        this.pasteAsPlainText = false;
    }
    _loadJs(address) {
        return new Promise((resolve, reject) => {
            let scr = document.createElement('script');
            scr.type = 'text/javascript';
            scr.src = address + 'ckeditor.js';
            scr.async = true;
            scr.onload = e => {
                return resolve(e);
            };
            scr.onerror = e => {
                return reject(e);
            };
            document.getElementsByTagName('head')[0].appendChild(scr);
        });
    }
    _getCKEditor() {

    }
    install(name, config, address) {
        this._loadJs(address).then(data => {
            var itemsArr = config.extraPlugins.split(','); //自定义配置项数组
            //此判断为找出自定义配置项中是否配置了source（源码项），如配置了则保留，如为配置则删除CKeditor默认配置中的source项
            if (itemsArr.indexOf('source') > -1) {
                for (var i = 0; i < itemsArr.length; i++) {
                    if (itemsArr[i] == 'source') {
                        itemsArr.splice(i, 1);
                        break;
                    }
                }
                config.extraPlugins = itemsArr.join(',');
            } else {
                for (var i = 0; i < Config.toolbar_threeDker.length; i++) {
                    if (Config.toolbar_threeDker[i].name == 'source') {
                        Config.toolbar_threeDker.splice(i, 1);
                        break;
                    }
                }
            }


            // 加载编辑器
            config.extraPlugins = config.extraPlugins ?
                config.extraPlugins + ',' + Config.extraPlugins :
                Config.extraPlugins;
            // 加载内部css
            config.contentsCss = address + 'custom.css';
            this.name = name;
            CKEDITOR.replace(this.name, Object.assign(Config, config));
            this.instance = this.getIns();
            // 加载事件
            Object.keys(this.events).forEach(v => {
                this.instance.on(v, this.events[v]);
            });
            // 加载标题
            this.instance.title = this.title;


            //监听用户的键盘事件-keyup
            var callKeyup = this.events.keyup;
            CKEDITOR.instances[this.name].on("instanceReady", function() {
                //set keyup event  
                this.document.on("keyup", function(e) {
                    callKeyup(e.data.$.key);
                });
            });


            // 对粘贴文本进行内容过滤
            this.instance.on('paste', function(e) {
                    let content = '';
                    let filter = new CKEDITOR.htmlParser.filter({
                        text: function(value) {
                            content += value;
                        }
                    });

                    let fragment = CKEDITOR.htmlParser.fragment.fromHtml(e.data.dataValue)
                    filter.applyTo(fragment);
                    e.data.dataValue = content;
                })
                // 加载内容
            this.instance.setData(this.content);
        }).catch(err => {
            console.warn(err);
            throw new Error('editor load err');
        });
    }
    on(name, callback) {
        if (!name || !callback) {
            throw new Error('event name & callback must be defined');
        }
        if (this.instance) {
            this.instance.on(name, callback);
        } else {
            this.events[name] = callback;
        }
    }
    getIns() {
            if (this.name && CKEDITOR && CKEDITOR.instances[this.name]) {
                return CKEDITOR.instances[this.name];
            } else {
                throw new Error('instance not found');
            }
        }
        /**
         * 获取编辑器的内容, 包含html
         */
    getContent(Str) {
            return CKEDITOR.instances[this.name].getData();
        }
        /**
         * 插入标签
         */
    insertElement(ele) {
            let element = CKEDITOR.dom.element.createFromHtml(ele);
            this.instance.insertElement(element);
        }
        /**
         * 取得文本内容
         */
    getText() {
            // 解决placeholder在获取文本中的占位问题
            return this.getIns().document.getBody().hasClass('placeholder') ?
                '' :
                this.getIns().document.getBody().getText();
        }
        /**
         * 设置编辑器的内容
         */
    setContent(content) {
            if (this.instance) {
                CKEDITOR.instances[this.name].setData(content);
            } else {
                this.content = content;
            }
        }
        /**
         * 设置编辑器的头部
         */
    setTitle(title) {
            this.getIns().title = title;
        }
        /**
         * 获取编辑器内部指定html
         * @param Str 需要的标签,以','号分隔
         * @return [] 标签的集合,以数组显示
         */
    getContentByFilter(Str) {
        let tags = Str.split(',');
        let filterOpt = { elements: {} };
        let res = [];
        for (let i in tags) {
            filterOpt.elements[tags[i]] = (element) => {
                res.push(element.getOuterHtml());
            }
        }
        let filter = new CKEDITOR.htmlParser.filter(filterOpt);
        let fragment = new CKEDITOR.htmlParser.fragment.fromHtml(this.getContent());
        filter.applyTo(fragment);
        return res;
    }
}
/*eslint-eable */
export default Editor;