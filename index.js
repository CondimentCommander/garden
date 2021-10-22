var rw = 1.0;
var rh = 1.0;

var Game = {
	clickTile: (ev) => {
		//console.log(ev.srcElement.cellIndex, ev.srcElement.parentElement.rowIndex);
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex]
		let id = tile.sprite;
		let sprite = Graphics.elems[id];
		if (sprite.img == 'images/grassbad.png') Graphics.elems[id].replace(new Graphics.AnimatedSpriteElement(tile.x, tile.y, { img: 'images/animtest.png', count: 8, rc: 4, ft: 5, s: 12, viewLayer: 2 }));
		if (sprite.img == 'images/animtest.png') Graphics.elems[id].replace(new Graphics.SpriteElement(tile.x, tile.y, { img: 'images/grassbad.png', s: 16, opacity: 0.5, viewLayer: 2 }));
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
			let moveX = event.offsetX - Game.panStartX;
			let moveY = event.offsetY - Game.panStartY;
			let calcX = Game.plotX + moveX;
			let calcY = Game.plotY + moveY;
			let ts = Graphics.screenInfo().ts;
			let ss = Graphics.screenInfo().ss;
			if (calcX < 8) calcX = 8;
			if (calcX > ss - Plot.width * ts) calcX = ss - Plot.width * ts + 8;
			if (calcY < 8) calcY = 8;
			if (calcY > ss - Plot.height * ts) calcY = ss - Plot.height * ts + 8;
			Plot.pos = { x: Math.round(calcX / ts - 0.5) * 16, y: Math.round(calcY / ts - 0.5) * 16};
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
			new Game.Plant('test', 0, 'Test').setGrowth({speed: 2, matureTime: 5, decay: 1, stages: [{ img: 'images/animtest.png', count: 8, rc: 4, ft: 5, s: 12, viewLayer: 3, anim: true }, { img: 'images/grassbad.png', s: 16, opacity: 0.5, viewLayer: 3, anim: false }]}).setinh()
		];
	}
};
var Plot = {
	tiles: [],
	width: 3,
	height: 3,
	pos: { x: 0, y: 0 },
	zoom: 32,
	generate: () => {
		for (let i = 0; i < Plot.height; i++) {
			let row = Plot.tb.insertRow(i);
			Plot.tiles.push([]);
			for (let j = 0; j < Plot.width; j++) {
				let cell = row.insertCell(j);
				cell.classList.add('tile_b');
				cell.onclick = Game.clickTile;
				Plot.tiles[i].push(new Plot.Tile(j, i, 0));
				Plot.tiles[i][j].plant = new Plot.PlantTile(Game.plants[0], Plot.tiles[i][j]);
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
			if (this.inh.growth.stages[0].anim) this.sprite = new Graphics.AnimatedSpriteElement(this.tile.x, this.tile.y, this.inh.growth.stages[0]).add();
			if (!this.inh.growth.stages[0].anim) this.sprite = new Graphics.SpriteElement(this.tile.x, this.tile.y, this.inh.growth.stages[0]).add();
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
		Plot.execute((tile, i, j) => {tile.plant.inh.events.pretick()});
		Plot.execute((tile, i, j) => {Plot.grow(tile)});
		console.log('tick!');
	},
	stop: () => {
		clearInterval(Plot.cycle);
	},
	grow: (tile) => {
		let plant = tile.plant;
		plant.life++;
		if (plant.inh.growth.speed == 0) return;
		let length = plant.inh.growth.stages.length;
		if (plant.stage == 0) {
			plant.stagetime++;
			let chance = plant.inh.growth.speed * 0.04;
			let dbchance = plant.inh.growth.speed * 0.01
			let rand = Math.random();
			if (rand <= chance) {
				console.log('grew');
				if (rand <= dbchance) plant.grows += 2;
				if (rand > dbchance) plant.grows++;
				if (plant.grows >= length) {
					plant.stage = 1;
					plant.stagetime = 0;
					plant.grows = 0;
					Plot.mutate(tile);
				}
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
					let chance = plant.inh.growth.speed * 0.01 * plant.inh.decay * Math.pow(plant.stagetime, 2);
					let rand = Math.random();
					if (rand <= chance) Plot.decay(tile);
				}
			}
		}
	},
	mutate: (tile) => {
		
	},
	decay: (tile) => {
		console.log('goodbye');
	},
	render: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				Plot.tiles[i][j].sprite = new Graphics.SpriteElement(j * ps + Plot.pos.x, i * ps + Plot.pos.y, { img: 'images/grassbad.png', s: 16, opacity: 1.0, viewLayer: 2 }).add();
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
				sprite = Graphics.elems[tile.plant.sprite];
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
	Game.init();
	Graphics.initial();
	Plot.generate();
	Plot.render();
	Plot.cycle = setInterval(Plot.tick, 500);
	console.log('Loaded!');
}

// growth stage data, growing
// make some sprites at home for testing
// also break it up into multiple files maybe?     graphics on separate, plot on separate
//add spriteelement option for 'panned', which means that there is no extra code needed and the sprite will move with the plot
//make stages include sprite data (not just name)
//decay stuff
//yeah boi
