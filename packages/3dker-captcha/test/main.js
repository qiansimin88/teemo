const Captcha = require('../');
const config = require('./config');
var cap
var cap_rs
describe('major capcha', function() {

  before((done) => {
    cap = new Captcha(config)
    setTimeout(function () {
      done()
    }, 1000);
  })
  it('make Captcha', function(done) {
    cap.generat().then((rs) => {
      cap_rs = rs
      // console.log(rs);
      done()
    }).catch(done)
  });
  it('check Captcha success', function(done) {
    cap.check(cap_rs.token,cap_rs.select_arr).then((rs) => {
      done()
    }).catch(done)
  });
  it('check Captcha fail', function(done) {
    cap.check(cap_rs.token,[0 ,0 ,0 ,0]).then((rs) => {
      done(new Error('check error'))
    }).catch(() => {
      done()
    })
  });
});
