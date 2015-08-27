var winston = require('winston');

var extractBirthdate = function(sHtml) {
	var year, month, day, sArrMatched;

	winston.debug('extract entered');

	sArrMatched = sHtml.match(/생일(?:(?!<div>)[\w\W])*<div>(?:(?!\d|<\/div>)[\D])*(\d{4})(?:(?!\d|<\/div>)[\D])*(\d)\D(?:(?!\d|<\/div>)[\D])*(\d*)/);
	try {
		winston.debug(sArrMatched[0]);
		year = parseInt(sArrMatched[1]);
		month = parseInt(sArrMatched[2]);
		day = parseInt(sArrMatched[3]);
	} catch(err) {
		return null;
	}
	winston.debug('year: %d, month: %d, day: %d', year, month, day);
	return new Date(year, month - 1, day);
};

exports.extractBirthdate = extractBirthdate;
