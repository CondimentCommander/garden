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
