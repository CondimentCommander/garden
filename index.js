var rw = 1.0;
var rh = 1.0;

var Game = {
	clickTile: (ev) => {
		//console.log(ev.srcElement.cellIndex, ev.srcElement.parentElement.rowIndex);
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex]
		let id = tile.sprite;
		let sprite = Graphics.elems[id];
		if (sprite.img == 'images/grassbad.png') Graphics.elems[id].replace(new Graphics.AnimatedSpriteElement(tile.x, tile.y, { img: 'images/animtest.png', count: 8, rc: 4, ft: 5, s: 12, viewLayer: 3 }));
		if (sprite.img == 'images/animtest.png') Graphics.elems[id].replace(new Graphics.SpriteElement(tile.x, tile.y, { img: 'images/grassbad.png', s: 16, opacity: 0.5, viewLayer: 3 }));
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
			this.events = {pretick: () => {}, grow: () => {}, posttick: () => {}};
			this.inh = {};
		}
		setinh() {
			this.inh.events = this.events;
			return this;
		}
		addEvent(name, fun) {
			this.events[name] = fun;
			return this;
		}
	},
	init: () => {
		Game.plants = [
			new Game.Plant('test', 0, 'Test').addEvent('pretick', () => {console.log('hi')}).setinh()
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
				Plot.tiles[i][j].plant = new Plot.PlantTile(Game.plants[0]);
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
			this.plant = null;
		}
	},
	PlantTile: class {
		constructor(plant) {
			this.plant = plant;
			this.inh = plant.inh;
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
	},
	render: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				Plot.tiles[i][j].sprite = new Graphics.SpriteElement(j * ps + Plot.pos.x, i * ps + Plot.pos.y, { img: 'images/grassbad.png', s: 16, opacity: 1.0, viewLayer: 3 }).add();
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
			}
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

var Graphics = {
	ScreenElement: class {
		constructor(x, y, data = { viewLayer: 5, opacity: 1.0 }) {
			this.pos = {x: x, y: y};
			this.lr = data.viewLayer;
			if (this.lr == undefined) this.lr = 5;
			this.op = data.opacity;
			this.data = data;
			this.id = this.randomId();
			this.canvas = this.renderInfo();
		}
		randomId() {
			let rand = Math.floor(Math.random() * 10000);
			while (Object.keys(Graphics.elems).includes(rand.toString())) {
				rand = Math.floor(Math.random() * 10000);
			}
			return rand;
		}
		add() {
			Graphics.elems[this.id] = this;
			Graphics.elemLayers[this.lr][this.id] = this;
			return this.id;
		}
		remove() {
			delete Graphics.elemLayers[this.lr][this.id];
			delete Graphics.elems[this.id];
		}
		renderInfo() {
			if (this.lr > 5) return Graphics.ov;
			if (this.lr <= 5) return Graphics.ctx;
		}
		predraw() { //for general actions done before drawing an element
			Graphics.ctx.globalAlpha = this.opacity; //used to set opacity of the element
		}
		prop() { //updates the current value of the element in the element list to be in the layer
			Graphics.elemLayers[this.lr][this.id] = this;
		}
		replace(rp) {
			rp.id = this.id;
			Graphics.elemLayers[this.lr][this.id] = rp;
			//Graphics.elemLayers[this.lr][this.id].id = this.id;
			Graphics.elems[this.id] = rp;
		}
	},
	defineElements: () => {
		Graphics.SpriteElement = class extends Graphics.ScreenElement {
			constructor(x = 0, y = 0, data = { img: '', s: 1, viewLayer: 5, opacity: 1.0 }) {
				super(x, y, data);
				this.img = data.img; //static image to use for the sprite
				this.image = new Image(); //image object loaded for the sprite on creation
				this.ready = false;
				this.image.onload = () => {
					this.ready = true;
				};
				this.image.src = this.img;
				this.scale = data.s;
			}
			draw() {
				this.predraw();
				this.canvas.drawImage(this.image, this.pos.x, this.pos.y, this.scale, this.scale);
			}
		}
		Graphics.AnimatedSpriteElement = class extends Graphics.SpriteElement {
			constructor(x = 0, y = 0, data = { img: '', ft: 5, count: 1, rc: 1, s: 1, viewLayer: 5, opacity: 1.0 }) {
				super(x, y, data);
				this.frametime = data.ft; //amount of frames to hold each frame image for
				this.count = data.count; //total number of frames in the spritesheet
				this.rc = data.rc; //anmount of frames per row
				this.frame = 0; //the amount of frames since the last cycle. Does not represent the frametime
				this.calcframe = 0; //the frame of the image to use, that respects the frame hold time
			}
			draw() {
				this.predraw();
				this.calcframe = Math.ceil((this.frame + 1) / this.frametime) - 1;
				let size = this.image.width / this.rc;
				let calcrow = Math.floor(this.calcframe / this.rc) * size;
				let calcpos = (this.calcframe % this.rc) * size;
				this.canvas.drawImage(this.image, calcpos, calcrow, size, size, this.pos.x, this.pos.y, size, size);
				this.frame++;
				if (this.frame >= (this.count) * this.frametime) this.frame = 0;
			}
		}
	},
	setPos: (elem, x, y) => {
		let rect = elem.getBoundingClientRect();
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
	},
	screenInfo: () => {
		let pixelsize = Plot.zoom / 2;
		let screensize = Plot.farm.clientWidth;
		let tilesize = screensize / Plot.zoom;
		return {ts: tilesize, ps: pixelsize, ss: screensize};
	},
	refresh: () => {
		Graphics.ctx.clearRect(0, 0, 512, 512);
		Graphics.ov.clearRect(0, 0, 1280, 720);
	},
	elems: {},
	elemLayers: [],
	testPattern: () => {
		for (let i = 0; i < 512; i+=16) {
			for (let j = 0; j < 512; j+=16) {
				if (i % 32 == 0 && j % 32 == 0) {
					Graphics.ctx.fillRect(i, j, 16, 16);
				}
			}
		}
	},
	initial: () => {
		Graphics.defineElements();
		for (let i = 0; i < 11; i++) {
			Graphics.elemLayers.push({});
		}
		//Graphics.foo = new Graphics.AnimatedSpriteElement(0, 0, { img: 'images/animtest.png', count: 8, rc: 4, ft: 5, s: 12, viewLayer: 0 }).add();
		//Graphics.bar = new Graphics.SpriteElement(100, 100, { img: 'images/grassbad.png', s: 16, opacity: 0.5, viewLayer: 0 }).add();
		Graphics.interval = setInterval(Graphics.update, 1000 / 30);
	},
	update: () => {
		Graphics.refresh();
		for (let i = 0; i < 11; i++) {
			Object.values(Graphics.elemLayers[i]).forEach((element) => {
				element.draw();
			});
		}
	},
	stop: () => {
		clearInterval(Graphics.interval);
	},
};
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
	console.log('Loaded!');
}

// growth stage data, growing
// make some sprites at home for testing
// also break it up into multiple files maybe?     graphics on separate, plot on separate