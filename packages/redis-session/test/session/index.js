const should = require('should');
const Session = require('../../lib/session');
const tools = require('../../lib/tools');
const config = {
	host: '174.3.4.254',
	port: 6379,
	password: 'o9i8u7y6',
	expire : 3 //for test ,3 seconds
};

var session;

describe('test Session.set and Session.get', function(){
	before(function(done){
		session = new Session(config);
		done();
	});
	it('success', function(done){
		var doc = {
			userId: '5618d6665237741000857398',
			// login_type: tools.random(['web', 'app', 'device']),
			login_type: 'app',
			token: 'e9a3389b-cb72-4c6f-8103-ccd3f93e0501'
		};

		session.set(doc);

		setTimeout(() => {
			session.get(doc.userId, doc.token).then(session => {
				should.exist(session);
				(session[doc.userId][doc.login_type]).should.be.exactly(doc.token);
				done();
			}).catch(done);
		}, 1000);
	});
	it('time out', function(done){
		var doc = {
			userId: '5618d6665237741000857397',
			// login_type: tools.random(['web', 'app', 'device']),
			login_type: 'app',
			token: 'e9a3389b-cb72-4c6f-8103-ccd3f93e0502'
		};

		session.set(doc);
		setTimeout(() => {
			session.get(doc.userId, doc.token).then(session => {
				should.exist(session);
				done();
			}).catch(done);
		}, 1000 * 2);
		setTimeout(() => {
			session.get(doc.userId, doc.token).then(session => {
				should.not.exist(session);
				done();
			}).catch(done);
		}, 1000 * 4);
	});
});
