export default {
	goLogin(){
		window.location.href = `/i/login?referrer=${window.encodeURIComponent( window.location.href )}`;
	}
}