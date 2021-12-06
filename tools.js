Game.tools = [
	new Game.Tool('Inspect', 'View plant information', 'images/glass.cur', {hov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 1;
	}, unhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 0;
	}, chhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].text = tile.plant.plant.name + '\n' + tile.plant.grows;
	}, move: (x, y) => {
		if (Game.heldTool.text == undefined) return;
		let con = Graphics.convert(x, y);
		Graphics.elems[Game.heldTool.text].pos = {x: con[0], y: con[1]};
	}, init: () => {
		Game.heldTool.text = new Graphics.TextElement(0, 0, { t: '', s: 15, f: 'Rubik', st: false, fill: 'white', viewLayer: 6 }).add();
	}, swap: () => {
		Graphics.elems[Game.heldTool.text].remove();
	}}),
	new Game.Tool('Harvest', 'Obtain resources from plants', 'images/lime/1.png', {click: (tile, x, y) => {
		tile.plant.inh.events.harvest(tile);
	}}),
	new Game.Tool('Plant', 'Plant seeds on farmland', 'images/plant.cur', {hov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.sprite].op = 0.5;
	}, unhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.sprite].op = 0;
	}, chhov: (tile, x, y) => {
		if (Game.heldTool.sprite == undefined) return;
		let i = Graphics.screenInfo();
		//let pos = Game.getTilePos(x, y);
		//let pos = [snapValue(x, i.ps), snapValue(y, i.ps)]
		let pos = [tile.x, tile.y];
		//let con = Graphics.convert(pos[0], pos[1]);
		let con = pos;
		Graphics.elems[Game.heldTool.sprite].pos = { x: con[0], y: con[1] };
	}, move: (x, y) => {
		
	}, click: (tile, x, y) => {
		Plot.plant(tile, Game.heldTool.plant);
	}, init: () => {
		Game.heldTool.plant = Game.plants[2];
		//Game.heldTool.sprite = new Graphics.SpriteElement(0, 0, { img: Game.plants[2].growth.stages[0].img, s: Graphics.converta(16, ), opacity: 1, viewLayer: 6 }).add();
		Game.heldTool.sprite = Graphics.fromData(Game.plants[2].growth.stages[0], 0, 0, true).add();
		Graphics.elems[Game.heldTool.sprite].op = 0;
	}, swap: () => {
		Graphics.elems[Game.heldTool.sprite].remove();
	}})
];

Game.changeTool = (t) => {
	Game.heldTool.events.swap();
	let prev = Game.heldTool;
	Game.heldTool = Game.tools[t];
	Game.heldTool.events.init();
	Plot.farm.style.cursor = 'url(' + Game.heldTool.icon + '),auto';
	document.getElementById('tool_' + Game.tools[t].name).style.width = '60px';
	document.getElementById('tool_' + Game.tools[t].name).firstElementChild.style.marginLeft = '15px';
	document.getElementById('tool_' + prev.name).style.width = '48px';
	document.getElementById('tool_' + prev.name).firstElementChild.style.marginLeft = '0px';
};