var winston = require('winston'),
	brithDateGetter = require('../birthdate-getter');

var makeList = function($, oUserCookie) {
	var aOFriends = [];
	winston.debug('enter makeList');

	return new Promise(function(resolve, reject) {
		var promises = [];
		promises = $('ul.uiList._262m>li').map(function() {
			var jqList = $(this);

			try {
				return findAndPush($, oUserCookie, jqList, aOFriends);
			} catch(err) {
				winston.debug(err);
				// this err is not an error in this api
				// just pass it
				return;
			}
		}).get();

		Promise.all(promises).then(function() {
			winston.debug('make list completed');
			resolve(aOFriends);
		}).catch(function(err) {
			reject(err);
		});
	});
};

var findAndPush = function($, oUserCookie, jqList, aOFriends) {
	winston.debug('findAndPush entered');
	var oFriend, jqElem;
	
	oFriend = {};
	jqElem = jqList.find('div>a');

	oFriend.profileid = jqElem.attr('data-hovercard').match(/id=(\d*)&/)[1];
	oFriend.urlPath = jqElem.attr('href').match(/https:\/\/www\.facebook\.com\/([\w\W]*)&/)[1];
	oFriend.picture = jqElem.find('img').attr('src');
	oFriend.name = jqList.find('div>div>div.uiProfileBlockContent>div>div>div>a').text();

	winston.debug('before return promise');

	return new Promise(function(resolve, reject) {
		winston.debug('from list-push, naem:  %s, urlPath: %s', oFriend.name, oFriend.urlPath);
		brithDateGetter.getBirthdate(oUserCookie, oFriend.urlPath).then(function(birthDate) {
			oFriend.birthDate = birthDate;
			winston.debug('name: %s, id: %s, url: %s, pic: %s, birth: ' + oFriend.birthDate, oFriend.name, oFriend.profileid, oFriend.urlPath, oFriend.picture);
			aOFriends.push(oFriend);
			resolve();
		}).catch(function(err) {
			winston.debug(err);
			resolve();
		});
	});
};

exports.makeList = makeList;
