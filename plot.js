var Plot = {
	tiles: [],
	width: 3,
	height: 3,
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
				Plot.tiles[i].push(new Plot.Tile(j * ps * 2, i * ps * 2, 0));
				Plot.tiles[i][j].plant = new Plot.PlantTile(Game.plants[1], Plot.tiles[i][j]);
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
		Graphics.elems[tile.plant.sprite].remove();
		tile.plant = new Plot.PlantTile(Game.plants[1], tile);
	},
	plant: (tile, plant) => {
		Graphics.elems[tile.plant.sprite].remove();
		tile.plant = new Plot.PlantTile(plant, tile);
	},
	render: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				Plot.tiles[i][j].sprite = new Graphics.SpriteElement(j * ps + Plot.pos.x, i * ps + Plot.pos.y, { img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: Plot.zoom / 2, sls: Plot.zoom / 32 }).add();
			}
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
				sprite.prop();
				sprite = Graphics.elems[tile.plant.sprite];
				//console.log(sprite);
				sprite.pos.x = tile.x;
				sprite.pos.y = tile.y;
				sprite.prop();
			}
		}
		for (let i = 0; i < 11; i++) {
			Object.values(Graphics.elemLayers[i]).forEach((element) => {
				if (element.pan) {
					
				}
			});
		}
	},
	changeZoom: (z) => {
		let old = Plot.zoom;
		let diff = old / Plot.zoom;
		Plot.zoom = z;
		info = Graphics.screenInfo();
		let tiles = document.getElementsByClassName('tile_b');
		for (let i = 0; i < tiles.length; i++) {
			let x = tiles[i].cellIndex;
			let y = tiles[i].parentElement.rowIndex;
			tiles[i].style.padding = info.ts / 2 + 'px';
		}
		Graphics.setPos(Plot.tb, Plot.pos.x / info.ps * info.ts + document.getElementById('farmview').getBoundingClientRect().left + 8, Plot.pos.y / info.ps * info.ts + 8);
		Game.plants.forEach((p) => {Game.scalePlant(p)});
		for (let i = 0; i < Plot.height; i++) {
			Plot.tiles[i].forEach((t) => {
				let x = (t.x - Plot.pos.x) / 2 + Plot.pos.x;
				let y = (t.y - Plot.pos.y) / 2 + Plot.pos.y;
				Graphics.elems[t.sprite].replace(new Graphics.SpriteElement(x, y, { img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: 32, sls: Plot.zoom / 32 }));
				Graphics.elems[t.plant.sprite].replace(Graphics.fromData(t.plant.inh.growth.stages[t.plant.grows], x, y));
			});
		}
		Plot.move();
	},
	renderUpdate: () => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let sprite = Graphics.elems[Plot.tiles[i][j].sprite];
			}
		}
	}
};