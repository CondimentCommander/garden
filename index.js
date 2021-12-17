var rw = 1.0;
var rh = 1.0;

var Game = {
	Plant: class {
		constructor(name, id) {
			this.name = name;
			this.id = id;
			this.dn = Lang.l.map.plant[name].name;
			this.desc = Lang.l.map.plant[name].desc;
			this.lore = Lang.l.map.plant[name].lore;
			this.growth = {};
			this.events = {pretick: () => {}, grow: () => {}, posttick: () => {}, harvest: (tile) => {Plot.harvest(tile)}};
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
	Soil: class {
		constructor(name, img, events) {
			this.name = name;
			this.dn = Lang.l.map.soil[name];
			this.img = img;
			this.events = events;
		}
	},
	Tool: class {
		constructor(id, icon, events) {
			this.id = id;
			this.name = Lang.l.map.tool[id].name;
			this.desc = Lang.l.map.tool[id].desc;
			this.icon = icon;
			this.events = events;
			if (this.events.click == undefined) this.events.click = () => {};
			if (this.events.hov == undefined) this.events.hov = () => {};
			if (this.events.unhov == undefined) this.events.unhov = () => {};
			if (this.events.chhov == undefined) this.events.chhov = () => {};
			if (this.events.move == undefined) this.events.move = () => {};
			if (this.events.init == undefined) this.events.init = () => {};
			if (this.events.swap == undefined) this.events.swap = () => {};
			if (this.events.tc == undefined) this.events.tc = () => {};
		}
	},
	init: () => {
		Game.plants = {
			'test': new Game.Plant('test', 0).setGrowth({ 
				speed: 2, matureTime: 5, decay: 1, stages: [
					{ img: Graphics.resources['lime2'], sa: 2, opacity: 1, viewLayer: 3 }, 
					{ img: Graphics.resources['lime'], s: Plot.zoom / 2, opacity: 1, viewLayer: 3 }
				] 
			}).setinh(),
			'empty': new Game.Plant('empty', 1).setGrowth({ 
				speed: 0, matureTime: 5, decay: 1, stages: [
					{ img: Graphics.resources['grass'], sa: 2, opacity: 0, viewLayer: 3 }
				]
			}).addEvent('harvest', (tile) => { }).setinh(),
			'grass': new Game.Plant('grass', 2).setGrowth({
				speed: 2, matureTime: 5, decay: 1, stages: [
					{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 16, sy: 48, slsa: 32 },
					{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 32, sy: 48, slsa: 32 }, 
					{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 48, sy: 48, slsa: 32 }
				], mutations: {
					'10': 'cornweed'
				}
			}).setinh(),
			'cornweed': new Game.Plant('cornweed', 3).setGrowth({
				speed: 3, matureTime: 2, decay: 0.9, stages: [
					{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 0, sy: 0, slsa: 32 }, 
					{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 16, sy: 0, slsa: 32 }, 
					{ img: Graphics.resources['sprites1'], sa: 2, opacity: 1, viewLayer: 3, sx: 32, sy: 0, slsa: 32 }
				]
			}).setinh()
		};
		Object.values(Game.plants).forEach((p) => {Game.scalePlant(p)});
		Game.soils = {
			'rough': new Game.Soil('rough', { img: Graphics.resources['soil'], s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: 0, sls: Plot.zoom / 32, tag: 'tile' }),
			'farmland': new Game.Soil('farmland', { img: Graphics.resources['soil'], s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: 16, sls: Plot.zoom / 32, tag: 'tile' })
		};
		Game.inv.init();
		Plot.weeds = {'15': Game.plants['grass'], '2': Game.plants['cornweed'], '1': Game.plants['test']};
	},
	dev: {
		fertilizer: 4,
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
	//Lang.init();
	Graphics.initial();
	Game.init();
	Interface.init();
	Plot.generate();
	Plot.render();
	Plot.changeZoom(64);
	let si = Graphics.screenInfo();
	Plot.pos.x = 256;
	Plot.pos.y = 256;
	Plot.move();
	Graphics.setPos(Plot.tb, Plot.pos.x / si.ps * si.ts + document.getElementById('farmview').getBoundingClientRect().left + 8, Plot.pos.y / si.ps * si.ts + 8);
	
	Game.toolsInit();
	Game.heldTool = Game.tools.inspect;

	Graphics.timerEl = document.getElementById('ticktimer');
	Time.init();
	Graphics.timer();
	Graphics.timeInterval = setInterval(Graphics.timer, 1000);

	Game.toolsInit();
	Game.heldTool = Game.tools.inspect;
	Plot.farm.style.cursor = 'url(' + Game.heldTool.icon + '),auto';
	Game.heldTool.events.init();
	document.getElementById('tool_' + Game.heldTool.name).style.width = '60px';
	document.getElementById('tool_' + Game.heldTool.name).firstElementChild.style.marginLeft = '15px';
	Game.currentTc = document.getElementById('tc_' + Game.heldTool.name);
	Game.currentTc.style.display = 'block';
	Game.heldTool.events.tc(Game.currentTc);

	Sound.init();
	Tooltip.init();
	
	if (Game.dev.showWelcome) {
		let panel = new Interface.Panel(document.getElementById('welcome'));
		Interface.openFloat(panel);
	}
	console.log('Loaded!');
}


