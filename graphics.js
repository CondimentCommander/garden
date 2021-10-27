var Graphics = {
	ScreenElement: class {
		constructor(x, y, data = { viewLayer: 5, opacity: 1.0 }) {
			this.pos = {x: x, y: y};
			this.lr = data.viewLayer;
			if (this.lr == undefined) this.lr = 5;
			this.op = data.opacity;
			this.data = data;
			this.id = 0;
			this.canvas = this.renderInfo();
			this.pan = data.pan;
		}
		randomId() {
			let rand = Math.floor(Math.random() * 100000);
			while (Object.keys(Graphics.elems).includes(rand.toString())) {
				rand = Math.floor(Math.random() * 100000);
			}
			return rand;
		}
		refreshId() {
			let id = this.randomId();
			this.id = id;
			return id;
		}
		add() {
			//console.log(this.id, 'before');
			this.id = this.randomId();
			//console.log(this.id, 'after');
			Graphics.elems[this.id] = this;
			Graphics.elemLayers[this.lr][this.id] = this;
			return this.id;
		}
		remove() {
			let id = this.id;
			let lr = this.lr;
			delete Graphics.elemLayers[lr][id];
			delete Graphics.elems[id];
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
			Graphics.elemLayers[this.lr][rp.id] = rp;
			//Graphics.elemLayers[this.lr][rp.id].id = rp.id;
			Graphics.elems[rp.id] = rp;
		}
		replaceData(dt) {
			
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
		Graphics.fromData = function (dt, x, y) {
			let sprite = new Graphics.SpriteElement(x, y, dt)
			if (dt.ft != undefined) sprite = new Graphics.AnimatedSpriteElement(x, y, dt);
			return sprite;
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