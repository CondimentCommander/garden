Game.tools = [
	new Game.Tool('Inspect', 'View plant information', 'images/lime/2.png', {hov: (tile, x, y) => {
		//console.log('hov');
		Graphics.elems[Game.heldTool.text].op = 1;
	}, unhov: (tile, x, y) => {
		//console.log('unhov');
		Graphics.elems[Game.heldTool.text].op = 0;
	}, chhov: (tile, x, y) => {
		//console.log('chhov');
		Graphics.elems[Game.heldTool.text].text = tile.plant.plant.name + '\n' + tile.plant.grows;
		//Graphics.elems[Game.heldTool.text].pos = {x: x - Plot.zoom, y: y - Plot.zoom};
	}, move: (x, y) => {
		//console.log(x, y);
		if (Game.heldTool.text == undefined) return;
		//console.log('move');
		let inf = Graphics.screenInfo();
		let con = Graphics.convert(x, y);
		Graphics.elems[Game.heldTool.text].pos = {x: con[0], y: con[1]};
	}, init: () => {
		Game.heldTool.text = new Graphics.TextElement(0, 0, { t: '', s: 15, f: 'Rubik', st: false, fill: 'white', viewLayer: 6 }).add();
	}})
];
Game.heldTool = Game.tools[0];
