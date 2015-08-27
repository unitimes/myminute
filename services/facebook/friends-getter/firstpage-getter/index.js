var friendsExtractor = require('./extractor'),
	sourceDataGetter = require('./sourceData-getter'),
	nextpageInfoGetter = require('../commons/nextpage-info-getter.js'),
	winston = require('winston');

var getFriendsFromFirstPage = function(oUserCookie, sUserUrl) {
	return new Promise(function(resolve, reject) {
		sourceDataGetter.getSourceData(oUserCookie, sUserUrl).then(function(sSourceData) {
			winston.debug('sourcedata loaded');
			getFriendsFromSourceData(resolve, reject, sSourceData, oUserCookie)
		}).catch(function(err) {
			throw(err);
		});
	});
};

var getFriendsFromSourceData = function(resolve, reject, sSourceData, oUserCookie) {
	friendsExtractor.getListFromSourceData(sSourceData, oUserCookie).then(function(aOFriends) {
		winston.debug('friends list loaded');
		resolve(aOFriends);
	}).catch(function(err) {
		reject(err);
	});
}

exports.getFriendsFromFirstPage = getFriendsFromFirstPage;
