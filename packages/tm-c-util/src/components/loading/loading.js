import Vue from 'vue';
import loading from 'phoenixUI/loading';
let Loading = Vue.extend(loading);
let instance = new Loading({ el: document.createElement('div') });
let timer = null;
instance.$appendTo(window.document.body);

function getInstance(duration = 1000) {
    if (timer) {
        clearTimeout(timer);
    }
    instance.show = true;
    timer = setTimeout(() => {
        instance.show = false;
    }, duration);
}
getInstance.show = function() {
    if (timer) { clearTimeout(timer); };
    instance.show = true;
};
getInstance.off = function() {
    if (timer) { clearTimeout(timer); };
    instance.show = false;
};
export default getInstance;