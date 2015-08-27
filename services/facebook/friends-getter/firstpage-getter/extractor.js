var cheerio = require('cheerio'),
	winston = require('winston'),
	listMaker = require('../commons/list-maker');

var getListFromSourceData = function(sSourceData, oUserCookie) {
	var $;

	$ = makeJQueryObject(sSourceData);

	winston.debug('jquery object maked');

	//listPush.pushFriends return promise
	return listMaker.makeList($, oUserCookie);
};

var makeJQueryObject = function(sSourceData) {
	var sTarget;

	sTarget = sSourceData.match(/<ul\s?class\s?=\s?\"uiList[\w\W]*<\/ul>/)[0];
	return cheerio.load(sTarget);
};

exports.getListFromSourceData = getListFromSourceData;
