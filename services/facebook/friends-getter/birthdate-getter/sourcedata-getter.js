var https = require('https'),
	winston = require('winston'),
	facebookError = require('../../enum').error;

var getSourceData = function(oUserCookie, sFriendUrl) {
	return new Promise(
		function(resolve, reject) {
			var options, req;
			options = setHttpsOptions(oUserCookie, sFriendUrl);
			req = makeRequest(resolve, reject, options);
			req.end();
		}
	);
};

var setHttpsOptions = function(oUserCookie, sFriendUrl) {
	return {
		host: 'www.facebook.com',
		port: 443,
		path: '/' + sFriendUrl + '&sk=about',
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
			data += chunk;
		});
		res.on('end', function() {
			if (!data) {
				winston.debug(options.path);
				reject(facebookError.FB003);
				return;
			}
			winston.debug('time to get birthdate sourcedata', process.hrtime(startTime));
			resolve(data);
		});
	}); 
};

exports.getSourceData = getSourceData;
