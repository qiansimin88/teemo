var Service = require('node-dubbo-comsumer');
const mEnv = 'magellan_node_1.0.0';
const conn = '174.3.4.250:2181,174.3.4.251:2181,174.3.4.253:2181';

if( !global.$config ){
	const services = {
		UserApiService: new Service({
			env: mEnv,
			conn,
			path: 'com.shining3d.magellan.client.UserApiService'
		}),
		PraiseApiService: new Service({
			env: mEnv,
			conn,
			path: 'com.shining3d.magellan.client.PraiseApiService'
		}),
		FavoriteApiService: new Service({
			env: mEnv,
			conn,
			path: 'com.shining3d.magellan.client.FavoriteApiService'
		}),
		RealNameAuditApiService: new Service({
			env: mEnv,
			conn,
			path: 'com.shining3d.magellan.client.RealNameAuditApiService'
		}),
		DesignerAuditApiService: new Service({
			env: mEnv,
			conn,
			path: 'com.shining3d.magellan.client.DesignerAuditApiService'
		}),
		UserFollowApiService: new Service({
			env: mEnv,
			conn,
			path: 'com.shining3d.magellan.client.UserFollowApiService'
		})
	};

	global.$config = {
		services: services
	}
}