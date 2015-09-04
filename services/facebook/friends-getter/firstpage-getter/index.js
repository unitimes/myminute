var extractor = require('./extractor'),
	sourceDataGetter = require('./sourceData-getter');

exports.getSourceData = sourceDataGetter.getSourceData;
exports.extractFromSourceData = extractor.getListFromSourceData;
