var https = require('https'),
	querystring = require('querystring'),
	randomstring = require('randomstring');

var getUserCookie = function(obj) {
	return new Promise(
		function(resolve, reject) {
			var postData, options, datr, req;
			postData = setLoingData(obj);
			//cookie data to authenticate user in facebook
			datr = randomstring.generate(24);
			options = setHttpsOptions(postData, datr);
			req = makeRequest(resolve, reject, datr, options);
			req.write(postData);
			req.end();
		}
	);
};

var setLoingData = function(obj) {
	return querystring.stringify(obj);
};
var setHttpsOptions = function(postData, datr) {
	return {
		host: 'www.facebook.com',
		port: 443,
		path: '/login.php',
		method: 'POST',
		headers: {
			'Cache-Control': 'no-cache',
			'Cookie': 'datr=' + datr,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36'
		}
	};
};
var makeRequest = function(resolve, reject, datr, options) {
	return https.request(options, function(res) {
		var arrCookie = res.headers['set-cookie'];
		if (!arrCookie) {
			var err = new Error('login failed');
			err.name = 'fb001';
			reject(err);
			return;
		}
		resolve(getCuserAndXsFromCookie(arrCookie, datr));
	});
};

var getCuserAndXsFromCookie = function(arrCookie, datr) {
	var oUserCookie = {};
	var getCuserFromStr = function(str) {
		var matchedStr = str.match(/c_user\s*=\s*([0-9]+)/);
		if (matchedStr)
			return matchedStr[1];
		return null;
	};
	var getXsFromStr = function(str) {
		var matchedStr = str.match(/xs\s*=\s*([^;]+)/);
		if (matchedStr)
			return matchedStr[1];
		return null;
	};

	arrCookie.forEach(function(elem) {
		var tempVal = getCuserFromStr(elem);
		if (tempVal) {
			oUserCookie.cuser = tempVal;
			return;
		}
		tempVal = getXsFromStr(elem);
		if (tempVal) {
			oUserCookie.xs = tempVal;
			return;
		}
	});
	arrCookie.datr = datr;
	return oUserCookie;
}; 
exports.getUserCookie = getUserCookie;
