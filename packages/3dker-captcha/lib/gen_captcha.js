var gm = require('gm').subClass({imageMagick: true});
var debug = require('debug')('3dk-captcha');
var path = require('path');
var c_path = path.dirname(__filename);
var font_path = c_path + '/wenquanyi-micro-hei.ttf';
//var font_path = c_path + '/comic.ttf';

//Asicc  33~126为可显示字符
//return value
// {
// 	token, 用户在数据库中标识的token
// 	base64, 验证码的base64图
// 	select_cha   需要挑选的字符
// 	select_cha_base64 需要挑选出来的字符图片
// }
module.exports = function(cb) {
	var result = gen_captcha(function (result) {

		gen_select_char(result.select_cha,function (char) {
				result.select_cha_base64 = char;
				cb && cb(result);
		});
	});
};

function gen_captcha(cb) {
	var ctx = gm(c_path + '/base.png').resize(200, 50).font(font_path, 32);
	//选中字符重复的次数
	var select_size = random(1, 5);
	//需要选中的Asicc字符,只选择大写字母 65-90 和数字 48-57
	var select_cha = String.fromCharCode(ramdom_cha());
	//选中所在的位置
	var select_arr = random_arr(select_size, 0, 6);
	var pic_arr = [];
	for (var j = 0; j < 6; j++) {
		if (select_arr.indexOf(j) >= 0) {
			pic_arr.push(select_cha);
		} else {
			var rs;
			while( (rs = String.fromCharCode(ramdom_cha())) === pic_arr){
				continue;
			}
			pic_arr.push(rs);
		}
	}

	var pred = 11;
	var bred = 25;
	pic_arr.forEach(function(item, index) {
		ctx.drawText( pred + bred * index, 38,item);
		ctx.fill(random_col());
	});

	// noise
	var noiseHeight = 50 * 1.5;
  	ctx.noise('multiplicative');

	//min (included) and max (excluded)
	function random(min, max) {

		return Math.floor(Math.random() * (max - min)) + min;
	}

	//大写字母 65-90 和数字 48-57
	function ramdom_cha(){
		if(!!random(0, 2)){
			return Math.floor(Math.random() * (91 - 65)) + 65;
		}else{
			return Math.floor(Math.random() * (58 - 48)) + 48;
		}
	}

	function random_arr(arr_len, min, max) {
		var _random_arry = [];
		for (var i = min; i < max; i++) {
			_random_arry.push(i);
		}
		var top = max - min;
		var current, tmp;
		while (top--) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = _random_arry[current];
			_random_arry[current] = _random_arry[top];
			_random_arry[top] = tmp;
		}
		return _random_arry.slice(0, arr_len).sort();
	}
	//随机输出rgb颜色

	function random_col() {
		var r = Math.floor(Math.random() * 150);
		var g = Math.floor(Math.random() * 150);
		var b = Math.floor(Math.random() * 150);
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}
    ctx.toBuffer(function (err,buffer) {
		if(err){
			console.error(err);
		}
		cb && cb({
				token: require('./token')(),
				base64: 'data: image/png;base64,' + buffer.toString('base64'),
				select_cha: select_cha,
				select_arr: select_arr
		});
    })
}


function gen_select_char(char,cb) {
	var ctx = gm(c_path+'/base_30_30.png').font(font_path, 30);
	ctx.stroke('#000');
	ctx.drawText(5, 25, char);
	ctx.toBuffer(function (err,buffer) {
		if(err){
			return console.error(err);
		}
		cb && cb('data: image/png;base64,' + buffer.toString('base64'));
	});
}
