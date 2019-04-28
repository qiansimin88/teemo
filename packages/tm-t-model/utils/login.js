import jsCookie from 'js-cookie';
import store from 'store';

var mapUser = {
	userId: '_id@String',
	siteCode: 'site_code',
	gmtCreate: 'create_at@Date',
	password: 'password',
	email: 'emails.address',
	emailVerify: 'emails.verified@Yn',
	phone: 'phones.number',
	phoneVerify: 'phones.verified@Yn',
	nickName: 'nick_name',
	storageAll: 'profile.storage.all',
	storageUsed: 'profile.storage.used',
	followed: 'profile.followed',
	follow: 'profile.follow',
	avatar: 'profile.avatar@String',
	gender: 'profile.gender',
	work: 'profile.work',
	signature: 'profile.signature',
	creator: '@@username',
	gmtModified: 'create_at@Date',
	modifier: '@@username',
	isDeleted: '@n',
	realName: 'profile.realName',
	points: 'points',
	isImproved: 'is_improved@Yn',
	realNameVerify: 'real_name_verify@Yn',
	sessionToken: 'sessionToken'
};


function tran(user) {
	var _user = {};
	for (var key in mapUser) {
		setMongoValue(mapUser[key], user[key]);
	}
	return _user;

	function setMongoValue(key, value) {
		if (!key || key === '@@username' || key.indexOf('@') === 0 || !value) return;
		//if (key.indexOf('@') > 0) key = key.split('@')[0];
		var tmpProto = _user;
		var keyArr = key.split('.');
		keyArr.forEach(function (item, index) {
			if (index < keyArr.length - 1) {
				tmpProto = tmpProto[item] = tmpProto[item] ? tmpProto[item] : {};
			} else {
				if (value === undefined) return;
				if (item.indexOf('@') > 0) {
					var itemArr = item.split('@');
					switch (itemArr[1]) {
						case 'Yn':
							value = value === 'y';
							item = itemArr[0];
							break;
						default :
							item = itemArr[0];
							break;
					}
				}
				tmpProto[item] = value;
			}
		});
	}
}

function addCookies(key, value) {
	if (jsCookie.get(key)) {
		jsCookie.remove(key);
	}
	jsCookie.set(key, value, {expires: 7, path: '/'});
}


module.exports = {
	parseError(err) {
		if (err && typeof err === 'object') {
			switch (err.err_msg) {
				case 'biz.verify_code_not_exist': {
					this.$broadcast('showToast', '验证码错误！');
					break;
				}
				case 'biz.user_exist': {
					this.$broadcast('showToast', '您的手机号已被注册!');
					break;
				}
				case 'biz.verify_code_repeat': {
					this.$broadcast('showToast', '验证码发送过于频繁，请您稍后再尝试！');
					break;
				}
				case 'biz.user_not_exist': {
					this.$broadcast('showToast', '用户名不存在！');
					break;
				}
				case 'biz.user_passwd_equal': {
					this.$broadcast('showToast', '密码不能与近期的密码相同:)');
					break;
				}
				case "username or password error" : {
					this.$broadcast('showToast', '用户名或密码错误！');
					break;
				}
				default : {
					this.$broadcast('showToast', '网络错误请稍候重试！');
				}
			}
			return false;
		}
		return true;
	},

	parseErr(errMsg) {
		let msg = '';
		switch (errMsg) {
			case 'biz.verify_code_not_exist': {
				msg = '短信验证码有误！';
				break;
			}
			case 'biz.user_exist': {
				msg = '该手机号已注册！';
				break;
			}
			case 'biz.user_nickname_exist': {
				msg = '用户昵称已存在！';
				break;
			}
			case 'biz.verify_code_repeat': {
				msg = '验证码发送过于频繁，请您稍后再尝试！';
				break;
			}
			case 'biz.user_not_exist': {
				msg = '用户名不存在！';
				break;
			}
			case 'biz.user_passwd_equal': {
				msg = '密码不能与近期的密码相同！';
				break;
			}
			case "username or password error" : {
				msg = '用户名或密码错误！';
				break;
			}
			case 'biz.verify_code_expire': {
				msg = '验证码已过期';
				break;
			}
			default : {
				msg = errMsg || '网络错误请稍候重试！';
			}
		}
		return msg;
	},


	loginSuc(data) {
		var result = tran(data.result);
		//set to store
		store.set('session_token', result.sessionToken);
		store.set('user_id', result._id);
		store.set('user_info', result);
		//兼容mobile项目的store
		store.set('user', {
			'user_id': result._id,
			'user_info': {
				emails: result.emails,
				profile: result.profile
			},
			'user_cdnkey': result.avatar ? result.avatar : null,
			'user_login_info': {
				'nick_name': result.nick_name,
				'username': result.phones.number || result.emails.address,
				'avatar': result.profile ? result.profile.avatar : 0
			}
		});
		addCookies('x_auth_token', result.sessionToken);
	},

	setStore(key, value) {
		store.set(key, value);
	}

};


