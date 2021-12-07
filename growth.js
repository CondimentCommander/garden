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
	Graphics.prog = Plot.cycletime / Graphics.frameRate;
	clearInterval(Graphics.timeInterval);
	Graphics.time = Plot.cycletime / 1000 + 1;
	Graphics.timer();
	Graphics.timeInterval = setInterval(Graphics.timer, 1000);
	//console.log('tick!');
};
Plot.stop = () => {
	clearInterval(Plot.cycle);
};
Plot.grow = (tile) => {
	let plant = tile.plant;
	plant.life++;
	if (plant.plant.id == 1 && tile.soil == 0) {Plot.growWeed(tile); return}
	if (plant.inh.growth.speed == 0) return;
	let length = plant.inh.growth.stages.length - 1;
	if (plant.stage == 0) {
		let chance = plant.inh.growth.speed * 0.028 * Game.dev.fertilizer;
		let dbchance = plant.inh.growth.speed * 0.006 * Game.dev.fertilizer;
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
			if (plant.stagetime * Game.dev.fertilizer >= plant.inh.growth.matureTime) {
				plant.stage = 2;
				plant.stagetime = 0;
			}
		} else {
			if (plant.stage == 2) {
				let chance = plant.inh.growth.speed * 0.036 * plant.inh.growth.decay * Math.pow(plant.stagetime, 2) * Game.dev.fertillizer;
				let rand = Math.random();
				//Graphics.elems[plant.sprite].op = lockValue(1 - chance * 4, 0, 1);
				if (rand <= chance) Plot.decay(tile);
			}
		}
	}
	plant.stagetime++;
};
Plot.growWeed = (tile) => {
	let plant = tile.plant;
	let chance = 0.024 * Game.dev.fertilizer;
	let rand = Math.random();
	if (rand <= chance) {
		Plot.plant(tile, Game.plants[2]);
	}
};
Plot.mutate = (tile) => {
	
};
Plot.crossBreed = (tile) => {
	let si = Graphics.screenInfo();
	let contenders = Plot.checkRadius(tile.plotx / si.ps, tile.ploty / si.ps, 1, (e) => {return e.plant.plant.id == 2}, true);
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