var api = global.$config.services;
var util = require( '../../utils' );

module.exports = {
	dataById(){
		var dataIdMap = {};

		return util.default( 'dataById', [ 'DataApiService' ], {
			keyword: 'dataId',
			rename: '$data'
		}, function( parent, dataId, options ) {
			return dataIdMap[ dataId ] = true;
		} ).then( fn => fn.apply( this, arguments ) ).then( res => {
			return api.DataApiService.queryDataByIdList( Object.keys( dataIdMap ) ).then( result => {
				if( !result || !result.result || !result.result.result || !Array.isArray( result.result.result ) ) return res;

				var dataList = result.result.result;
				dataList.forEach( data => {
					dataIdMap[ data.dataId ] = data;
				} );

				return util.default( 'dataById', [ 'DataApiService' ], {
					keyword: 'dataId',
					rename: '$data'
				}, function( parent, dataId, options ) {
					return parent[ options.rename ] = dataIdMap[ dataId ];
				} ).then( fn => fn.apply( this, arguments ) )
			} );

		} );
	}
};