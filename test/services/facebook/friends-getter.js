var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	winston = require('winston');

chai.use(chaiAsPromised);

var should;

describe('FacebookFriendsGetter', function() {
	var userUrlGetter, userCookieGetter, firstpageSourceDataGetter, oUserCookie, userUrl;
	this.timeout(10000);

	before(function(done) {
		oLoingInfo = {};
		oLoingInfo.email = 'unitimes@naver.com';
		oLoingInfo.pass = 'bae@30913';

		should = chai.should();
		userCookieGetter = require('../../../services/facebook/user-cookie-getter');
		userUrlGetter = require('../../../services/facebook/user-url-getter');
		firstpageSourceDataGetter = require('../../../services/facebook/friends-getter/firstpage-getter/sourcedata-getter');

		userCookieGetter.getUserCookie(oLoingInfo).then(function(rcvCookie) {
			oUserCookie = rcvCookie;
			runUserUrlGetterPromise();
		}).catch(function(err) {
			done(err);
		});

		var runUserUrlGetterPromise = function() {
			userUrlGetter.getUserUrl(oUserCookie).then(function(rcvUserUrl) {
				userUrl = rcvUserUrl;
				done();
			}).catch(function(err) {
				done(err);
			});
		};
	});

	describe('getFirstpageSourceData', function() {
		it('should returned source data having "uilist"', function() {
			return firstpageSourceDataGetter.getSourceData(oUserCookie, userUrl).should.eventually.not.equals(null);
		});
	});

	describe('getFirstpageFriendsList', function() {
		var sourceHtml, listMaker;

		before(function(done) {
			//if you want to see printed data on console, set the level of winston to "debug"
			winston.level = 'info';

			listMaker = require('../../../services/facebook/friends-getter/firstpage-getter/list-maker');
			firstpageSourceDataGetter.getSourceData(oUserCookie, userUrl).then(function(rcvHtml) {
				sourceHtml = rcvHtml;
				done();
			}).catch(function(err) {
				done(err);
			});
		});
		
		it('should returned friend list "array"', function() {
			listMaker.getList(sourceHtml).should.not.equals(null);
		});
	});
});
