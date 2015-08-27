var getDateOfCurSubtrOffset = function(offset) {
	var nCur;

	nCur = Date.now();
	return new Date(nCur - offset);
};
