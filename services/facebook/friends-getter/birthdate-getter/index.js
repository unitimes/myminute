var brithDateExtracter = require('./birthdate-extracter'),
	winston = require('winston'),
	sourceDataGetter = require('./sourcedata-getter');

var getBirthdate = function(oUserCookie, sFriendUrl) {
	return new Promise(
		function(resolve, reject) {
			sourceDataGetter.getSourceData(oUserCookie, sFriendUrl).then(function(data) {
				winston.debug('got birth data');
				resolve(brithDateExtracter.extractBirthdate(data));
			}).catch(function(err) {
				winston.debug(err);
				reject(err);
			});
		}
	);
};

exports.getBirthdate = getBirthdate;
