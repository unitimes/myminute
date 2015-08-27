var https = require('https'),
	winston = require('winston'),
	facebookEnum = require('../../enum');

var getSourceDataAtYearAndMon = function(oUserCookie, sId, date) {
	return new Promise(
		function(resolve, reject) {
			var options, req;
			options = setHttpsOptions(oUserCookie, sId, date);
			req = makeRequest(resolve, reject, optons);
			req.end();
		};
	);
};

var setHttpsOptions = function(oUserCookie, sId, date) {
	return {
		host: 'www.facebook.com',
		path: '/' + sId + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Cookie': 'datr=' + oUserCookie.datr + '; c_user=' + oUserCookie.cuser + '; xs=' + oUserCookie.xs,
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36'
		}
	};
};

var makeRequest = function(resolve, reject, options) {
	var startTime = process.hrtime();
	return https.request(options, function(res) {
		var data = '';
		res.on('data', function(chunk) {

		});
	});
};
