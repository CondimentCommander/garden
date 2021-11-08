var Plot = {
	tiles: [],
	width: 3,
	height: 3,
	pos: { x: 0, y: 0 },
	zoom: 64,
	cycletime: 5000,
	generate: () => {
		let ps = Graphics.screenInfo().ps;
		for (let i = 0; i < Plot.height; i++) {
			let row = Plot.tb.insertRow(i);
			Plot.tiles.push([]);
			for (let j = 0; j < Plot.width; j++) {
				let cell = row.insertCell(j);
				cell.classList.add('tile_b');
				cell.onclick = Game.clickTile;
				cell.onmouseover = Game.hoverTile;
				cell.onmouseout = Game.hoverOffTile;
				Plot.tiles[i].push(new Plot.Tile(j * ps, i * ps, 0));
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
	execute: (func) => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				func(Plot.tiles[i][j], i, j);
			}
		}
	},
	tick: () => {
		Plot.execute((tile, i, j) => {if (tile.plant != undefined) tile.plant.inh.events.pretick()});
		Plot.execute((tile, i, j) => {if (tile.plant != undefined) Plot.grow(tile)});
		Graphics.prog = Plot.cycletime / 30;
		clearInterval(Graphics.timeInterval);
		Graphics.time = Plot.cycletime / 1000 + 1;
		Graphics.timer();
		Graphics.timeInterval = setInterval(Graphics.timer, 1000);
		//console.log('tick!');
	},
	stop: () => {
		clearInterval(Plot.cycle);
	},
	grow: (tile) => {
		let plant = tile.plant;
		plant.life++;
		if (plant.plant.id == 1 && tile.soil == 0) {Plot.growWeed(tile); return}
		if (plant.inh.growth.speed == 0) return;
		let length = plant.inh.growth.stages.length - 1;
		if (plant.stage == 0) {
			plant.stagetime++;
			let chance = plant.inh.growth.speed * 0.014 * Game.dev.fertilizer;
			let dbchance = plant.inh.growth.speed * 0.003 * Game.dev.fertilizer;
			let rand = Math.random();
			if (rand <= chance) {
				if (rand <= dbchance) plant.grows += 2;
				if (rand > dbchance) plant.grows++;
				if (plant.grows >= length) {
					plant.stage = 1;
					plant.stagetime = 0;
					plant.grows = length;
					Plot.mutate(tile);
				}
				//console.log(plant.grows);
				Graphics.elems[plant.sprite].replace(Graphics.fromData(plant.inh.growth.stages[plant.grows], tile.x, tile.y));
			}
		} else {
			if (plant.stage == 1) {
				plant.stagetime++;
				if (plant.stagetime >= plant.inh.growth.matureTime) {
					plant.stage = 2;
					plant.stagetime = 0;
				}
			} else {
				if (plant.stage == 2) {
					plant.stagetime++;
					let chance = plant.inh.growth.speed * 0.026 * plant.inh.growth.decay * Math.pow(plant.stagetime, 2) * Game.dev.fertillizer;
					let rand = Math.random();
					Graphics.elems[plant.sprite].op = lockValue(1 - chance * 4);
					if (rand <= chance) Plot.decay(tile);
				}
			}
		}
	},
	growWeed: (tile) => {
		let plant = tile.plant;
		let chance = 0.012 * Game.dev.fertilizer;
		let rand = Math.random();
		if (rand <= chance) {
			Plot.plant(tile, Game.plants[2]);
		}
	},
	mutate: (tile) => {
		
	},
	decay: (tile) => {
		Plot.uproot(tile);
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
				console.log('rp');
				Graphics.elems[t.sprite].replace(new Graphics.SpriteElement(t.x, t.y, { img: 'images/sprites1.png', s: Plot.zoom / 2, opacity: 1, viewLayer: 2, sx: 0, sy: 32, sls: Plot.zoom / 32 }));
				Graphics.elems[t.plant.sprite].replace(Graphics.fromData(t.plant.inh.growth.stages[t.plant.grows], t.x, t.y));
			});
		}
	},
	renderUpdate: () => {
		for (let i = 0; i < Plot.height; i++) {
			for (let j = 0; j < Plot.width; j++) {
				let sprite = Graphics.elems[Plot.tiles[i][j].sprite];
			}
		}
	}
};