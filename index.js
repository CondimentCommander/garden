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
		Graphics.elems[tile.sprite].op = lockValue(Graphics.elems[tile.sprite].op - 0.4, 0, 1);
		Graphics.elems[tile.plant.sprite].optemp = Graphics.elems[tile.plant.sprite].op;
		Graphics.elems[tile.plant.sprite].op = lockValue(Graphics.elems[tile.plant.sprite].op - 0.2, 0, 1);
	},
	hoverOffTile: (ev) => {
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex];
		Graphics.elems[tile.sprite].op = 1;
		Graphics.elems[tile.plant.sprite].op = Graphics.elems[tile.plant.sprite].optemp;
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
			let moveX = (event.offsetX - Game.panStartX);
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
			calcX = Math.round(calcX / ts - 0.5) * ts + 8;
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
	init: () => {
		Game.plants = [
			new Game.Plant('test', 0, 'Test').setGrowth({speed: 2, matureTime: 5, decay: 1, stages: [{ img: 'images/lime/2.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3 }, { img: 'images/lime/1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3 }]}).setinh(),
			new Game.Plant('empty', 1, 'None').setGrowth({speed: 0, matureTime: 5, decay: 1, stages: [{ img: 'images/grassbad.png', s: Plot.zoom / 2, opacity: 0, viewLayer: 3 }]}).setinh(),
			new Game.Plant('grass', 2, 'Grass').setGrowth({speed: 2, matureTime: 3, decay: 1, stages: [{ img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3, sx: 16, sy: 48, sls: Plot.zoom / 32 }, { img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3, sx: 32, sy: 48, sls: Plot.zoom / 32 }, { img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3, sx: 48, sy: 48, sls: Plot.zoom / 32 }]}).setinh(),
		];
	},
	dev: {
		fertilizer: 100
	}
};
var Plot = {
	tiles: [],
	width: 3,
	height: 3,
	pos: { x: 0, y: 0 },
	zoom: 64,
	cycletime: 5000,
	generate: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			let row = Plot.tb.insertRow(i);
			Plot.tiles.push([]);
			for (let j = 0; j < Plot.width; j++) {
				let cell = row.insertCell(j);
				cell.classList.add('tile_b');
				cell.onclick = Game.clickTile;
				cell.onmouseover = Game.hoverTile;
				cell.onmouseout = Game.hoverOffTile;
				Plot.tiles[i].push(new Plot.Tile(j * ps, i * ps, 0));
				Plot.tiles[i][j].plant = new Plot.PlantTile(Game.plants[1], Plot.tiles[i][j]);
			}
		}
	},
	Tile: class {
		constructor(x, y, soil) {
			this.x = x;
			this.y = y;
			this.plotx = x;
			this.ploty = y;
			this.soil = soil;
			this.plant = undefined;
		}
	},
	PlantTile: class {
		constructor(plant, tile) {
			this.plant = plant;
			this.inh = plant.inh;
			this.tile = tile;
			this.stage = 0;
			this.life = 0;
			this.stagetime = 0;
			this.grows = 0;
			this.sprite = Graphics.fromData(this.inh.growth.stages[0], tile.x, tile.y);
			this.sprite.tag = "Plant";
			this.sprite = this.sprite.add();
		}
	},
	execute: (func) => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				func(Plot.tiles[i][j], i, j);
			}
		}
	},
	tick: () => {
		Plot.execute((tile, i, j) => {if (tile.plant != undefined) tile.plant.inh.events.pretick()});
		Plot.execute((tile, i, j) => {if (tile.plant != undefined) Plot.grow(tile)});
		Graphics.prog = Plot.cycletime / 30;
		//console.log('tick!');
	},
	stop: () => {
		clearInterval(Plot.cycle);
	},
	grow: (tile) => {
		let plant = tile.plant;
		plant.life++;
		if (plant.plant.id == 1 && tile.soil == 0) {Plot.growWeed(tile); return}
		if (plant.inh.growth.speed == 0) return;
		let length = plant.inh.growth.stages.length - 1;
		if (plant.stage == 0) {
			plant.stagetime++;
			let chance = plant.inh.growth.speed * 0.014 * Game.dev.fertilizer;
			let dbchance = plant.inh.growth.speed * 0.003 * Game.dev.fertilizer;
			let rand = Math.random();
			if (rand <= chance) {
				if (rand <= dbchance) plant.grows += 2;
				if (rand > dbchance) plant.grows++;
				if (plant.grows >= length) {
					plant.stage = 1;
					plant.stagetime = 0;
					plant.grows = length;
					Plot.mutate(tile);
				}
				//console.log(plant.grows);
				Graphics.elems[plant.sprite].replace(Graphics.fromData(plant.inh.growth.stages[plant.grows], tile.x, tile.y));
			}
		} else {
			if (plant.stage == 1) {
				plant.stagetime++;
				if (plant.stagetime >= plant.inh.growth.matureTime) {
					plant.stage = 2;
					plant.stagetime = 0;
				}
			} else {
				if (plant.stage == 2) {
					plant.stagetime++;
					let chance = plant.inh.growth.speed * 0.026 * plant.inh.growth.decay * Math.pow(plant.stagetime, 2) * Game.dev.fertillizer;
					let rand = Math.random();
					Graphics.elems[plant.sprite].op = lockValue(1 - chance * 4);
					if (rand <= chance) Plot.decay(tile);
				}
			}
		}
	},
	growWeed: (tile) => {
		let plant = tile.plant;
		let chance = 0.012 * Game.dev.fertilizer;
		let rand = Math.random();
		if (rand <= chance) {
			Plot.plant(tile, Game.plants[2]);
		}
	},
	mutate: (tile) => {
		
	},
	decay: (tile) => {
		Plot.uproot(tile);
	},
	uproot: (tile) => {
		if (Graphics.elems[tile.plant.sprite] == null) return;
		Graphics.elems[tile.plant.sprite].remove();
		tile.plant = new Plot.PlantTile(Game.plants[1], tile);
	},
	plant: (tile, plant) => {
		Graphics.elems[tile.plant.sprite].remove();
		tile.plant = new Plot.PlantTile(plant, tile);
	},
	render: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				Plot.tiles[i][j].sprite = new Graphics.SpriteElement(j * ps + Plot.pos.x, i * ps + Plot.pos.y, { img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: Plot.zoom / 2, sls: Plot.zoom / 32 }).add();
			}
		}
	},
	move: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let tile = Plot.tiles[i][j];
				let sprite = Graphics.elems[tile.sprite];
				sprite.pos.x = j * ps + Plot.pos.x;
				sprite.pos.y = i * ps + Plot.pos.y;
				tile.x = sprite.pos.x;
				tile.y = sprite.pos.y;
				sprite.prop();
				sprite = Graphics.elems[tile.plant.sprite];
				//console.log(sprite);
				sprite.pos.x = tile.x;
				sprite.pos.y = tile.y;
				sprite.prop();
			}
		}
		for (let i = 0; i < 11; i++) {
			Object.values(Graphics.elemLayers[i]).forEach((element) => {
				if (element.pan) {
					
				}
			});
		}
	},
	changeZoom: (z) => {
		Plot.zoom = z;
		let tiles = document.getElementsByClassName('tile_b');
		for (let i = 0; i < tiles.length; i++) {
			tiles[i].style.padding = Plot.zoom / 4 + 'px';
			//tiles[i].style.height = Plot.zoom / 16 + 'px';
		}
	},
	renderUpdate: () => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let sprite = Graphics.elems[Plot.tiles[i][j].sprite];
			}
		}
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
	Plot.cycle = setInterval(Plot.tick, Plot.cycletime);
	console.log('Loaded!');
}

// fix tick timer
// fix opacity changes on multiple sprites (top right tile)
