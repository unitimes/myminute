var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	winston = require('winston');

chai.use(chaiAsPromised);

var should = chai.should();

describe('FacebookFriendsGetter', function() {
	var oUserCookie, sUserUrl;
	this.timeout(60000);

	before(function(done) {
		//if you want to see printed data on console, set the level of winston to "debug"
		winston.level = 'debug';

		var userCookieGetter, userUrlGetter;

		var oLoingInfo = {};
		oLoingInfo.email = 'unitimes@naver.com';
		oLoingInfo.pass = 'bae@30913';

		userCookieGetter = require('../../../services/facebook/user-cookie-getter');
		userUrlGetter = require('../../../services/facebook/user-url-getter');

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

	describe('getFirsts', function() {
		var aFriends;

		before(function(done) {
			var friendsGetter = require('../../../services/facebook/friends-getter');
			friendsGetter.getFriends(oUserCookie, sUserUrl).then(function(arrFriends) {
				aFriends = arrFriends;
				done();
			}).catch(function(err) {
				done(err);
			});
		});

		it.only('should return friend list', function() {
			winston.debug('Total friends is ' + aFriends.length);
			aFriends.should.be.a('array');
		});
	});
});
