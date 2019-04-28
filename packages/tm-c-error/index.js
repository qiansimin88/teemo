/*
 * 全局捕获api错误；
 *
 * 使用：
 *
 *   第一步：
 *       mian.js
 *
 *   import error from 'tm-c-error';
 *   import errorHandle from './views/components/error-handle.js';
 *
 *   error(Vue);
 *
 *   第二步：
 *       views/*.vue;
 *
 *   在template内部
 *
 *   <partial name="error"></partial>
 *
 * */

// import capture from './lib/capture.vue';
import capture from './lib/capture.js';
import captureHtml from './lib/capture.html';

function install ( Vue, handle ) {
	var $capture = capture( Vue, handle );
	$capture.template = captureHtml;

	Vue.component( 'error', $capture );
}

export default { install }
