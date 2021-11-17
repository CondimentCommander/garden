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
	Graphics.prog = Plot.cycletime / 30;
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
		plant.stagetime++;
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
			plant.stagetime++;
			if (plant.stagetime >= plant.inh.growth.matureTime) {
				plant.stage = 2;
				plant.stagetime = 0;
			}
		} else {
			if (plant.stage == 2) {
				plant.stagetime++;
				let chance = plant.inh.growth.speed * 0.036 * plant.inh.growth.decay * Math.pow(plant.stagetime, 2) * Game.dev.fertillizer;
				let rand = Math.random();
				Graphics.elems[plant.sprite].op = lockValue(1 - chance * 4, 0, 1);
				if (rand <= chance) Plot.decay(tile);
			}
		}
	}
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
Plot.decay = (tile) => {
	Plot.uproot(tile);
};