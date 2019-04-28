
module.exports = function(app, host) {
	host = (host || '').trim() === '/' ? '' : host;
	// 不以 /statics 开头的且以.html结尾的文件
	var reg = new RegExp('^' + host + '/(?!statics/).+\\.html$');
	app.use(function(req, res, next) {
		if ( reg.test( req._parsedUrl.pathname ) ) {
			req.url = req.url.replace(/\.html/, '');
		}

		next();
	});
};