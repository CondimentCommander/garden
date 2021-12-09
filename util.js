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
function say(event) {
	//console.log(event.clientX - Graphics.screenInfo().mr - 8, event.clientY - 8);
}

function randRot() {
	let r = Math.random() * 360;
	return snapValue(r, 90);
}

function getArea(x, y, w, h, a) {
	if (w + x > a[0].length) w = a[0].length - x;
	if (h + y > a.length) h = a.length - y;
	if (x < 0) x = 0;
	if (y < 0) y = 0;
	let out = [];
	for (i = y; i < h + y; i++) {
		out.push([]);
		for (let j = x; j < w + x; j++) {
			out[i - y].push(a[i][j]);
		}
	}
	return out;
}
function clearChildren(elem) {
	while (elem.hasChildNodes()) {
		elem.removeChild(elem.firstChild);
	}
}
function chance(c) {
	let rand = Math.random();
	return rand <= chance;
}
function weightedChance(weights) {
	let v = Object.values(weights);
	let k = Object.keys(weights).map(e => {return parseInt(e)});
	let sum = k.reduce((s, e) => {return s});
	//let w = k.map(e => {return e / sum});
	while (found) {

	}
}