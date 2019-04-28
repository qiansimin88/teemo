const regexp = /^(http:|https:)\/\/([^\/]+)((?:\/.+|)(?:\/(\d+)\.html))(\?.*|)$/;

function Parser( url ){
	var query = this.collect( url.match( regexp ) );
	this._host = query.host;
	this._protocol = query.protocol;
	this._pathname = query.pathname;
	this._prepath = query.prepath;
	this._pageNum = query.pageNum;
	this._search = query.search;
	this._postfix = query.postfix;
}

Parser.prototype.collect = function( match ) {
	if ( !match ) match = [];

	var prepath;
	var pageNum = window.parseInt( match[ 4 ] || 1, 10 );
	var postfix = '.html';

	if(match.length){
		prepath = (match[ 3 ] || '').replace( new RegExp( pageNum + postfix ), '' );
	}else{
		prepath = (window.location.pathname + '/').replace(/\/\//, '/');
	}

	pageNum = pageNum || 1;
	prepath = (prepath + '/').replace( /\/\//, '/' );

	return {
		protocol: match[ 1 ] || window.location.protocol, // 在前端应该是window.location.protocol
		host: match[ 2 ] || window.location.host,  // 在前端应该是window.location.host
		pathname: match[ 3 ] || window.location.pathname, // 在前端应该是window.location.pathname
		pageNum: pageNum,
		prepath: prepath,
		postfix: postfix || '.html',
		search: match[ 5 ] || window.location.search
	};
};

Parser.prototype.jump = function( pageIndex ){
	window.location.href = `${ this._protocol }//${ this._host }${ this._prepath }${ pageIndex }${ this._postfix }${ this._search }`;
};

export default Parser;