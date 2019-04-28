/**
 * 计算页面基础字体
 */
var BASE_FONT_SIZE = 100;

function calculate() {
    var docEl = document.documentElement;
    var clientWidth = docEl.clientWidth;
    if (clientWidth) {
        docEl.style.fontSize = BASE_FONT_SIZE * (clientWidth / 750) + 'px';
    }
}
export default function() {
    if (document.addEventListener) { // 不同的情况做兼容
        var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        window.addEventListener(resizeEvt, calculate, false);
        document.addEventListener('DOMContentLoaded', calculate, false);
        calculate();
    }
}