
module.exports = {
	hasProtocol: function(url){
		return /&(http:\/\/)|(https:\/\/).*?/.test(url);
	},
	makeNotifications: function(){
		return this._notificationUrl = `${this._server}/notifications/v2?appId=${this._appId}&cluster=${this._clusterName}&notifications=${JSON.stringify([{
			namespaceName: this._namespaceName,
			notificationId: this._notificationId
		}])}`;
	}
};