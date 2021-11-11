var rw = 1.0;
var rh = 1.0;

var Game = {
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
	Tool: class {
		constructor(name, desc, icon, events) {
			this.name = name;
			this.desc = desc;
			this.icon = icon;
			this.events = events;
		}
	},
	init: () => {
		Game.plants = [
			new Game.Plant('test', 0, 'Test').setGrowth({speed: 2, matureTime: 5, decay: 1, stages: [{ img: 'images/lime/2.png', sa: 2, opacity: 1, viewLayer: 3 }, { img: 'images/lime/1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 3 }]}).setinh(),
			new Game.Plant('empty', 1, 'None').setGrowth({speed: 0, matureTime: 5, decay: 1, stages: [{ img: 'images/grassbad.png', sa: 2, opacity: 0, viewLayer: 3 }]}).setinh(),
			new Game.Plant('grass', 2, 'Grass').setGrowth({speed: 2, matureTime: 3, decay: 1, stages: [{ img: 'images/sprites1.png', sa: 2, opacity: 1, viewLayer: 3, sx: 16, sy: 48, slsa: 32 }, { img: 'images/sprites1.png', sa: 2, opacity: 1, viewLayer: 3, sx: 32, sy: 48, slsa: 32 }, { img: 'images/sprites1.png', sa: 2, opacity: 1, viewLayer: 3, sx: 48, sy: 48, slsa: 32 }]}).setinh(),
		];
		Game.tools = [
			new Game.Tool('Inspect', 'View plant information', 'images/lime/2.png', {hov: (tile, x, y) => {
				console.log(tile.plant.plant.name);
			}, unhov: (tile, x, y) => {
				console.log('unhov');
			}})
		];
		Game.heldTool = Game.tools[0];
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


