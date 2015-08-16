var https = require('https'),
	querystring = require('querystring');

var getSourceData = function(oUserCookie, sUserUrl) {
	return new Promise(
		function(resolve, reject) {
			var options, req;
			options = setHttpsOptions(oUserCookie, sUserUrl);
			req = makeRequest(resolve, reject, options);
			req.end();
		}
	);
};

var setHttpsOptions = function(oUserCookie, sUserUrl) {
	return {
		host: 'www.facebook.com',
		port: 443,
		path: '/' + sUserUrl + '/friends',
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Cookie': 'datr=' + oUserCookie.datr + '; c_user=' + oUserCookie.cuser + '; xs=' + oUserCookie.xs,
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36'
		}
	};
};

var makeRequest = function(resolve, reject, options) {
	return https.request(options, function(res) {
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			var err;
			if (!data) {
				err = new Error('empty data');
				err.name = 'fb003';
				reject(err);
				return;
			}
			if (!data.match(/uiList _262m/)) {
				err = new Error('no friends source data');
				err.name = 'fb004';
				reject(err);
				return;
			}
			resolve(data);
		});
	});
};

exports.getSourceData = getSourceData;
