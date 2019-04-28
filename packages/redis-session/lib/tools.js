module.exports = {
	checkNull(obj, map){
		var msg;
		Object.keys(map).forEach(key => {
			if(msg) return;
			if(!obj[key])  msg = map[key];
		});

		return msg;
	},
	random(arr){
		return arr[Math.floor(Math.random() * arr.length)];
	}
};