
export var sokcetPool = [];

var clientPool = [];

export function disconnet() {
	for (var i = 0; i < clientPool.length; i++) {
		if(clientPool[i].disconnect){
			try {
				clientPool[i].disconnect();
			} catch (e) {}
		}
	}
}

export function socketClient(callback,debug = false) {
		var client = generatorWs();
		client.debug = debug ? str => { console.log(str); } : () => {};
		client.connect(window.export_minas.socketUser, window.export_minas.socketPwd, () => {
			return callback(client);
		}, function() {
			//error, 重连
			reconnect();
		}, window.export_minas.socketUser);

		//当链接断开立即重连
		client.ws.addEventListener('close', reconnect);
		clientPool.push(client);
		function reconnect() {
			sokcetPool.forEach(id => {
				client.unsubscribe(id);
			});
			sokcetPool = [];
			sokcetPool.length = 0;
			//重连
			socketClient(callback);
		}
}

function generatorWs() {
	var ws = new window.WebSocket("wss://" + window.export_minas.socketHost + "/ws/");
	return window.Stomp.over(ws);
}
