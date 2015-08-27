var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	winston = require('winston');

chai.use(chaiAsPromised);

var should = chai.should();

describe('fbFirstPageFriendsGetter', function() {
	var oUserCookie, sUserUrl;

	this.timeout(30000);

	before(function(done) {
		winston.level = 'debug';

		var userCookieGetter, userUrlGetter;

		var oLoingInfo = {};
		oLoingInfo.email = 'unitimes@naver.com';
		oLoingInfo.pass = 'bae@30913';

		userCookieGetter = require('../../../../services/facebook/user-cookie-getter');
		userUrlGetter = require('../../../../services/facebook/user-url-getter');

		userCookieGetter.getUserCookie(oLoingInfo).then(function(rcvCookie) {
			oUserCookie = rcvCookie;
			getUserUrl();
		}).catch(function(err) {
			done(err);
		});

		var getUserUrl = function() {
			userUrlGetter.getUserUrl(oUserCookie).then(function(rcvUserUrl) {
				sUserUrl = rcvUserUrl;
				done();
			}).catch(function(err) {
				done(err);
			});
		};
	});

	describe('getFriendsFromFirstPage', function() {
		var aFriends;
		before(function(done) {
			var firstpageGetter = require('../../../../services/facebook/friends-getter/firstpage-getter');
			firstpageGetter.getFriendsFromFirstPage(oUserCookie, sUserUrl).then(function(aRcvFriends) {
				aFriends = aRcvFriends;
				done();
			}).catch(function(err) {
				done(err);
			});
		});

		it.only('should return friend list', function() {
			winston.debug(aFriends[aFriends.length - 1].name);
			aFriends.should.be.a('array');
		});
	});
});
