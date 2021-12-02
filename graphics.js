var Graphics = {
	frameRate: 48,
	filters: [],
	Resource: class {
		constructor(id, src) {
			this.id = id;
			this.src = src;
			this.img = new Image();
			this.ready = false;
			this.img.onload = () => {
				this.ready = true;
			};
			this.img.src = this.src;
		}
	},
	ScreenElement: class {
		constructor(x, y, data = { viewLayer: 5, opacity: 1.0, rot: 0 }) {
			this.pos = {x: x, y: y};
			this.lr = data.viewLayer;
			if (this.lr == undefined) this.lr = 5;
			this.op = data.opacity;
			if (this.op == undefined) this.op = 1.0;
			this.rot = data.rot;
			if (this.rot == undefined) this.rot = 0;
			this.data = data;
			this.id = 0;
			this.canvas = this.renderInfo();
			this.pan = data.pan;
			this.tag = data.tag;
			this.filcomp = "";
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
			this.id = this.randomId();
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
			if (this.lr <= 5 && this.lr > 0) return Graphics.ctx;
			if (this.lr == 0) return Graphics.bg;
		}
		predraw() {
			this.canvas.globalAlpha = this.op;
			if (this.rot != 0) this.canvas.rotate(this.rot * Math.PI / 180);
			this.filcomp = "";
			if (this.filters != undefined) {
				for (let i = 0; i < Graphics.filters.length; i++) {
					this.filcomp = this.filcomp + Graphics.filters[i] + " ";
				}
				if (this.filters != undefined) this.filcomp = this.filcomp + this.filters;
				this.filcomp = this.filcomp.trim();
				this.canvas.filter = this.filcomp;
			}
		}
		prop() { //updates the current value of the element in the element list to be in the layer
			Graphics.elemLayers[this.lr][this.id] = this;
		}
		replace(rp) {
			rp.id = this.id;
			Graphics.elemLayers[this.lr][rp.id] = rp;
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
				this.image = this.img.img; //image object loaded for the sprite on creation
				this.scale = data.s;
				this.slicex = data.sx;
				this.slicey = data.sy;
				this.slicescale = data.sls;
				this.filters = data.fil;
			}
			draw() {
				this.canvas.resetTransform();
				if (this.rot != 0) this.canvas.translate(this.pos.x + this.scale / 2, this.pos.y + this.scale / 2);
				this.predraw();
				if (this.rot != 0) this.canvas.translate(-this.pos.x - this.scale / 2, -this.pos.y - this.scale / 2);
				if (this.img.ready) {
					if (this.slicex == undefined) {
						this.canvas.drawImage(this.image, this.pos.x, this.pos.y, this.scale, this.scale);
					} else {
						this.canvas.drawImage(this.image, this.slicex, this.slicey, this.scale / this.slicescale, this.scale / this.slicescale, this.pos.x, this.pos.y, this.scale, this.scale);
					}
				}
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
				if (!this.img.ready) return;
				this.canvas.resetTransform();
				this.canvas.translate(this.pos.x + this.scale / 2, this.pos.y + this.scale / 2);
				this.predraw();
				this.canvas.translate(-this.pos.x - this.scale / 2, -this.pos.y - this.scale / 2);
				
				//this.image.style.filter = this.filcomp;
				
				this.calcframe = Math.ceil((this.frame + 1) / this.frametime) - 1;
				let size = this.image.width / this.rc;
				let calcrow = Math.floor(this.calcframe / this.rc) * size;
				let calcpos = (this.calcframe % this.rc) * size;
				this.canvas.drawImage(this.image, calcpos, calcrow, size, size, this.pos.x, this.pos.y, size, size);
				this.frame++;
				if (this.frame >= (this.count) * this.frametime) this.frame = 0;
			}
		}
		Graphics.PatternElement = class extends Graphics.ScreenElement {
			constructor(x = 0, y = 0, data = {img: '', w: 16, h: 16, viewLayer: 5, opacity: 1.0}) {
				super(x, y, data);
				this.img = data.img;
				this.image = this.img.img;
				this.width = data.w;
				this.height = data.h;
			}
			draw() {
				this.canvas.resetTransform();
				this.canvas.translate(this.pos.x + this.image.width / 2, this.pos.y + this.image.height / 2);
				this.predraw();
				this.canvas.translate(-this.pos.x - this.image.width / 2, -this.pos.y - this.image.height / 2);
				
				if (this.img.ready) {
					this.pat = this.canvas.createPattern(this.image, 'repeat');
					this.canvas.beginPath();
					this.canvas.fillStyle = this.pat;
					this.canvas.fillRect(this.pos.x, this.pos.y, this.width, this.height);
				}
			}
		}
		Graphics.TextElement = class extends Graphics.ScreenElement {
			constructor(x = 0, y = 0, data = {t: '', s: 12, f: 'Rubik', st: false, fill: 'black', opacity: 1.0, viewLayer: 5}) {
				super(x, y, data);
				this.text = data.t;
				this.size = data.s;
				this.font = data.f;
				this.stroke = data.st;
				this.fill = data.fill;
			}
			draw() {
				//let oa = Graphics.screenInfo().oa;
				this.canvas.resetTransform();
				this.canvas.translate(this.pos.x + this.size / 2, this.pos.y + this.size / 2);
				this.predraw();
				this.canvas.translate(-this.pos.x - this.size / 2, -this.pos.y - this.size / 2);
				this.canvas.font = this.size + 'pt ' + this.font;
				//this.canvas.scale(oa, 1);
				if (this.st) {
					this.canvas.strokeStyle = this.fill;
					this.canvas.strokeText(this.text, this.pos.x, this.pos.y);
				} else {
					this.canvas.fillStyle = this.fill;
					this.canvas.fillText(this.text, this.pos.x, this.pos.y);
				}
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
		let tilesize = screensize / (512 / pixelsize);
		let margin = document.getElementById('farmview').getBoundingClientRect().left;
		let ovAspect = Graphics.overlay.clientWidth / Graphics.overlay.clientHeight;
		let ovx = Graphics.overlay.clientWidth / 2048;
		let ovy = Graphics.overlay.clientHeight / 1024;
		return { ts: tilesize, ps: pixelsize, ss: screensize, mr: margin, oa: ovAspect, ox: ovx, oy: ovy };
	},
	refresh: () => {
		Graphics.ctx.clearRect(0, 0, 512, 512);
		Graphics.ov.clearRect(0, 0, 2048, 1024);
	},
	refreshBG: () => {
		Graphics.bg.clearRect(0, 0, 512, 512);
		Graphics.bgRender = true;
	},
	elems: {},
	elemLayers: [],
	addFilter: (fil, ov) => {
		//Graphics.filters.push(fil);
		if (!ov) Graphics.ctx.filter = fil;
		if (ov) Graphics.ov.filter = fil;
	},
	testPattern: () => {
		for (let i = 0; i < 512; i+=16) {
			for (let j = 0; j < 512; j+=16) {
				if (i % 32 == 0 && j % 32 == 0) {
					Graphics.ctx.fillRect(i, j, 16, 16);
				}
			}
		}
	},
	ovPattern: () => {
		for (let i = 0; i < 2048; i+=16) {
			for (let j = 0; j < 1024; j+=16) {
				if (i % 32 == 0 && j % 32 == 0) {
					Graphics.ov.fillStyle = 'green';
					Graphics.ov.fillRect(i, j, 16, 16);
				}
			}
		}
	},
	convert: (x, y) => {
		let i = Graphics.screenInfo();
		let xa = (x + i.mr + 8) / i.ox;
		let ya = (y + 8) / i.oy;
		return [xa, ya];
	},
	timer: () => {
		Graphics.time--;
		Graphics.timerEl.innerHTML = Graphics.time + "s";
	},
	initial: () => {
		Graphics.defineElements();
		Graphics.ctx.imageSmoothingEnabled = false;
		Graphics.ov.imageSmoothingEnabled = false;
		Graphics.bg.imageSmoothingEnabled = false;
		
		Graphics.bgRender = true;
		
		Graphics.resources = {
			'sprites1': new Graphics.Resource(1, 'images/sprites1.png'),
			'bg': new Graphics.Resource(2, 'images/bg.png'),
			'lime': new Graphics.Resource(3, 'images/lime/1.png'),
			'lime2': new Graphics.Resource(4, 'images/lime/2.png'),
			'grass': new Graphics.Resource(5, 'images/grassbad.png')
		};
		
		for (let i = 0; i < 11; i++) {
			Graphics.elemLayers.push({});
		}
		Graphics.back = new Graphics.PatternElement(0, 0, { img: Graphics.resources['bg'], w: 512, h: 512, viewLayer: 0, opacity: 1.0 }).add();
		Graphics.interval = setInterval(Graphics.update, 1000 / Graphics.frameRate);
		//window.requestAnimationFrame(Graphics.update);
	},
	update: () => {
		Graphics.refresh();
		for (let i = 0; i < 11; i++) {
			Object.values(Graphics.elemLayers[i]).forEach((element) => {
				if (!Graphics.bgRender && element.lr == 0) return;
				element.draw();
			});
		}
		Graphics.bgRender = false;
	},
	stop: () => {
		clearInterval(Graphics.interval);
	},
};