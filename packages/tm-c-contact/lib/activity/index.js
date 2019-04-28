var api = global.$config.services;
const util = require( '../../utils' );

module.exports = {
	activity(){
		return util.default( 'activity', [ 'ActivityApiService' ], {
			keyword: 'activityId',
			rename: '$activity'
		}, function( parent, activityId, options ) {
			return api.ActivityApiService.queryActivityById( activityId )
				.then( result => parent[ options.rename ] = result && result.result && result.result.result );
		} ).then( fn => fn.apply( this, arguments ) );
	},
	menuList(){
		return util.default( 'menuList', [ 'ActivityMenuApiService' ], {
			keyword: 'activityId',
			rename: '$menuList'
		}, function( parent, activityId, options ){
			return api.ActivityMenuApiService.queryActivityMenuByActivityId( activityId )
				.then( result => parent[ options.rename ] = result && result.result && result.result.result )
		} ).then( fn => fn.apply( this, arguments ) );
	},
	theme(){
		return util.default( 'theme', [ 'PageThemeTemplateApiService' ], {
			keyword: 'stemplateId',
			rename: '$theme'
		}, function( parent, stemplateId, options ){
			return api.PageThemeTemplateApiService.queryById( stemplateId )
				.then( result => parent[ options.rename ] = result && result.result && result.result.result )
		} ).then( fn => fn.apply( this, arguments ) );
	}
};