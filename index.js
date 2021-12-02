var rw = 1.0;
var rh = 1.0;

var Game = {
	Plant: class {
		constructor(name, id, displayName) {
			this.name = name;
			this.id = id;
			this.dn = displayName;
			this.growth = {};
			this.events = {pretick: () => {}, grow: () => {}, posttick: () => {}, harvest: (tile) => {Plot.plant(tile, Game.plants[1])}};
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
			if (this.events.click == undefined) this.events.click = () => {};
			if (this.events.hov == undefined) this.events.hov = () => {};
			if (this.events.unhov == undefined) this.events.unhov = () => {};
			if (this.events.chhov == undefined) this.events.chhov = () => {};
			if (this.events.move == undefined) this.events.move = () => {};
			if (this.events.init == undefined) this.events.init = () => {};
			if (this.events.swap == undefined) this.events.swap = () => {};
		}
	},
	init: () => {
		Game.plants = [
			new Game.Plant('test', 0, 'Test').setGrowth({speed: 2, matureTime: 5, decay: 1, stages: [{ img: Graphics.resources['lime2'], sa: 2, opacity: 1, viewLayer: 3 }, { img: Graphics.resources['lime'], s: Plot.zoom / 2, opacity: 1, viewLayer: 3 }]}).setinh(),
			new Game.Plant('empty', 1, 'None').setGrowth({speed: 0, matureTime: 5, decay: 1, stages: [{ img: Graphics.resources['grass'], sa: 2, opacity: 0, viewLayer: 3 }]}).addEvent('harvest', (tile) => {}).setinh(),
			new Game.Plant('grass', 2, 'Grass').setGrowth({speed: 2, matureTime: 3, decay: 1, stages: [{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 16, sy: 48, slsa: 32 }, { img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 32, sy: 48, slsa: 32 }, { img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 48, sy: 48, slsa: 32 }]}).setinh(),
		];
		Game.plants.forEach((p) => {Game.scalePlant(p)});
		Game.inv.init();
	},
	dev: {
		fertilizer: 1,
		showWelcome: false
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
	Graphics.background = document.getElementById('bg');
	Graphics.bg = Graphics.background.getContext('2d');
	Graphics.initial();
	Game.init();
	Interface.init();
	Plot.generate();
	Plot.render();
	Plot.changeZoom(64);
	
	Graphics.timerEl = document.getElementById('ticktimer');
	Graphics.time = Plot.cycletime / 1000;
	Plot.tick();
	Plot.cycle = setInterval(Plot.tick, Plot.cycletime);
	
	Game.heldTool = Game.tools[0];
	Plot.farm.style.cursor = 'url(' + Game.heldTool.icon + '),auto';
	Game.heldTool.events.init();
	
	if (Game.dev.showWelcome) {
		let panel = new Interface.Panel(document.getElementById('welcome'));
		Interface.openFloat(panel);
	}
	console.log('Loaded!');
}


