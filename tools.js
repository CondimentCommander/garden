Game.tools = [
	new Game.Tool('Inspect', 'View plant information', 'images/glass3.cur', {hov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 1;
	}, unhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 0;
	}, chhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].text = tile.plant.plant.name + '\n' + tile.plant.grows;
	}, move: (x, y) => {
		if (Game.heldTool.text == undefined) return;
		//if (!Game.focused) Graphics.elems[Game.heldTool.text].op = 0;
		let inf = Graphics.screenInfo();
		let con = Graphics.convert(x, y);
		Graphics.elems[Game.heldTool.text].pos = {x: con[0], y: con[1]};
	}, init: () => {
		Game.heldTool.text = new Graphics.TextElement(0, 0, { t: '', s: 15, f: 'Rubik', st: false, fill: 'white', viewLayer: 6 }).add();
	}, swap: () => {
		Graphics.elems[Game.heldTool.text].remove();
	}}),
	new Game.Tool('Harvest', 'Obtain resources from plants', 'images/lime/2.png', {click: (tile, x, y) => {
		tile.plant.inh.events.harvest(tile);
	}}),
	new Game.Tool('Plant', 'Plant seeds on farmland', 'images/glass3.cur', {hov: (tile, x, y) => {
		
	}, unhov: (tile, x, y) => {
		
	}, chhov: (tile, x, y) => {
		
	}, move: (x, y) => {
		
	}, click: (tile, x, y) => {
		Plot.plant(tile, Game.heldTool.plant);
	}, init: () => {
		Game.heldTool.plant = Game.plants[2];
	}})
];

Game.changeTool = (t) => {
	Game.heldTool.events.swap();
	Game.heldTool = Game.tools[t];
	Game.heldTool.events.init();
	Plot.farm.style.cursor = 'url(' + Game.heldTool.icon + '),auto';
};