const obj = {
	openApp: function (openUrl, path, callback) {
		function checkOpen(cb) {
			var _clickTime = +(new Date());

			function check(elsTime) {
				if (elsTime > 5000 || document.hidden || document.webkitHidden) {
					cb(true);
				} else {
					cb(false);
				}
			}

			//启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
			var _count = 0, intHandle;
			intHandle = setInterval(function () {
				_count++;
				var elsTime = +(new Date()) - _clickTime;
				if (_count >= 100 || elsTime > 5000) {
					clearInterval(intHandle);
					check(elsTime);
				}
			}, 20);
		}
		// 在ifr中打开app， 后改为location.href实现
		// var ifr = document.createElement('iframeApp');
		// ifr.style.display = 'none';
		// document.body.appendChild(ifr);
		// setTimeout(() => {
		// 	document.body.removeChild(ifr);
		// }, 2000);
		if (callback) {
			checkOpen(opened => {
				callback && callback(opened);
			});
		}
		let href = "";
		const BrowserInfo = require("./browerInfo");
		if(BrowserInfo.isWeixin || BrowserInfo.isQQInnerBrowser || BrowserInfo.isQQBrowser){// 腾讯系
			href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.shining3d";
		}else{
			href = openUrl;
		}
		window.location.href = href;

	}
};
module.exports = obj;