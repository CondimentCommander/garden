const million = 1000000;
const billion = 1000000000;
const trillion = 1000000000000;

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

function randRotVertical() {
	let r = Math.random() * 270;
	return snapValue(r, 180);
}

function randRotHorizontal() {
	let r = Math.random() * 270;
	return snapValue(r, 180) + 90;
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
	return rand <= c;
}
function chanceChoose(array) {
	let rand = Math.random();
	let num = Math.floor(rand * (array.length - 0.1));
	return num;
}
function weightedChance(weights) {
	let v = Object.values(weights);
	let k = Object.keys(weights).map(e => {return parseInt(e)});
	let sum = k.reduce((s, e) => {return s + e});
	let out = undefined;
	while (out == undefined) {
		let rand = Math.random() * sum;
		let choice = chanceChoose(v);
		if (rand <= k[choice]) out = v[choice];
	}
	return out;
}
function textDiv(text) {
	let div = document.createElement("DIV");
	div.appendChild(document.createTextNode(text));
	return div;
}