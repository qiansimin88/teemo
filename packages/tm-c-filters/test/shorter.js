const should  = require('should');
const shorter = require('../shorter');
describe('shorter test', function() {
    it('normal test', function(done) {
        should(shorter('xxxxxxxxxxxxxxxx')).eql('xxxxxxxxxxxxxxxx');
        should(shorter('xxxxxxxxxxxxxxxxx')).eql('xxxxxxxxxxxxxxxx...');
        done();
    });
    it('test set len', function(done) {
        should(shorter('xxx',3)).eql('xxx');
        should(shorter('xxxx',3)).eql('xxx...');
        done();
    });
    it('test set offset', function(done) {
        should(shorter('xxxxx.xx',17,-3)).eql('xxxxx.xx');
        should(shorter('xxxxxx.xx',3,-3)).eql('xxx....xx');
        should(shorter('xxxxxx.xx',3,6)).eql('xxx....xx');
        done();
    });
    it('test set flag', function(done) {
        should(shorter('xxxxx.xx',17,-3,'--')).eql('xxxxx.xx');
        should(shorter('xxxxxx.xx',3,-3,'--')).eql('xxx--.xx');
        done();
    });
});
