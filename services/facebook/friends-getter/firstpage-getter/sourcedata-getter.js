var https = require('https'),
	winston = require('winston'),
	facebookError = require('../../enum').error;

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
	var starttimeOfReq, starttimeOfGetData;
	starttimeOfReq = process.hrtime();
	var checkAndResolve = function(spotData, res) {
		if (spotData.match(/enableContentLoader(?:(?!app_collection)[\w\W])*app_collection_((?:(?!")[\w\W])*)/)) {
			winston.debug('time to get firstpage-sourcedata body data', process.hrtime(starttimeOfGetData));
			resolve(spotData);
			res.emit('end');
			return;
		}
	};
	return https.request(options, function(res) {
		var data = '';
		var fFirst = true;

		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			if (fFirst) {
				fFirst = false;
				starttimeOfGetData = process.hrtime();
			}
			data += chunk;
			checkAndResolve(data, res);
		});
		res.on('end', function() {
			if (!data) {
				reject(facebookError.FB003);
				return;
			}
			if (!data.match(/uiList _262m/)) {
				reject(facebookError.FB004);
				return;
			}
			winston.debug('time to get firstpage-sourcedata', process.hrtime(starttimeOfReq));
		});
	});
};

exports.getSourceData = getSourceData;
