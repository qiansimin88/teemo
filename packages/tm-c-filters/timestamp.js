'use strict';

let floor = v => Math.floor(v);

module.exports = function(timestamp) {
    let date;

    if (typeof timestamp === 'number') {
        date = new Date(timestamp);
    } else {
        date = new Date((timestamp || '').replace(/-/g, '/'));
    }


    let now = new Date();

    let diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) {
        if (diff <= 1) {
            return '1秒前';
        }
        return floor(diff) + '秒前';
    } else if (diff < 3600) {
        return floor(diff / 60) + '分钟前';
    } else if (diff < 86400) {
        return floor(diff / 3600) + '小时前';
    } else if (diff < 604800) {
        return floor(diff / 86400) + '天前';
    } else {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
}