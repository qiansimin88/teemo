var request = require('superagent');

module.exports = function( db, wxcfg ) {
    return new Promise( function(resolve, reject) {
        db.get('__wx_token__', function(err, res) {
            if ( err || !res ) {
                console.log( 'db_get_cached_token', err || 'No wx_token at redis');

                request
                    .get( 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + wxcfg.appId + '&secret=' + wxcfg.appSecret )
                    .set('Accept', 'application/json')
                    .end( function(err, res) {
                        if (err) {
                            reject({ code: 'wx_request_token', msg: err });
                            return;
                        }

                        res = res.body;
                        if ( !res || !res.access_token ) {
                            reject({ code: 'wx_request_token', msg: res });
                        } else {
                            db.set('__wx_token__', res.access_token, function(err) {
                                console.log('db_set_new_token', err );
                            });

                            resolve( res.access_token );
                        }
                    });
            } else {
                console.log('db_get_cached_token_successfully')
                resolve( res );
            }
        });
    });
};