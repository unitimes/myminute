var stringUtil = require('../../../utils/string'),
	winston = require('winston');

var getInfo = function(oUserCookie, sHtml) {
	var sSrc,
	oTemp,
	oInfo = {},
	startIdx = sHtml.indexOf('enableContentLoader');

	if (startIdx < 0)
		return null;
	sSrc = sHtml.slice(startIdx, startIdx + 200);

	oTemp = JSON.parse(stringUtil.findBracketPair(sSrc, 2));
	oInfo.collectionToken = oTemp[0].match(/app_collection_((?:(?!")[\w\W])*)/)[1];
	oInfo.cursor = oTemp[2];
	oInfo.profileId = oUserCookie.cuser;

	winston.debug('collection_token: %s, cursor: %s, profile_id: %s', oInfo.collectionToken, oInfo.cursor, oInfo.profileId);
	return oInfo;
};

exports.getInfo = getInfo;
