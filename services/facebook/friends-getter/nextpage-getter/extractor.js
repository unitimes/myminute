var cheerio = require('cheerio'),
	winston = require('winston'),
	listMaker = require('../commons/list-maker');

var getListFromSourceData = function(sSourceData, oUserCookie) {
	var $, sParsedSourceData;

	sParsedSourceData = parseSourceData(sSourceData);
	$ = makeJQueryObject(sParsedSourceData);

	return listMaker.makeList($, oUserCookie);
};

var makeJQueryObject = function(sSourceData) {
	var sTarget;

	sTarget = sSourceData.match(/<ul((?:(?!\/ul)[\w\W])*)\/ul>/)[0];
	return cheerio.load(sTarget);
};

var parseSourceData = function(data) {
	data = data.match(/payload"\s*:\s*((?:(?!ul>)[\w\W])*ul>)/)[1];
	data = JSON.parse(data + '"');
	return data;
};

exports.getListFromSourceData = getListFromSourceData;
