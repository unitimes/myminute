var cheerio = require('cheerio'),
	winston = require('winston');

var getList = function(sHtml) {
	var $, body,
		aOFriends = [];

		body = sHtml.match(/<ul\s?class\s?=\s?\"uiList[\w\W]*<\/ul>/);
		$ = cheerio.load(body[0]);

		pushFriends($, aOFriends);
		winston.debug(aOFriends.length);

	return aOFriends;
};

var pushFriends = function($, aOFriends) {
	winston.debug('enter pushFriends');
	$('ul.uiList._262m>li').filter(function() {
		var data = $(this),
			oFriend = [],
			elTemp;

		elTemp = data.find('div>a');
		oFriend.profileid = elTemp.attr('data-hovercard').match(/id=(\d*)&/)[1];
		oFriend.fullUrl = elTemp.attr('href').match(/(https[\w\W]*)\?/)[1];
		oFriend.picture = $(elTemp).find('img').attr('src');
		oFriend.name = data.find('div>div>div.uiProfileBlockContent>div>div>div>a').text();

		winston.debug('name: %s, id: %s, url: %s, pic: %s',
									oFriend.name, oFriend.profileid, oFriend.fullUrl, oFriend.picture);
		aOFriends.push(oFriend);
	});
};

exports.getList = getList;
