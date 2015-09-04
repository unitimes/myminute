var	extractor = require('./extractor'),
	sourcedataGetter = require('./sourcedata-getter');

exports.getSourceData = sourcedataGetter.getSourceData;
exports.extractFromSourceData = extractor.getListFromSourceData;
