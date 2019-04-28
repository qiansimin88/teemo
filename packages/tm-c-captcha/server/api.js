const cap = new Captcha({
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword,
});

module.exports = function( config ) {
    const cap = new Captcha({
        host: config.redisHost,
        port: config.redisPort,
        password: config.redisPassword,
    });

    return {
        genCaptcha(){
            return cap.generate();
        },
        checkCaptcha( token, data ) {
            return cap.check( token, data );
        }
    }
}