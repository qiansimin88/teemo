const Session = require('../../lib/session');
const config = {
	host: '174.3.4.254',
	port: 6379,
	password: 'o9i8u7y6'
};
const userId = '5618d6665237741000857398';

var session;

describe('test Session.clean', function(){
	before(function(done){
		session = new Session(config);
		done();
	});
	it('success', function(done){
		try{
			session.clean(userId);
			session._redis.get(userId, function(err, session){
				console.log('err: ', err);
				console.log('session: ', session);
				done();
			});
			console.log('coming');
		}catch (e){
			console.log('e: ', e);
			return done(e);
		}
	});
});