var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	winston = require('winston');

chai.use(chaiAsPromised);

var should;

describe('FacebookFriendsGetter', function() {
	var userUrlGetter, userCookieGetter, firstpageSourceDataGetter, oUserCookie, userUrl;
	this.timeout(60000);

	before(function(done) {
		//if you want to see printed data on console, set the level of winston to "debug"
		winston.level = 'debug';

		var oLoingInfo = {};
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

	describe('getFriendsList', function() {
		var sourceHtml;

		before(function(done) {
			firstpageSourceDataGetter.getSourceData(oUserCookie, userUrl).then(function(rcvHtml) {
				sourceHtml = rcvHtml;
				done();
			}).catch(function(err) {
				done(err);
			});
		});

		describe('getFirstPageFriendsList', function() {
			var aList;
			before(function(done) {
				var extractor = require('../../../services/facebook/friends-getter/firstpage-getter/extractor');
				extractor.getListFromSourceData(sourceHtml, oUserCookie).then(function(aOFiends) {
					aList = aOFiends;
					done();
				}).catch(function(err) {
					done(err);
				});
			});
			it('should returned friend list "array"', function() {
				aList.should.not.equals(null);
				aList.should.be.a('array');
			});

			it('should returned the info of next page', function() {
				var nextpageInfoGetter = require('../../../services/facebook/friends-getter/commons/nextpage-info-getter');
				var oInfo = nextpageInfoGetter.getInfo(oUserCookie, sourceHtml);
				oInfo.collectionToken.should.have.length.above(1);
				oInfo.cursor.should.have.length.above(1);
				oInfo.profileId.should.be.equals(oUserCookie.cuser);
			});
		});

		describe('getSecondPageFriendsList', function() {
			var secondSourceHtml;

			before(function(done) {
				var nextpageInfoGetter = require('../../../services/facebook/friends-getter/commons/nextpage-info-getter');
				var oInfo = nextpageInfoGetter.getInfo(oUserCookie, sourceHtml);
				var nextpageSourceDataGetter = require('../../../services/facebook/friends-getter/nextpage-getter/sourcedata-getter');

				nextpageSourceDataGetter.getSourceData(oUserCookie, oInfo).then(function(rcvHtml) {
					secondSourceHtml = rcvHtml;
					done();
				}).catch(function(err) {
					done(err);
				});
			});
			it('should returned source data having "payload"', function() {
				secondSourceHtml.should.not.equals(null);
			});
			it('should returned friend list "array"', function() {
				var extractor = require('../../../services/facebook/friends-getter/nextpage-getter/extractor');
				var aList = extractor.getListFromSourceData(secondSourceHtml, oUserCookie);
				return aList.should.eventually.be.a('array');
			});
		});
	});
});
