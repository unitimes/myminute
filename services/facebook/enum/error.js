var error = {};

var makeError = function(name, msg) {
	var err;
	err = new Error(msg);
	err.name = name;
	return err;
};

error.FB001 = makeError('fb001', 'login failed');
error.FB002 = makeError('fb002', 'no user url');
error.FB003 = makeError('fb003', 'empty data');
error.FB004 = makeError('fb004', 'no friends source data');

module.exports = error;
