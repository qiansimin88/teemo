const util = require( '../../utils' );
const api = global.$config.services;

module.exports = {
	user(){
		return util.default( 'userId', [ 'UserApiService' ], {
			keyword: 'userId',
			rename: '$user'
		}, function( parent, key, options ) {
			return api.UserApiService.queryUserByUserId( key ).then( res => parent[ options.rename ] = res && res.result && res.result.result );
		} ).then( fn => fn.apply( this, arguments ) );
	},
	isFollow(){
		return util.default( 'isFollow', [ 'UserFollowApiService' ],
			{
				keyword: 'userId',
				rename: '$isFollow',
				loginUserId: ''
			}, function( parent, key, options ) {
				if ( Array.isArray( key ) ) {
					return api.UserFollowApiService.followersState( {
							toUserIdList: key,
							userId: options.loginUserId
						} )
						.then( res => parent[ options.rename ] = res && res.result && res.result.result )
						.then( () => util.order( parent[ options.rename ], key, 'toUserId' ) );
				} else {
					return api.UserFollowApiService.followerState( {
						toUserId: key,
						userId: options.loginUserId
					} ).then( res => parent[ options.rename ] = res && res.result && res.result.result );
				}
			}
		).then( fn => fn.apply( this, arguments ) );
	},
	isLike(){
		return util.default( 'isLike', [ 'PraiseApiService' ],
			{
				keyword: 'dataId',
				rename: '$isLike',
				type: 'data',
				loginUserId: ''
			}, function( parent, key, options ) {
				if ( Array.isArray( key ) ) {
					return Promise.all( key.map( item => {
						return api.PraiseApiService.listPraiseUser( {
							type: options.type,
							senders: [ options.loginUserId ],
							objectId: item
						} ).then( res => {
							return res && res.result && res.result.result && res.result.result[ 0 ];
						} );
					} ) ).then( res => parent[ options.rename ] = res )
						.then( data => {
							return util.order( data, key, 'objectId' );
						} );
				} else {
					return api.PraiseApiService.listPraiseUser( {
						type: options.type,
						senders: [ options.loginUserId ],
						objectId: key
					} ).then( res => res && res.result && res.result.result && res.result.result[ 0 ] )
						.then( res => parent[ options.rename ] = res );
				}
			}
		).then( fn => fn.apply( this, arguments ) );
	},
	isFav(){
		return util.default( 'isFav', [ 'FavoriteApiService' ], {
			keyword: 'dataId',
			rename: '$isFav',
			type: 'data',
			loginUserId: ''
		}, function( parent, key, options ) {
			// return api.FavoriteApiService.listFavoriteUser( {
			// 	type: options.type,
			// 	senders: [ options.loginUserId ],
			// 	objectId: key
			// } ).then( res => parent[ options.rename ] = res && res.result && res.result.result || false )

			if ( Array.isArray( key ) ) {
				return Promise.all( key.map( item => {
					return api.FavoriteApiService.listFavoriteUser( {
						type: options.type,
						senders: [ options.loginUserId ],
						objectId: item
					} ).then( res => {
						return res && res.result && res.result.result && res.result.result[ 0 ];
					} );
				} ) ).then( res => parent[ options.rename ] = res )
					.then( data => {
						return util.order( data, key, 'objectId' );
					} );
			} else {
				return api.FavoriteApiService.listFavoriteUser( {
					type: options.type,
					senders: [ options.loginUserId ],
					objectId: key
				} ).then( res => res && res.result && res.result.result && res.result.result[ 0 ] )
					.then( res => parent[ options.rename ] = res );
			}
		} ).then( fn => fn.apply( this, arguments ) );
	},
	isDesigner(){
		return util.default( 'isDesigner', [ 'RealNameAuditApiService', 'DesignerAuditApiService' ], {
			keyword: 'userId',
			rename: '$isDesigner'
		}, function( parent, key, options ) {

			if ( Array.isArray( key ) ) {
				return Promise.all( key.map( single ) ).then( auth => parent[ options.rename ] = auth );
			} else {
				return single( key ).then( auth => parent[ options.rename ] = auth );
			}

			function single ( key ) {
				//实名认证状态
				var realNameStatus = api.RealNameAuditApiService.getUserRealNameAuditStatus( key, { 'userId': key } );
				//设计师认证状态
				var designerAuditStatus = api.DesignerAuditApiService.queryDesignerAuditDetail( key );

				return Promise.all(
					[
						realNameStatus,
						designerAuditStatus
					] )
					.then( resList=> {
						var rnStatus = resList && resList[ 0 ] && resList[ 0 ].result && resList[ 0 ].result.result;
						var daStatus = resList && resList[ 1 ] && resList[ 1 ].result && resList[ 1 ].result.result && resList[ 1 ].result.result.status;
						return rnStatus === 'success' && daStatus === 'auditSuccess';
					} ).catch( err => {
						return false;
					} );
			}
		} ).then( fn => fn.apply( this, arguments ) );
	}
};