var api = global.$config.services;
var util = require( '../../utils' );

module.exports = {
	articleById(){
		return util.default( 'articleById', [ 'UserArticleApiService' ], {
			keyword: 'articleId',
			rename: '$article'
		}, function( parent, id, options ) {
			return api.UserArticleApiService.getArticleById( { id } )
				.then( result => parent[ options.rename ] = result && result.result && result.result.result && result.result.result[0] );
		} ).then( fn => fn.apply( this, arguments ) );
	}
};