var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')
var Service = require('node-dubbo-comsumer');
var bodyParser = require('body-parser');
var proxyMiddleware = require('http-proxy-middleware');
var path = require('path');
var api = require('./api'); //不要删!
var appConfig = require('./config');
var project = require('../server/project');
var proxyTable = project.proxyTable;

var app = express()
var compiler = webpack(config)
if( !project.host ) project.host = "";

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
proxyTable && Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options,
      changeOrigin : true
    }
  }
  app.use(proxyMiddleware(context, options))
});

module.exports = function start (port, host, NODE_ENV) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(require('connect-history-api-fallback')())
  app.use(devMiddleware)
  app.use(hotMiddleware)
  app.use('/statics', express.static('./statics'));
  app.use(require('./session')(api.DataService, appConfig.secret))

  if(NODE_ENV === 'dev'){
    console.log('coming dev!')
	  Service.done(function(){
		  app.use(project.host + '/gateway',Service.gatway( path.resolve(__dirname,'./server.js') ) );
	  })
  }else{
    Service().on('end', function(){
      app.use(project.host + '/gateway',Service.gatway( path.resolve(__dirname,'./server.js') ) );
    });
  }

  app.listen(port, host, function (err) {
      if ( err ) return console.log( err );
      console.log('Listening at http://' + host + ':' + port);
  })
}