module.exports = {
	set_call: function(){
		return {
			query: JSON.stringify(arguments)
		}
	},
	get_user: function(call){
		var user = {};
		try{
			user = call.tsession.payload.user;
		}catch (e){}
		return user;
	},
	remove_quot: function(str){
		if(!str) return ;
		return String(str).replace(/^\"|\"$/g, '');
	},
	send: function(err, fn){
		if(err){
			if(typeof err === 'object' && !(err instanceof Array)){
				return Promise.reject(err);
			}

			return Promise.reject({
				err_code: '',
				err_msg: err
			});
		}

		if(!fn){
			fn = function(){
				return Promise.resolve({
					result: {
						result: null
					}
				});
			}
		}

		return fn();
	},
	error: function(err) {
		err = err || 'system error';

		return this.send({
			err_code: '',
			err_msg: err
		});
	}
};
