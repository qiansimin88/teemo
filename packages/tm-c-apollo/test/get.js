const should = require('should');
const Client = require('../index');

describe('tm-t-apollo.get test', function(){
	it('client.get config', function(done){
		var client = new Client({
			server: 'localhost:8080',
			appId: 'phoenix-order',
			clusterName: 'cluster-1',
			namespaceName: 'test1.public'
		});

		client.get().then(config => {
			config ? done() : done(config);
		});
	});
});