var Plot = {
	tiles: [],
	width: 6,
	height: 6,
	pos: { x: 0, y: 0 },
	zoom: 64,
	generate: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			let row = Plot.tb.insertRow(i);
			Plot.tiles.push([]);
			for (let j = 0; j < Plot.width; j++) {
				let cell = row.insertCell(j);
				cell.classList.add('tile_b');
				//cell.onclick = Game.clickTile;
				//cell.onmouseover = Game.hoverTile;
				//cell.onmouseout = Game.hoverOffTile;
				Plot.tiles[i].push(new Plot.Tile(j * ps * 2, i * ps * 2, Game.soils['rough']));
				Plot.tiles[i][j].plant = new Plot.PlantTile(Game.plants['empty'], Plot.tiles[i][j]);
			}
		}
	},
	Tile: class {
		constructor(x, y, soil) {
			this.x = x;
			this.y = y;
			this.plotx = x;
			this.ploty = y;
			this.soil = soil;
			this.plant = undefined;
		}
	},
	PlantTile: class {
		constructor(plant, tile) {
			this.plant = plant;
			this.inh = plant.inh;
			this.tile = tile;
			this.stage = 0;
			this.life = 0;
			this.stagetime = 0;
			this.grows = 0;
			this.sprite = Graphics.fromData(this.inh.growth.stages[0], tile.x, tile.y);
			this.sprite.tag = "Plant";
			this.sprite = this.sprite.add();
		}
	},
	uproot: (tile) => {
		if (Graphics.elems[tile.plant.sprite] == null) return;
		Plot.plant(tile, Game.plants['empty']);
	},
	plant: (tile, plant) => {
		Graphics.elems[tile.plant.sprite].remove();
		tile.plant = new Plot.PlantTile(plant, tile);
	},
	replace: (tile, plant) => {
		let grows = tile.plant.grows;
		let stage = tile.plant.stage;
		let life = tile.plant.life;
		let stagetime = tile.plant.stagetime;
		Plot.plant(tile, plant);
		tile.plant.grows = grows;
		tile.plant.stage = stage;
		tile.plant.life = life;
		tile.plant.stagetime = stagetime;
	},
	render: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let r = randRot();
				let pr = randRotHorizontal();
				Plot.tiles[i][j].sprite = new Graphics.SpriteElement(j * ps + Plot.pos.x, i * ps + Plot.pos.y, Game.soils['rough'].img).add();
				Graphics.elems[Plot.tiles[i][j].sprite].rot = r;
				//Graphics.elems[Plot.tiles[i][j].plant.sprite].rot = pr;
			}
		}
		Plot.edge = [];
		for (let i = 0; i < Plot.width; i++) {
			//Plot.edge.push(new Graphics.SpriteElement(j * ps + Plot.pos.x, i * ps + Plot.pos.y, { img: Graphics.resources['sprites1'], s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: Plot.zoom / 2, sls: Plot.zoom / 32, rot: r, tag: 'tile' }).add();)
		}
	},
	move: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let tile = Plot.tiles[i][j];
				let sprite = Graphics.elems[tile.sprite];
				sprite.pos.x = j * ps + Plot.pos.x;
				sprite.pos.y = i * ps + Plot.pos.y;
				tile.x = sprite.pos.x;
				tile.y = sprite.pos.y;
				tile.plotx = tile.x - Plot.pos.x;
				tile.ploty = tile.y - Plot.pos.y;
				sprite = Graphics.elems[tile.plant.sprite];
				sprite.pos.x = tile.x;
				sprite.pos.y = tile.y;
			}
		}
		for (let i = 0; i < 11; i++) {
			Object.values(Graphics.elemLayers[i]).forEach((element) => {
				if (element.pan) {
					
				}
			});
		}
	},
	changeZoom: (z, center = false) => {
		let old = Plot.zoom;
		Plot.zoom = z;
		let diff = old / Plot.zoom;
		let info = Graphics.screenInfo();
		let tiles = document.getElementsByClassName('tile_b');
		for (let i = 0; i < tiles.length; i++) {
			let x = tiles[i].cellIndex;
			let y = tiles[i].parentElement.rowIndex;
			tiles[i].style.padding = info.ts / 2 + 'px';
		}
		Object.values(Game.plants).forEach((p) => {Game.scalePlant(p)});
		for (let i = 0; i < Plot.height; i++) {
			Plot.tiles[i].forEach((t) => {
				let x = (t.x - Plot.pos.x) / 2 + Plot.pos.x;
				let y = (t.y - Plot.pos.y) / 2 + Plot.pos.y;
				Graphics.elems[t.sprite].pos.x = x;
				Graphics.elems[t.sprite].pos.y = y;
				Graphics.elems[t.sprite].scale = Plot.zoom / 2;
				Graphics.elems[t.sprite].slicescale = Plot.zoom / 32;
				//Graphics.elems[t.sprite].replace(new Graphics.SpriteElement(x, y, { img: Graphics.resources['sprites1'], s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: 32, sls: Plot.zoom / 32, rot: Graphics.elems[t.sprite].rot, tag: 'tile' }));
				let oldop = Graphics.elems[t.plant.sprite].op;
				let oldrot = Graphics.elems[t.plant.sprite].rot;
				Graphics.elems[t.plant.sprite].replace(Graphics.fromData(t.plant.inh.growth.stages[t.plant.grows], x, y));
				Graphics.elems[t.plant.sprite].op = oldop;
				Graphics.elems[t.plant.sprite].rot = oldrot;
			});
		}
		Object.values(Graphics.elems).filter((e) => {return e.zoom}).forEach((e) => {e.scale /= diff; e.slicescale = Plot.zoom / 32});
		info = Graphics.screenInfo();
		Plot.move();
		let fix = (old / z) == 2;
		if (diff != 1) {
			if (center) {

			} else {
				if (fix) {
					Plot.pos.x += snapValue((Plot.width / 2 + 1) * info.ps, info.ps);
					Plot.pos.y += snapValue((Plot.height / 2 + 1) * info.ps, info.ps);
					if (Plot.width % 2 == 1) Plot.pos.x += snapValue((Plot.width / 2) * info.ps, info.ps);
					if (Plot.height % 2 == 1) Plot.pos.y += snapValue((Plot.height / 2) * info.ps, info.ps);
				} else {
					Plot.pos.x -= snapValue((Plot.width - 1) / 2 * info.ps, info.ps);
					Plot.pos.y -= snapValue((Plot.height - 1) / 2 * info.ps, info.ps);
				}
			}
		}
		Plot.move();
		Graphics.setPos(Plot.tb, Plot.pos.x / info.ps * info.ts + document.getElementById('farmview').getBoundingClientRect().left + 8, Plot.pos.y / info.ps * info.ts + 8);
		Plot.farm.style.borderColor = 'black';

		if (Plot.pos.x < 0) Plot.farm.style.borderLeftColor = 'blue';
		if (Plot.pos.x > 512 - Plot.width * info.ps) Plot.farm.style.borderRightColor = 'blue';
		if (Plot.pos.y < 0) Plot.farm.style.borderTopColor = 'blue';
		if (Plot.pos.y > 512 - Plot.height * info.ps) Plot.farm.style.borderBottomColor = 'blue';
		if (Game.heldTool != undefined) Game.heldTool.events.move(Input.mousePos[0], Input.mousePos[1]);
	},
	renderUpdate: () => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let sprite = Graphics.elems[Plot.tiles[i][j].sprite];
			}
		}
	},
	harvest: (tile) => {
		if (tile.plant.plant.name == 'empty') return;
		let seed = Game.inv.items[tile.plant.plant.name + '_seed'];
		if (!tile.plant.stage >= 1) return;
		seed.changeAmount(seed.amount + 1);
		Plot.uproot(tile);
	},
};