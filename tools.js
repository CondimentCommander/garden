Game.tools = [
	new Game.Tool('Inspect', 'View plant information', 'images/lime/2.png', {hov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 1;
	}, unhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 0;
	}, chhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].text = tile.plant.plant.name + '\n' + tile.plant.grows;
	}, move: (x, y) => {
		if (Game.heldTool.text == undefined) return;
		let inf = Graphics.screenInfo();
		let con = Graphics.convert(x, y);
		Graphics.elems[Game.heldTool.text].pos = {x: con[0], y: con[1]};
	}, init: () => {
		Game.heldTool.text = new Graphics.TextElement(0, 0, { t: '', s: 15, f: 'Rubik', st: false, fill: 'white', viewLayer: 6 }).add();
	}}),
	new Game.Tool('Harvest', 'Obtain resources from plants', 'images/lime/2.png', {click: (tile, x, y) => {
		tile.plant.inh.events.harvest(tile);
	}})
];
Game.heldTool = Game.tools[0];
Game.changeTool = (t) => {
	Game.heldTool = Game.tools[t];
	console.log('gar');
};