var rw = 1.0;
var rh = 1.0;

var Game = {
	clickTile: (ev) => {
		//console.log(ev.srcElement.cellIndex, ev.srcElement.parentElement.rowIndex);
		let tile = Plot.tiles[ev.srcElement.parentElement.rowIndex][ev.srcElement.cellIndex]
		let id = tile.sprite;
		let sprite = Graphics.elems[id];
		if (sprite.img == 'images/grassbad.png') Graphics.elems[id].replace(new Graphics.AnimatedSpriteElement(tile.x * 16, tile.y * 16, { img: 'images/animtest.png', count: 8, rc: 4, ft: 5, s: 12, viewLayer: 3 }));
		if (sprite.img == 'images/animtest.png') Graphics.elems[id].replace(new Graphics.SpriteElement(tile.x * 16, tile.y * 16, { img: 'images/grassbad.png', s: 16, opacity: 0.5, viewLayer: 3 }));
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
		Game.plotX = Plot.plott.getBoundingClientRect().left;
		Game.plotY = Plot.plott.getBoundingClientRect().top;
	},
	panStop: (event) => {
		Game.mouseDown = false;
	},
	panMove: (event) => {
		if (Game.mouseDown) {
			let moveX = event.offsetX - Game.panStartX;
			let moveY = event.offsetY - Game.panStartY;
			let rect = Plot.plott.getBoundingClientRect();
			rect.left = Game.plotX 
		}
	},
	Plant: class {
		constructor(name, id, displayName) {
			this.name = name;
			this.id = id;
			this.dn = displayName;
		}
	}
};
var Plot = {
	tiles: [],
	width: 3,
	height: 3,
	pos: { x: 0, y: 0 },
	generate: () => {
		for (let i = 0; i < Plot.height; i++) {
			let row = Plot.tb.insertRow(i);
			Plot.tiles.push([]);
			for (let j = 0; j < Plot.width; j++) {
				let cell = row.insertCell(j);
				cell.classList.add('tile_b');
				cell.onclick = Game.clickTile;
				Plot.tiles[i].push(new Plot.Tile(j, i, 0)) //new tile
			}
		}
	},
	Tile: class {
		constructor(x, y, soil) {
			this.x = x;
			this.y = y;
			this.soil = soil;
			this.plant = null;
		}
	},
	PlantTile: class {
		constructor() {
			
		}
	},
	render: () => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				Plot.tiles[i][j].sprite = new Graphics.SpriteElement(j * 16, i * 16, { img: 'images/grassbad.png', s: 16, opacity: 1.0, viewLayer: 3 }).add();
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
	refresh: () => {
		Graphics.ctx.clearRect(0, 0, 1280, 720);
		Graphics.ov.clearRect(0, 0, 1280, 720);
	},
	elems: {},
	elemLayers: [],
	testPattern: () => {
		for (let i = 0; i < 200; i++) {
			for (let j = 0; j < 200; j++) {
				if (i % 2 == 0 && j % 2 == 0) {
					Graphics.ctx.fillRect(i, j, 1, 1);
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
	Plot.generate();
	Graphics.initial();
	console.log('Loaded!');
}

