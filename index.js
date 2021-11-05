var rw = 1.0;
var rh = 1.0;

function lockValue(v, min, max) {
	if (v < min) return min;
	if (v > max) return max;
	return v;
}

var Game = {
	clickTile: (ev) => {
		//console.log(ev.srcElement.cellIndex, ev.srcElement.parentElement.rowIndex);
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex]
		let id = tile.sprite;
		let sprite = Graphics.elems[id];
		//if (sprite.img == 'images/grassbad.png') Graphics.elems[id].replace(new Graphics.AnimatedSpriteElement(tile.x, tile.y, { img: 'images/animtest.png', count: 8, rc: 4, ft: 5, s: 12, viewLayer: 2 }));
		//if (sprite.img == 'images/animtest.png') Graphics.elems[id].replace(new Graphics.SpriteElement(tile.x, tile.y, { img: 'images/grassbad.png', s: 16, opacity: 0.5, viewLayer: 2 }));
	},
	hoverTile: (ev) => {
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex];
		ev.srcElement.style.opacity = 0.14;
		//Graphics.elems[tile.sprite].op = lockValue(Graphics.elems[tile.sprite].op - 0.4, 0, 1);
		//Graphics.elems[tile.plant.sprite].optemp = Graphics.elems[tile.plant.sprite].op;
		//Graphics.elems[tile.plant.sprite].op = lockValue(Graphics.elems[tile.plant.sprite].op - 0.2, 0, 1);
	},
	hoverOffTile: (ev) => {
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex];
		ev.srcElement.style.opacity = 0;
		//Graphics.elems[tile.sprite].op = 1;
		//Graphics.elems[tile.plant.sprite].op = Graphics.elems[tile.plant.sprite].optemp;
	},
	mouseDown: false,
	panStartX: 0,
	panStartY: 0,
	plotX: 0,
	plotY: 0,
	panStart: (event) => {
		Game.mouseDown = true;
		Game.panStartX = event.offsetX;
		Game.panStartY = event.offsetY;
		Game.plotX = Plot.tb.getBoundingClientRect().left;
		Game.plotY = Plot.tb.getBoundingClientRect().top;
	},
	panStop: (event) => {
		Game.mouseDown = false;
	},
	panMove: (event) => {
		if (Game.mouseDown) {
			let margin = document.getElementById('farmview').getBoundingClientRect().left;
			let moveX = (event.offsetX - Game.panStartX) - margin;
			let moveY = (event.offsetY - Game.panStartY);
			let calcX = Game.plotX + moveX;
			let calcY = Game.plotY + moveY;
			let ts = Graphics.screenInfo().ts;
			let ss = Graphics.screenInfo().ss;
			if (calcX < 8) calcX = 8;
			if (calcX > ss - Plot.width * ts) calcX = ss - Plot.width * ts + 8;
			if (calcY < 8) calcY = 8;
			if (calcY > ss - Plot.height * ts) calcY = ss - Plot.height * ts + 8;
			Plot.pos = { x: Math.round(calcX / ts - 0.5) * (Plot.zoom / 2), y: Math.round(calcY / ts - 0.5) * (Plot.zoom / 2)};
			calcX = Math.round(calcX / ts - 0.5) * ts + 8 + margin;
			calcY = Math.round(calcY / ts - 0.5) * ts + 8;
			Graphics.setPos(Plot.tb, calcX, calcY);
			Plot.move();
		}
	},
	Plant: class {
		constructor(name, id, displayName) {
			this.name = name;
			this.id = id;
			this.dn = displayName;
			this.growth = {};
			this.events = {pretick: () => {}, grow: () => {}, posttick: () => {}};
			this.inh = {};
		}
		setinh() {
			this.inh.events = this.events;
			this.inh.growth = this.growth;
			return this;
		}
		addEvent(name, fun) {
			this.events[name] = fun;
			return this;
		}
		setGrowth(data) {
			this.growth = data;
			return this;
		}
	},
	scalePlant: (p) => {
		for (let i = 0; i < p.growth.stages.length; i++) {
			let s = p.growth.stages[i];
			s.sls = Plot.zoom / s.slsa;
			s.s = Plot.zoom / s.sa;
		}
	},
	init: () => {
		Game.plants = [
			new Game.Plant('test', 0, 'Test').setGrowth({speed: 2, matureTime: 5, decay: 1, stages: [{ img: 'images/lime/2.png', sa: 2, opacity: 1, viewLayer: 3 }, { img: 'images/lime/1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3 }]}).setinh(),
			new Game.Plant('empty', 1, 'None').setGrowth({speed: 0, matureTime: 5, decay: 1, stages: [{ img: 'images/grassbad.png', sa: 2, opacity: 0, viewLayer: 3 }]}).setinh(),
			new Game.Plant('grass', 2, 'Grass').setGrowth({speed: 2, matureTime: 3, decay: 1, stages: [{ img: 'images/sprites1.png', sa: 2, opacity: 1, viewLayer: 3, sx: 16, sy: 48, slsa: 32 }, { img: 'images/sprites1.png', sa: 2, opacity: 1, viewLayer: 3, sx: 32, sy: 48, slsa: 32 }, { img: 'images/sprites1.png', sa: 2, opacity: 1, viewLayer: 3, sx: 48, sy: 48, slsa: 32 }]}).setinh(),
		];
		Game.plants.forEach((p) => {Game.scalePlant(p)});
	},
	dev: {
		fertilizer: 1
	}
};


const Language = {};
var Data = {};


function start() {
	Plot.farm = document.getElementById('farmview');
	Plot.plot = document.getElementById('plot');
	Plot.tb = document.getElementById('plott');
	Graphics.overlay = document.getElementById('overlay');
	Graphics.ov = Graphics.overlay.getContext('2d');
	Graphics.canvas = document.getElementById('can');
	Graphics.ctx = Graphics.canvas.getContext('2d');
	Graphics.initial();
	Game.init();
	Plot.generate();
	Plot.render();
	Plot.changeZoom(64);
	
	Graphics.timerEl = document.getElementById('ticktimer');
	Graphics.time = Plot.cycletime / 1000;
	Plot.tick();
	Plot.cycle = setInterval(Plot.tick, Plot.cycletime);
	
	console.log('Loaded!');
}


