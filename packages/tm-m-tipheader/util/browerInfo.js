const obj =  {
	userAgent: navigator.userAgent.toLowerCase(),

	isAndroid: Boolean(navigator.userAgent.match(/android/ig)),

	isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),

	isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),

	isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),

	isQQBrowser: Boolean(navigator.userAgent.match(/MQQbrowser/ig)),

	isQQInnerBrowser: Boolean(navigator.userAgent.match(/mobile Mqqbrowser/ig)),

	isChrome: navigator.userAgent.toLowerCase().indexOf("chrome") !== -1
};
module.exports = obj;