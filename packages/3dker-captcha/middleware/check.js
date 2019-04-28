var Captcha = require('../../lib/captcha');

//如果req._captcha_disable设为了true，那么此middleware不会启用，直接调用next


/**
 * req.cap_token  请求cap_token时返回的token
 * req.cap_posi  用户点击产生的位置信息，从0开始，多个用 | 分开
 */
module.exports = function(req, res, next) {
    if (req._captcha_disable === true) {
        next();
    } else {
        var token = req.query.cap_token || req.body.cap_token;
        var position = req.query.cap_posi || req.body.cap_posi;
        if (!token || !position) {
            return res.jsonDBE('argument missing');
        }
        position = position.split('|');
        position = position.reduce(function(pre, cur) {
            if (cur && cur !== '') {
                pre.push(cur);
            }
            return pre;
        }, []);
        //position 转换成Number数组
        position.forEach(function(item, index) {
            position[index] = ~~item;
        });
        position.sort();
        Captcha.schema.findOne({
            token: token,
            expire: {
                $gt: Date.now()
            }
        }, function(err, cap) {
            if (err) {
                return res.jsonDBE();
            }
            if (!cap) {
                return res.jsonDBE('captcha error');
            }
            if (cap.select_arr.toString('|') === position.toString('|')) {
                return next();
            } else {
                return res.jsonDBE('captcha error');
            }
        });

    }
};
