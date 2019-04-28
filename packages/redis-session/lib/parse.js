var jwt = require('jsonwebtoken');
var Session = require('./session');
var session;
var env = process.env.NODE_ENV;
var isProd = /^production&/i.test( env );
var loginTypeLimit = {
    app: true,
    web: true,
    device: true
};

/**
 * @param config {host(redist host),port,password,expire(in seconds)}
 */
function parse(config, secret) {
	if (!session) {
		session = new Session(config);
	}
	parse.session = middleware.session = session;

	return middleware;

	function middleware(req, res, next) {
		var token = req.get('X-Auth-Token');
		if (!token && req.cookies) {
			//检查cookie
			token = req.cookies.x_auth_token;
		}
		if (!token || token === 'null' || token === 'None') {
			return next();
		}

		token = remove_quot(token);

		jwt.verify(token, secret, {
			ignoreExpiration: false
		}, function (err, decode) {
			if (err) {
				if( isProd ){
					console.log('token parse error: ', {
						token,
						err
					});
				}
				return next();
			}

			//判断token所对应的user是否存在
			session.get(decode.user_id, decode.token).then(function (_session) {

                //每次gateway超时刷新redis过期时间

                if( _session ){
                    var keys= Object.keys( _session && _session[decode.user_id] ) || [];
                    var key = keys.filter(function (item){
                        return 	loginTypeLimit[item];
                    });

                    session.set({
                        userId: decode.user_id ,
                        login_type: key.length > 0 && key[0],
                        token: decode.token
                    });

                    req.tsession = {
                        payload: {
                            user: {
                                userId: _session && _session.userId
                            },
                            userId: _session && _session.userId
                        }
                    };
                }

                next();

			}).catch(function (e) {
				console.log(e);
				return next();
			});
		});
	};
}

// 如果前后有双引号，去除双引号
function remove_quot(token) {
	if (!token) return;
	var result = token.match(/^("|')(.*?)("|')$/);
	if (result) {
		token = result[2];
	}

	return token;
}

module.exports = parse;
