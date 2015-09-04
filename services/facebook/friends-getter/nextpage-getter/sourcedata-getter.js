var https = require('https'),
	querystring = require('querystring'),
	winston = require('winston'),
	facebookEnum = require('../../enum');

var getSourceData = function(oUserCookie, oInfo) {
	return new Promise(
		function(resolve, reject) {
			var options, req;
			options = setHttpsOptions(oUserCookie, oInfo);
			req = makeRequest(resolve, reject, options);
			req.end();
		}
	);
};

var setHttpsOptions = function(oUserCookie, oInfo) {
	var stringfiedQuery = makeQuery(oInfo);
	winston.debug(stringfiedQuery);
	return {
		host: 'www.facebook.com',
		path: '/ajax/pagelet/generic.php/AllFriendsAppCollectionPagelet?' + stringfiedQuery,
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Cookie': 'datr=' + oUserCookie.datr + '; c_user=' + oUserCookie.cuser + '; xs=' + oUserCookie.xs,
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36'
		}
	};
};

var makeQuery = function(oInfo) {
	return 'data=%7B"collection_token"%3A"' + encodeURIComponent(oInfo.collectionToken) + '"%2C"cursor"%3A"' + oInfo.cursor + '"%2C"profile_id"%3A' + oInfo.profileId + '%7D&__user=' + oInfo.profileId + '&__a=1';
};

var makeRequest = function(resolve, reject, options) {
	var startTime = process.hrtime();
	var checkAndResolve = function(spotData, res) {
		if (spotData.match(/FriendListFlyoutController/)) {
			resolve(spotData);
			res.emit('end');
			return;
		}
	};

	return https.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk;
			checkAndResolve(data, res);
		});

		res.on('end', function() {
			if (!data) {
				reject(facebookEnum.error.FB003);
				return;
			}
			if (!data.match(/uiList/)) {
				reject(facebookEnum.error.FB004);
				return;
			}
			winston.debug(process.hrtime(startTime));
		});
	});
};

exports.getSourceData = getSourceData;
