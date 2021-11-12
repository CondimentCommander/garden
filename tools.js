Game.tools = [
	new Game.Tool('Inspect', 'View plant information', 'images/lime/2.png', {hov: (tile, x, y) => {
		
	}, unhov: (tile, x, y) => {
		console.log('he');
		Graphics.elems[Game.heldTool.text].op = 0;
	}, chhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].text = tile.plant.plant.name;
	}, move: (tile, x, y) => {
		if (Game.heldTool.text == undefined) return;
		Graphics.elems[Game.heldTool.text].pos = {x: x, y: y};
	}, init: () => {
		Game.heldTool.text = new Graphics.TextElement(0, 0, {t: '', s: 7, f: 'Rubik', st: false, fill: 'white'}).add();
	}})
];
Game.heldTool = Game.tools[0];
