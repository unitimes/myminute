var cheerio = require('cheerio'),
	winston = require('winston'),
	listMaker = require('../commons/list-maker');

var getListFromSourceData = function(sSourceData, oUserCookie) {
	var $;

	$ = makeJQueryObject(sSourceData);

	return listMaker.makeList($, oUserCookie);
};

var makeJQueryObject = function(sSourceData) {
	var sTarget;

	sTarget = sSourceData.match(/<ul((?:(?!\/ul)[\w\W])*)\/ul>/)[0];
	return cheerio.load(sTarget);
};

exports.getListFromSourceData = getListFromSourceData;
