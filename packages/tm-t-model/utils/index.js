/* eslint-dsiable */
var dfsIdHashMap = {};

export function dfsId2Name(key) {
	return dfsIdHashMap[key];
}

export function saveDfsId(key, map) {
	dfsIdHashMap[key] = map;
}
export function generatorImg(dfsId, size, x, y) {
	return `${process.env.CDN}/preview/${dfsId}/${x}_${y}@${size}w_${size}h_1l_80q.jpg`;
}

export function parseData(body) {
	try {
		return JSON.parse(JSON.parse(JSON.stringify(body)));
	} catch (e) {
		return {};
	}
}

export function toDoubleDecimal(num) {
	return Number(Math.round(num + "e2") + "e-2").toFixed(2)
}

/*精确乘法*/

/*
 *
 *
 * */
export function accMul() {
	var args = Array.prototype.slice.call(arguments);
	var sum = 0;
	var result;

	result = args.map(num => {
		try {
			sum += num.toString().split('.')[1].length;
		} catch (e) {}
		return num;
	}).reduce((cur, next) => {
		if (cur === undefined) cur = 1;
		cur = Number(cur.toString().replace('.', '')) * Number(next.toString().replace('.', ''));
		return cur;
	}, undefined);

	return result / Math.pow(10, sum);
}

//根据min max 计算长度
export function distance(min, max) {
	return (Number(max) - Number(min)).toFixed(3);
}

export function parseModelData(body) {
	var content = parseData(body);
	content.getValue = parseData(content.getValue);
	var v = content.getValue;
	var box = content.getValue.bbox;
	var errorText = "";
	var error = false;

	//non-manifold 非流型
	//hole 洞
	//normal-flipped 翻转
	//破损也照样下单 嘿嘿  2018.1.18
	if (!v || !box || (v.meshState && v.meshState.hole && v.meshState.hole.type && v.meshState.hole.type === "big")) {
		//解析失败
		if (v.meshState && v.meshState.hole && v.meshState.hole.type && v.meshState.hole.type === "big") {
			errorText += "您的模型有";
			// if(v.meshState.hole){
			errorText += v.meshState.hole.holeEdgeCnt + "处破损的洞，";
			// }
			// else if(v.meshState["non-manifold"]){
			//   error_text += v.meshState["non-manifold"] + "处非流形结构，";
			// }
			// else if(v.meshState["negative-volume"]){
			//   error_text += "负体积情况存在，";
			// }
			// else{
			//   error_text += "其它影响打印的问题存在，";
			// }
			error = true;
			errorText += "请修复问题后再尝试，谢谢！";
		}

		//如果错误再次弹客服弹框

		// let doc = document.createElement('script');
		//     doc.setAttribute('src', '//wp.qiye.qq.com/qidian/2852138681/1d7ea92e6f17f27ba25357cd0aff896c');
		//     document.getElementById('qidianContain').appendChild(doc);

		// let qidianContain = document.querySelector('[id^=qidian_wpa]');
		// qidianContain.style.display = 'block';

		// return {
		//     "dfsId": content.dfsId,
		//     "errorText": errorText,
		//     "error": true
		// };
	}

	//x, y, z
	var x = distance(box.min.x, box.max.x);
	var y = distance(box.min.y, box.max.y);
	var z = distance(box.min.z, box.max.z);

	return {
		"error": error,
		'errorText': errorText,
		"dfsId": content.dfsId,
		"box": {
			"x": x,
			"y": y,
			"z": z
		},
		"volume": Math.abs((v.volume / 1000).toFixed(2)).toString(),
		"area": (v.surfaceArea / 100).toFixed(2)
	};
}

export function remoteLoad(url, hasCallback) {

	return createScript(url);

	/**
	 * 创建script
	 * @param url
	 * @returns {Promise}
	 */
	function createScript(url) {

		var scriptElement = document.createElement('script');
		document.body.appendChild(scriptElement);

		var promise = new Promise((resolve, reject) => {
			scriptElement.addEventListener('load', e => {
				removeScript(scriptElement);
				if(!hasCallback){
					resolve(e);
				}
			}, false);

			scriptElement.addEventListener('error', e => {
				// removeScript(scriptElement);
				reject(e);
			}, false);

			if(hasCallback){
				window.____callback____ = function() {
					resolve();
					window.____callback____ = null;
				}
			}

		});

		if(hasCallback){
			url += '&callback=____callback____'
		}

		scriptElement.src = url;

		return promise;
	}

	/**
	 * 移除script标签
	 * @param scriptElement script dom
	 */
	function removeScript(scriptElement) {
		document.body.removeChild(scriptElement);
	}

}
