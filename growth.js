Plot.cycletime = 10000;
Plot.execute = (func) => {
	for (let i = 0; i < Plot.height; i++) {
		for (let j = 0; j < Plot.width; j++) {
			func(Plot.tiles[i][j], i, j);
		}
	}
};
Plot.tick = () => {
	Plot.execute((tile, i, j) => {if (tile.plant != undefined) tile.plant.inh.events.pretick()});
	Plot.execute((tile, i, j) => {if (tile.plant != undefined) Plot.grow(tile)});
	//Plot.execute((tile, i, j) => {if (tile.plant != undefined) Plot.growWeed(tile)});
	Graphics.prog = Plot.cycletime / Graphics.frameRate;
	//Graphics.time = Plot.cycletime / 1000 + 1;
	//console.log('tick!');
	if (Game.heldTool.id == 'inspect' && Input.hovered[0] != undefined) {
		Game.tcInspectUpdate(Game.currentTc);
		Tooltip.ttUpdate(Tooltip.buildInspect(Plot.tiles[Input.hovered[1]][Input.hovered[0]]));
	}
};
Plot.stop = () => {
	clearInterval(Plot.cycle);
};
Plot.grow = (tile) => {
	let plant = tile.plant;
	plant.life++;
	if (plant.plant.name == 'empty' && tile.soil == Game.soils['rough']) {Plot.growWeed(tile); return}
	if (plant.inh.growth.speed == 0) return;
	let length = plant.inh.growth.stages.length - 1;
	if (plant.stage == 0) {
		let c = plant.inh.growth.speed * 0.028 * Game.dev.fertilizer;
		let dbchance = plant.inh.growth.speed * 0.006 * Game.dev.fertilizer;
		if (chance(c)) {
			let db = chance(dbchance);
			if (db) plant.grows += 2;
			if (!db) plant.grows++;
			if (plant.grows >= length) {
				plant.stage = 1;
				plant.stagetime = 0;
				plant.grows = length;
				Plot.mutate(tile);
			}
			Graphics.elems[tile.plant.sprite].replace(Graphics.fromData(tile.plant.inh.growth.stages[tile.plant.grows], tile.x, tile.y));
		}
	} else {
		if (plant.stage == 1) {
			if (plant.stagetime * Game.dev.fertilizer >= plant.inh.growth.matureTime) {
				plant.stage = 2;
				plant.stagetime = 0;
			}
		} else {
			if (plant.stage == 2) {
				let c = plant.inh.growth.speed * 0.003 * plant.inh.growth.decay * Math.pow(plant.stagetime, 1.5);
				c -= Math.random() * 0.1
				Graphics.elems[plant.sprite].op = lockValue(1.35 - c * 4, 0.2, 1);
				if (chance(c)) Plot.decay(tile);
			}
		}
	}
	plant.stagetime++;
};
Plot.growWeed = (tile) => {
	let plant = tile.plant;
	if (chance(0.015 * Game.dev.fertilizer)) {
		let weed = weightedChance(Plot.weeds);
		if (plant.plant.name != 'empty') {
			if (weed.name != 'rankweed') return;
		}
		Plot.plant(tile, weed);
	}
};
Plot.mutate = (tile) => {
	if (tile.plant.inh.growth.mutations == undefined) return;
	if (chance(0.005 * Game.dev.fertilizer)) {
		let mut = Game.plants[weightedChance(tile.plant.inh.growth.mutations)];
		Plot.replace(tile, mut);
	}
};
Plot.crossBreed = (tile) => {
	let si = Graphics.screenInfo();
	let contenders = Plot.checkRadius(tile.plotx / si.ps, tile.ploty / si.ps, 1, (e) => {return e.plant.plant.name == 'grass'}, true);
	console.log(contenders);
};
Plot.decay = (tile) => {
	Plot.uproot(tile);
};
Plot.getArea = (x, y, w, h) => {
	return getArea(x, y, w, h, Plot.tiles);
};
Plot.checkRadius = (x, y, size, check, exclude) => {
	console.log(x, y, size);
	let si = Graphics.screenInfo();
	let ar = Plot.getArea(x - size, y - size, size * 2 + 1, size * 2 + 1);
	let out = [];
	ar.forEach((e) => {out.push(e.filter((el) => {
		if (exclude && el == Plot.tiles[y][x]) return false;
		return check(el);
	}))});
	return out;
};