const toast = require('./toast.vue');
let Toast = Vue.extend(toast);
let instance = new Toast({ el: document.createElement('div') });
instance.$appendTo(window.document.body);

function getInstance(msg, duration) {
    instance.show = true;
    instance.msg = msg;
    instance.duration = duration || 700;
    return instance;
}
export default getInstance;