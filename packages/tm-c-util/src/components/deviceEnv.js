//判断设备所处的环境
let deviceEnv = {};
let ua = window.navigator.userAgent;

//是否微信
deviceEnv.isWeiXin = function () {
    return !!/MicroMessenger/i.exec( ua );
};

//是否移动移动端（不包括微信环境，用于移动端支付宝支付）
deviceEnv.isMobileWithoutWeixin = function () {
    let platform = ['android', 'iphone', 'iPad'];
    return platform.some((o , i) => {
        let RegExpTips = new RegExp(o, 'gi');
        return RegExpTips.test(window.navigator.userAgent);
    })
}

module.exports  = deviceEnv;