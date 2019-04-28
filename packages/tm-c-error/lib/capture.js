import Phoenix from 'phoenix';
import toast from 'phoenixUI/toast';
import methods from './methods.js';

var tools = Object.assign({}, methods);

export default function ( Vue, handle, options ) {
	handle = handle || function () {};
	options = options || {};
	Object.assign(tools, options.methods);

	wrapApi( Vue, handle, tools );

	return Phoenix.createView( {
		name: 'tm-c-error',
		data(){
			return {
				toastShow: false,
				toastMsg: '网络异常，请稍后再试！'
			};
		},
		components: {
			toast
		},
		created(){
			// 可以在此添加方法到tools上
			tools.showToast = this.showToast;
		},
		methods: {
			showToast( msg ){
				this.toastMsg = msg || '';

				if ( !this.toastMsg ) return Promise.resolve();

				this.toastShow = true;

				return new Promise( ( resolve, reject ) => {
					setTimeout( () => {
						this.toastShow = false;
						return resolve( true );
					}, 1500 );
				} );
			}
		}
	} );

	function wrapApi ( Vue, handle, tools ) {
		if ( !Vue || !Vue.prototype || !Vue.prototype.api ) {
			// phoenix 在 import 的时候会修改 Vue 的 prototype
			return;
		}

		var $api = Vue.prototype.api;

		Vue.prototype.api = function () {
			var http = $api.apply( this, arguments );

			var $send = http.send;
			var $post = http.post;

			http.peace = function () {
				return $send.apply( this, arguments ).then( res => {
					return sendHandle( res, handle, tools );
				} );
			};

//				http.post = function(){
//					return $post.apply(this, arguments).then(res => {
//						return postHandle(res, handle. tools);
//					});
//				};

			return http;
		}
	}

	function sendHandle ( res, handle, tools ) {
		var err;

		if ( res.error && res.error.err_code ) err = res.error.err_code;
		if ( res.error && res.error.err_msg ) err = res.error.err_msg;

		if ( err && err.message ) err = err.message;

		if ( res.result && res.result.errCode ) err = res.result.errCode;
		if ( res.result && res.result.errMsg ) err = res.result.errMsg;
		if ( res.result && res.result.err_msg ) err = res.result.err_msg;

		if ( !err ) return Promise.resolve( res && res.result );

		var result = handle( err, tools );

		return result instanceof Promise  ? result : {
			then: function(){ return this; },
			catch: function(){ return this; }
		};
	}

	function postHandle ( err, data ) {
		if ( !err || (!err.err_code && !err.err_msg) ) return $promise( null, data );

		err = err && err.err_msg ? err.err_msg : err.err_code;

		handle( err, tools );

		// 如果捕获到错误，post.then之后的代码不会被执行，但是要添加then方法保证不报错

		return {
			then: function () {}
		}
	}

	function $promise ( err, data ) {
		return {
			then: function ( fn ) {
				return fn( err, data );
			}
		}
	}
}