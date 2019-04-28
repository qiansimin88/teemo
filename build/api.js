var Service = require('node-dubbo-comsumer');
const config = require('./config');

module.exports = {
	UserApiService : new Service({
		env:config.UserApiService.env,
		conn:config.UserApiService.conn,
		path:config.UserApiService.path
	}),
	UserArticleApiService : new Service({
		env:config.UserArticleApiService.env,
		conn:config.UserArticleApiService.conn,
		path:config.UserArticleApiService.path
	}),
	MessageApiService : new Service({
		env:config.MessageApiService.env,
		conn:config.MessageApiService.conn,
		path:config.MessageApiService.path
	}),
	CouponApiService : new Service({
		env:config.CouponApiService.env,
		conn:config.CouponApiService.conn,
		path:config.CouponApiService.path
	}),
	InviteRecordApiService : new Service({
		env:config.InviteRecordApiService.env,
		conn:config.InviteRecordApiService.conn,
		path:config.InviteRecordApiService.path
	}),
	DesignerAuditApiService : new Service({
		env:config.DesignerAuditApiService.env,
		conn:config.DesignerAuditApiService.conn,
		path:config.DesignerAuditApiService.path
	}),
	DesignerApiService : new Service({
		env:config.DesignerApiService.env,
		conn:config.DesignerApiService.conn,
		path:config.DesignerApiService.path
	}),
	RealNameAuditApiService : new Service({
		env:config.RealNameAuditApiService.env,
		conn:config.RealNameAuditApiService.conn,
		path:config.RealNameAuditApiService.path
	}),
	ClassifyService : new Service({
		env:config.ClassifyService.env,
		conn:config.ClassifyService.conn,
		path:config.ClassifyService.path
	}),
	AuthAccessDubboService: new Service({
		env: config.AuthAccessDubboService.env,
		conn: config.AuthAccessDubboService.conn,
		path: config.AuthAccessDubboService.path
	}),
	SubjectWithPositionsQueryApiService: new Service({
		env:config.SubjectWithPositionsQueryApiService.env,
		conn:config.SubjectWithPositionsQueryApiService.conn,
		path:config.SubjectWithPositionsQueryApiService.path
	}),
	DictApiService: new Service({
		env:config.DictApiService.env,
		conn:config.DictApiService.conn,
		path:config.DictApiService.path
	}),
	KeyWordFilterApiService: new Service({
		env:config.KeyWordFilterApiService.env,
		conn:config.KeyWordFilterApiService.conn,
		path:config.KeyWordFilterApiService.path
	}),
	RoundApiService: new Service({
		env:config.RoundApiService.env,
		conn:config.RoundApiService.conn,
		path:config.RoundApiService.path
	}),
	RoundSubjectApiService: new Service({
		env:config.RoundSubjectApiService.env,
		conn:config.RoundSubjectApiService.conn,
		path:config.RoundSubjectApiService.path
	}),
	AtApiService: new Service({
		env:config.AtApiService.env,
		conn:config.AtApiService.conn,
		path:config.AtApiService.path
	}),
	PraiseApiService: new Service({
		env:config.PraiseApiService.env,
		conn:config.PraiseApiService.conn,
		path:config.PraiseApiService.path
	}),
	CommentApiService: new Service({
		env:config.CommentApiService.env,
		conn:config.CommentApiService.conn,
		path:config.CommentApiService.path
	}),
	BrowseApiService: new Service({
		env:config.BrowseApiService.env,
		conn:config.BrowseApiService.conn,
		path:config.BrowseApiService.path
	}),
	DataService:  Service.grpc(config.DataService)
};