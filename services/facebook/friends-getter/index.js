var	firstpageGetter = require('./firstpage-getter'),
	nextpageGetter = require('./nextpage-getter'),
	cheerio = require('cheerio'),
	commons = require('./commons'),
	winston = require('winston');

var getFriends = function(oUserCookie, sUserUrl) {
	var arrFriends, flagResolve, nCurSourceData, nCurFriendsGroup;
	arrFriends = [];
	flagResolve = false;
	nCurSourceData = 0;
	nCurFriendsGroup = 0;

	var getFriendsFromSinglePage = function(oPageGetter, oUserCookie, oInfo, resolve, reject) {
		oPageGetter.getSourceData(oUserCookie, oInfo).then(function(sSourceData) {
			var oNextPageInfo;

			nCurSourceData++;
			oNextPageInfo = commons.nextpageInfoGetter.getInfo(oUserCookie, sSourceData);

			if (oNextPageInfo) {
				extractFriendsFromSourceData(oPageGetter, sSourceData, oUserCookie, resolve, reject);
				return getFriendsFromSinglePage(nextpageGetter, oUserCookie, oNextPageInfo, resolve, reject);
			}

			flagResolve = true;
			//확실한 종료를 위해 flagResolve를 변경한 후 실행
			//꼬리 재귀를 위한 중복
			extractFriendsFromSourceData(oPageGetter, sSourceData, oUserCookie, resolve, reject);
		}).catch(function(err) {
			reject(err);
		});
	};

	var extractFriendsFromSourceData = function(oPageGetter, sSourceData, oUserCookie, resolve, reject) {
		oPageGetter.extractFromSourceData(sSourceData, oUserCookie).then(function(aOFriends) {
			arrFriends = arrFriends.concat(aOFriends);
			nCurFriendsGroup++;

			if (nCurSourceData == nCurFriendsGroup && flagResolve) {
				winston.debug('The total number of friends is ' + arrFriends.length);
				resolve(arrFriends);
			}
		}).catch(function(err) {
			reject(err);
		}); 
	};

	return new Promise(function(resolve, reject) {
		getFriendsFromSinglePage(firstpageGetter, oUserCookie, sUserUrl, resolve, reject);
	});
};

exports.getFriends = getFriends;
