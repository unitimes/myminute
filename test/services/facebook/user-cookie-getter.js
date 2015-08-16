var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var should, userCookieGetter, oLoingInfo; 

describe('FacebookCookieGetter', function() {
	before(function() {
		oLoingInfo = {};
		oLoingInfo.email = 'unitimes@naver.com';
		oLoingInfo.pass = 'bae@30913';

		should = chai.should();
	});
	beforeEach(function() {
		userCookieGetter = require('../../../services/facebook/user-cookie-getter');
	});

	describe('getUserCookie', function() {
		this.timeout(5000);
		it('should returned object has cuser', function() {
			return userCookieGetter.getUserCookie(oLoingInfo).should.eventually.have.property('cuser').that.not.equals(null);
		});
		it('should returned object has xs', function() {
			return userCookieGetter.getUserCookie(oLoingInfo).should.eventually.have.property('xs').that.not.equals(null);
		});
		it('should returned "fb001" error', function() {
			oLoingInfo.email = 'uni';
			oLoingInfo.pass = 'pass';
			return userCookieGetter.getUserCookie(oLoingInfo).should.eventually.rejectedWith(/^fb001/);
		});
	});
});
