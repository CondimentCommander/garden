Game.tools = {
	inspect: new Game.Tool('inspect', 'images/glass.cur', {hov: (tile, x, y) => {
		if (tile.plant.plant.name == 'empty') {
			Tooltip.ttClose();
		} else {
			Tooltip.tooltip(Plot.farm, Tooltip.buildInspect(tile), x + 30, y + 25, false);
		}
	}, unhov: (tile, x, y) => {
		Tooltip.ttClose();
		Game.heldTool.info = '';
		clearChildren(Game.currentTc);
	}, chhov: (tile, x, y) => {
		//Graphics.elems[Game.heldTool.text].text = tile.plant.plant.dn + '\n' + tile.plant.grows + tile.plant.stage;
		Game.heldTool.info = tile;
		Game.tcInspectUpdate(Game.currentTc);
		if (tile.plant.plant.name == 'empty') {
			Tooltip.ttClose();
		} else {
			if (Tooltip.focus == undefined) {
				Tooltip.tooltip(Plot.farm, Tooltip.buildInspect(tile), x + 30, y + 25, false);
			} else {
				Tooltip.ttUpdate(Tooltip.buildInspect(tile));
			}
		}
	}, move: (x, y) => {
		//let con = Graphics.convert(x, y);
		if (Input.hovered[0] != undefined) Tooltip.tooltipMove(x + 30, y + 25);
	}, init: () => {
		//Game.heldTool.text = new Graphics.TextElement(0, 0, { t: '', s: 15, f: 'Rubik', st: false, fill: 'white', viewLayer: 6 }).add();
		Game.heldTool.info = '';
	}, swap: () => {

	}, tc: (el) => {
		Game.tcInspectUpdate(el);
	}}),
	plant: new Game.Tool('plant', 'images/plant.cur', {
		hov: (tile, x, y) => {
			Graphics.elems[Game.heldTool.sprite].op = 0.5;
		}, unhov: (tile, x, y) => {
			Graphics.elems[Game.heldTool.sprite].op = 0;
		}, chhov: (tile, x, y) => {
			if (Game.heldTool.sprite == undefined) return;
			if (tile.plant.plant.name != 'empty') {
				Graphics.elems[Game.heldTool.sprite].op = 0;
			} else {
				Graphics.elems[Game.heldTool.sprite].op = 0.5;
			}
			let pos = [tile.x, tile.y];
			let con = pos;
			Graphics.elems[Game.heldTool.sprite].pos = { x: con[0], y: con[1] };
		}, move: (x, y) => {

		}, click: (tile, x, y) => {
			let seed = Game.inv.items[Game.toolPlant.name + '_seed'];
			if (tile.plant.plant.name != 'empty' || seed.amount <= 0) return;
			Plot.plant(tile, Game.toolPlant);
			seed.changeAmount(seed.amount - 1);
		}, init: () => {
			//Game.heldTool.sprite = new Graphics.SpriteElement(0, 0, { img: Game.plants['grass'].growth.stages[0].img, s: Graphics.converta(16, ), opacity: 1, viewLayer: 6 }).add();
			Game.heldTool.sprite = Graphics.fromData(Game.plants['grass'].growth.stages[0], 0, 0, true).add();
			Graphics.elems[Game.heldTool.sprite].op = 0;
			Graphics.elems[Game.heldTool.sprite].zoom = true;
		}, swap: () => {
			Graphics.elems[Game.heldTool.sprite].remove();
		}, tc: (el) => {
			let owned = Game.inv.getOwned();
			clearChildren(el);
			let seeds = owned.filter((a) => { return a.cat.includes('seed') });
			seeds.forEach((a) => {
				let img = document.createElement("IMG");
				img.src = a.icon;
				img.width = 48;
				img.height = 48;
				img.onclick = Game.tcPlantClick;
				img.dataset.seed = a.id;
				let div = document.createElement("DIV");
				div.className = 'tcplantseed';
				div.id = 'tcpseed_' + a.plant.name;
				div.onmouseenter = (event) => { Tooltip.tt(event, Tooltip.buildSeed(Game.inv.items[event.target.firstElementChild.dataset.seed]), 0, 0, '') };
				div.onmousemove = (event) => { Tooltip.ttMove(event, 0, 0, '') };
				div.onmouseleave = () => { Tooltip.ttClose() };
				div.appendChild(img);
				div.style.cursor = 'pointer';
				el.appendChild(div);
			});

			Game.tcPlantChange(Game.toolPlant, true);
		}
	}),
	harvest: new Game.Tool('harvest', 'images/sickle.cur', {click: (tile, x, y) => {
		tile.plant.inh.events.harvest(tile);
	}})
};

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
	Game.toolPlant = Game.plants['grass'];
};
Game.tcPlantClick = (event) => {
	Game.tcPlantChange(Game.inv.items[event.target.dataset.seed].plant);
};
Game.tcPlantChange = (to, first = false) => {
	if (!first) {
		let o = document.getElementById('tcpseed_' + Game.toolPlant.name);
		o.style.backgroundColor = 'darkslategray';
	}
	let n = document.getElementById('tcpseed_' + to.name);
	Game.toolPlant = to;
	n.style.backgroundColor = '#1f7a15';
	Graphics.elems[Game.heldTool.sprite].replace(Graphics.fromData(to.growth.stages[0]));
	Graphics.elems[Game.heldTool.sprite].op = 0;
	Graphics.elems[Game.heldTool.sprite].zoom = true;
}
Game.tcInspectUpdate = (el) => {
	clearChildren(el);
	if (Game.heldTool.info == '' || Game.heldTool.info.plant.plant.name == 'empty') return;
	let img = document.createElement("IMG");
	img.src = Game.inv.items[Game.heldTool.info.plant.plant.name + '_seed'].icon;
	img.width = 32;
	img.height = 32;
	img.style.display = 'inline-block';
	img.style.imageRendering = 'pixelated';
	//let i = Game.heldTool.info[1];
	//let img = Interface.createImageSlice(i.img.src, i.sx, i.sy, i.sa, i.sa, 48, 48);
	let text1 = document.createTextNode('Time in stage: ' + Game.heldTool.info.plant.stagetime + ' ticks');
	let div1 = document.createElement("DIV");
	div1.style.display = 'inline-block';
	div1.appendChild(text1);
	el.appendChild(img);
	el.appendChild(div1);
}