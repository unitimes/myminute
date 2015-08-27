var https = require('https'),
	winston = require('winston'),
	facebookError = require('./enum').error;

var getUserUrl = function(oUserCookie) {
	return new Promise(
		function(resolve, reject) {
			var options, req;
			options = setHttpsOptions(oUserCookie);
			req = makeRequest(resolve, reject, options);
			req.end();
		}
	);
};

var setHttpsOptions = function(oUserCookie) {
	return {
		host: 'www.facebook.com',
		port: 443,
		path: '/' + oUserCookie.cuser,
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Cookie': 'datr=' + oUserCookie.datr + '; c_user=' + oUserCookie.cuser + '; xs=' + oUserCookie.xs,
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36'
		}
	};
};

var makeRequest = function(resolve, reject, options) {
	var startTime;
	startTime = process.hrtime();
	return https.request(options, function(res) {
		var fullUrl = res.headers.location;
		var userUrl = fullUrl.match(/www.facebook.com\/([\w\W]*)/)[1];
		if (!userUrl) {
			reject(facebookError.FB002);
			return;
		}
		winston.debug('time to get user url source data', process.hrtime(startTime));
		resolve(userUrl);
	});
};

exports.getUserUrl = getUserUrl;
