var findBracketPair = function(str, targetNum) {
	var curNum = 0,
		startIdx = 0,
		endIdx = 0,
		openedBracketCnt = 0;

	for (var idx = 0; idx < str.length; idx++) {
		if (str[idx] === '[') {
			openedBracketCnt++;
			if (openedBracketCnt === 1) {
				curNum++;
				if (curNum === targetNum) {
					startIdx = idx;
				}
			}
			continue;
		}
		if (str[idx] === ']') {
			openedBracketCnt--;
			if (openedBracketCnt === 0 && curNum === targetNum) {
				endIdx = idx;
				return str.slice(startIdx, endIdx + 1);
			}
		}
	}
};

exports.findBracketPair = findBracketPair;
