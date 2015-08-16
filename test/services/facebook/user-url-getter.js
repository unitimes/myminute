var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var should;

describe('FacobookUserUrlGetter', function() {
	var userUrlGetter, userCookieGetter, oLoingInfo, oUserCookie;
	this.timeout(5000);
	before(function(done) {
		oLoingInfo = {};
		oLoingInfo.email = 'unitimes@naver.com';
		oLoingInfo.pass = 'bae@30913';

		should = chai.should();
		userCookieGetter = require('../../../services/facebook/user-cookie-getter');
		userUrlGetter = require('../../../services/facebook/user-url-getter');

		userCookieGetter.getUserCookie(oLoingInfo).then(function(rcvCookie) {
			oUserCookie = rcvCookie;
			done();
		}).catch(function(err) {
			done(err);
		});
	});

	describe('getUserUrl', function() {
		it('should returned user url string', function() {
			return userUrlGetter.getUserUrl(oUserCookie).should.eventually.be.a('string');
		});
	});
});
