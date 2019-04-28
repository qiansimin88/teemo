module.exports = {
    count: require('./count'),
    timestamp: require('./timestamp'),
    shorter: require('./shorter'),
    formatSeconds: function(v) {
        let _v = 0;
        let ret = '';
        if ((_v = v / 86400) > 0) {
            ret += _v.toFixed(0) + '天 ';
            v %= 86400;
        }
        if ((_v = v / 3600) > 0) {
            ret += _v.toFixed(0) + '小时 ';
            v %= 3600;
        }
        if ((_v = v / 60) > 0) {
            ret += _v.toFixed(0) + '分钟 ';
            v %= 60;
        }
        ret += v.toFixed(0) + '秒 ';

        return ret;
    }
};