const api = require('../../build/api');
const config = require('../../build/config');
const Utils = require('../utils');
const request = require('request');

module.exports = {
	uploadToCloud: function(file_name, name, size, type){
		var user = Utils.get_user(this);
		if(!user.userId) return Utils.error('need_login');
		return api.DataService.uploadToCloud(file_name, name, size, type, user.userId);
	},
	followUser: function(targetUserId, follow){
		var user = Utils.get_user(this);
		if(!user.userId) return Utils.error('need_login');
		return api.DataService.followUser(targetUserId, follow, user.userId);
	},
	hasFollow: function(targetUserId){
		var user = Utils.get_user(this);
		if(!user.userId) return Utils.error('need_login');
		return api.DataService.hasFollow(targetUserId, user.userId);
	},
	getUserBasicProfile: function(targetUserId){
		var user = Utils.get_user(this);
		targetUserId = targetUserId || user.userId;
		return api.DataService.getUserBasicProfile(targetUserId, user.userId);
	},
	favData: function(targetId, favor){
		var user = Utils.get_user(this);
		if(!user.userId) return Utils.error('need_login');
		return api.DataService.favData(targetId, favor, user.userId);
	},
	likeData: function(targetId, like){
		var user = Utils.get_user(this);
		if(!user.userId) return Utils.error('need_login');
		return api.DataService.likeData(targetId, like, user.userId);
	},
	followList: function(targetUserId, pageSize, pageNum){
		var user = Utils.get_user(this);
		return api.DataService.followList(targetUserId, pageSize, pageNum, user.userId);
	},
	followedList: function(targetUserId, pageSize, pageNum){
		var user = Utils.get_user(this);
		return api.DataService.followedList(targetUserId, pageSize, pageNum, user.userId);
	},
	getOpenId: function(){
		return api.AuthAccessDubboService.generateAccessOpenId(config.panguAccessId, config.panguAccessSecret, config.site_code);
	},
	getUploadAddr: function(type){
		var result = type === 'img' ? config.ImgUploadAddr : config.FileUploadAddr;
		return Promise.resolve({result: result});
	},
	checkFavData: function(targetId){
		var user = Utils.get_user(this);
		return api.DataService.checkFavData(targetId, user.userId);
	},
	checkLikeData: function(targetId){
		var user = Utils.get_user(this);
		return api.DataService.checkLikeData(targetId, user.userId);
	},
	getUserId: function(){
		var user = Utils.get_user(this);
		return Promise.resolve(user.userId || '');
	}
};
