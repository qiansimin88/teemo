const RedisDB = require('../models/redis');
const should = require('should');
const config = require('./config');
var db
describe('test redis', function() {
  before((done) => {
    db = new RedisDB(config)

    setTimeout(function () {
      done()
    }, 500);
  })
  it('test redis set', function(done) {
    db.set('test','a').then(() => {
      done()
    }).catch(done)
  });
  it('test redis get', function(done) {
    db.get('test').then((rs) => {
      should(rs).eql('a')
      done()
    }).catch(done)
  });
  it('test redist expire', function(done) {
     setTimeout(function () {
       db.get('test').then((rs) => {
         should(rs).eql(null)
         done()
       }).catch(done)
     }, 1000);
  });
});
