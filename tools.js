Game.tools = [
	new Game.Tool('Inspect', 'View plant information', 'images/glass.cur', {hov: (tile, x, y) => {
		if (tile.plant.plant.id == 1) {
			Graphics.elems[Game.heldTool.text].op = 0;
		} else {
			Graphics.elems[Game.heldTool.text].op = 1;
		}
	}, unhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].op = 0;
		Game.heldTool.info = '';
		clearChildren(Game.currentTc);
	}, chhov: (tile, x, y) => {
		Graphics.elems[Game.heldTool.text].text = tile.plant.plant.dn + '\n' + tile.plant.grows + tile.plant.stage;
		Game.heldTool.info = [tile.plant.plant.dn, tile.plant.inh.growth.stages[tile.plant.grows], tile.plant.grows, tile.plant.stage, tile.plant.plant.id];
		Game.tcInspectUpdate(Game.currentTc);
		if (tile.plant.plant.id == 1) {
			Graphics.elems[Game.heldTool.text].op = 0;
		} else {
			Graphics.elems[Game.heldTool.text].op = 1;
		}
	}, move: (x, y) => {
		if (Game.heldTool.text == undefined) return;
		let con = Graphics.convert(x, y);
		Graphics.elems[Game.heldTool.text].pos = {x: con[0], y: con[1]};
	}, init: () => {
		Game.heldTool.text = new Graphics.TextElement(0, 0, { t: '', s: 15, f: 'Rubik', st: false, fill: 'white', viewLayer: 6 }).add();
		Game.heldTool.info = '';
	}, swap: () => {
		Graphics.elems[Game.heldTool.text].remove();
	}, tc: (el) => {
		Game.tcInspectUpdate(el);
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
		if (tile.plant.plant.id != 1) {
			Graphics.elems[Game.heldTool.sprite].op = 0;
		} else {
			Graphics.elems[Game.heldTool.sprite].op = 0.5;
		}
		let pos = [tile.x, tile.y];
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
		Graphics.elems[Game.heldTool.sprite].zoom = true;
	}, swap: () => {
		Graphics.elems[Game.heldTool.sprite].remove();
	}, tc: (el) => {
		console.log('d');
		let owned = Game.inv.getOwned();
		clearChildren(el);
		let seeds = owned.filter((a) => {return a.cat.includes('seed')});
		seeds.forEach((a) => {
			let img = document.createElement("IMG");
			img.src = a.icon;
			img.width = 48;
			img.height = 48;
			img.onclick = Game.tcPlantClick;
			img.dataset.seed = a.id;
			let div = document.createElement("DIV");
			div.className = 'tcplantseed';
			div.appendChild(img);
			el.appendChild(div);
		});
	}})
];

Game.changeTool = (t) => {
	if (Game.heldTool == Game.tools[t]) return;
	Game.heldTool.events.swap();
	let prev = Game.heldTool;
	Game.heldTool = Game.tools[t];
	Game.heldTool.events.init();
	Plot.farm.style.cursor = 'url(' + Game.heldTool.icon + '),auto';
	document.getElementById('tool_' + Game.heldTool.name).style.width = '60px';
	document.getElementById('tool_' + Game.heldTool.name).firstElementChild.style.marginLeft = '15px';
	document.getElementById('tool_' + prev.name).style.width = '48px';
	document.getElementById('tool_' + prev.name).firstElementChild.style.marginLeft = '0px';
	document.getElementById('tc_' + prev.name).style.display = 'none';
	Game.currentTc = document.getElementById('tc_' + Game.heldTool.name);
	document.getElementById('tc_' + Game.heldTool.name).style.display = 'block';
	Game.heldTool.events.tc(Game.currentTc);
};
Game.toolsInit = () => {
	Game.toolContext = document.getElementById('toolcontext');
};
Game.tcPlantClick = (event) => {
	console.log(event.srcElement);
	let plant = Game.inv.items[event.srcElement.dataset.seed].plant.id;
	Game.heldTool.plant = Game.plants[plant];
	Graphics.elems[Game.heldTool.sprite].replace(Graphics.fromData(Game.plants[plant].growth.stages[0]));
	Graphics.elems[Game.heldTool.sprite].op = 0;
	Graphics.elems[Game.heldTool.sprite].zoom = true;
};
Game.tcInspectUpdate = (el) => {
	clearChildren(el);
	if (Game.heldTool.info == '' || Game.heldTool.info[4] == 1) return;
	//let img = document.createElement("IMG");
	//img.src = Game.heldTool.info[1];
	//img.width = 32;
	//img.height = 32;
	let i = Game.heldTool.info[1];
	let img = Interface.createImageSlice(i.img.src, i.sx, i.sy, i.sa, i.sa, 48, 48);
	let text1 = document.createTextNode(Game.heldTool.info[0]);
	let div1 = document.createElement("DIV");
	div1.appendChild(text1);
	el.appendChild(img);
	el.appendChild(div1);
}