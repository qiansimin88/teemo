const resolveSearchToParams = function () {
	const search = window.location.search;
	if (!search) return;
	let v = search.split("?")[1];
	v = v.split("&");
	let obj = {};
	v.forEach((v, i) => {
		v = v.split("=");
		obj[v[0]] = decodeURIComponent(v[1]);
	});
	return obj;
};
const obj = {
	resolveSearchToParams
};
module.exports = obj;