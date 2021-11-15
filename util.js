function lockValue(v, min, max) {
	if (v < min) return min;
	if (v > max) return max;
	return v;
}

function snapValue(v, snap) {
	return Math.round(v / snap - 0.5) * snap;
}

function cleanZero(v) {
	if (v == -0) return 0;
	return v;
}

function compareArrays(a1, a2) {
	if (a1.length != a2.length) return false;
	for (let i = 0; i < a1.length; i++) {
		if (a1[i] != a2[i]) return false;
	}
	return true;
}