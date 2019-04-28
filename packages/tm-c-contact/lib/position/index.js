var api = global.$config.services;
const util = require( '../../utils' );

module.exports = {
	banner(){
		return util.default( 'banner', [ 'SubjectWithPositionsQueryApiService' ], {
			keyword: 'bannerId',
			rename: '$banner'
		}, function( parent, bannerId, options ) {
			return api.SubjectWithPositionsQueryApiService.queryBySubjectPositonId( bannerId, {} )
				.then( res => parent[ options.rename ] = res && res.result && res.result.result );
		} ).then( fn => fn.apply( this, arguments ) );
	}
};