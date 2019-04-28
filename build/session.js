var jwt = require('jsonwebtoken');
var _ = require('lodash');

function session(sessionService, secret) {
  return function middleware(req, res, next) {
    var token = req.get('X-Auth-Token');
    if (!token && req.cookies) {
      //检查cookie
      token = req.cookies.x_auth_token;
    }
    if (!token) {
      console.log('token missing');
      return next();
    }

    token = remove_quot(token);

    jwt.verify(token, secret, {
      ignoreExpiration: false
    }, function (err, decode) {
      if (err) {
        console.log('token parse error', err);
        return next();
      }
      var token = decode.token;
      //判断token所对应的user是否存在
      var login_type = decode.login_type;
      sessionService.getSession(token, login_type).then(function (session) {
        session.get = function (k) {
          return sessionService.getSession(token, login_type);
        };
        session.set = function (k, v) {
          return new Promise((resolve, reject) => {
            sessionService.setSession(token, k, v).then(function (rs) {
              resolve(rs)
            }).catch(function (err) {
              reject(err);
            })

          });
        }
        req.tsession = session;
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

module.exports = session;