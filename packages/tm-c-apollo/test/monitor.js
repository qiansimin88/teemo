var should = require('should');
var Client = require('../index');

describe('Apollo.monitor test', function(){
	it('it should be success', function(done){
		var client = new Client({
			server: 'localhost:8080',
			appId: 'phoenix-order',
			clusterName: 'cluster-1',
			namespaceName: 'test1.public'
		});

		var timer = Date.now();
		client.get().then(config => {
			console.log('config: ', config);
		});

		client.on('test', body => {
			console.log(`耗时:${Date.now() - timer}`);
			console.log('body: ', body);
			// done();
		});
	});
});