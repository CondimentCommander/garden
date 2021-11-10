Game.mouseDown = false;
Game.panStartX = 0;
Game.panStartY = 0;
Game.plotX = 0;
Game.plotY = 0;
Game.hovered = [];
Game.getTilePos = (x, y) => {
	i = Graphics.screenInfo();
	//let xa = x * (i.ss / 512);
	//let ya = y * (i.ss / 512);
	let plotx = Plot.pos.x / Plot.zoom * i.ts;
	let ploty = Plot.pos.y / Plot.zoom * i.ts;
	//let outx = (Math.round((xa - plotx) / (i.ts * 2) + 0.5));
	//let outy = (Math.round((ya - ploty) / (i.ts * 2) + 0.5));
	let outx = cleanZero(snapValue(x - plotx * 2, i.ts) / i.ts);
	let outy = cleanZero(snapValue(y - ploty * 2, i.ts) / i.ts);
	if (outx >= Plot.width || outy >= Plot.height || outx < 0 || outy < 0) return false;
	return [outx, outy];
};
Game.panStart = (event) => {
	if (event.button != 2) {
		let pos = Game.getTilePos(event.offsetX, event.offsetY);
		if (pos = false) return;
		return;
	}
	Game.mouseDown = true;
	Game.panStartX = event.offsetX;
	Game.panStartY = event.offsetY;
	Game.plotX = Plot.tb.getBoundingClientRect().left;
	Game.plotY = Plot.tb.getBoundingClientRect().top;
};
Game.panStop = (event) => {
	Game.mouseDown = false;
};
Game.panMove = (event) => {
	if (Game.mouseDown) {
		let margin = document.getElementById('farmview').getBoundingClientRect().left;
		let moveX = ((event.offsetX - Game.panStartX) - margin);
		let moveY = (event.offsetY - Game.panStartY);
		let calcX = Game.plotX + moveX;
		let calcY = Game.plotY + moveY;
		let ts = Graphics.screenInfo().ts;
		let ss = Graphics.screenInfo().ss;
		if (calcX < 8) calcX = 8;
		if (calcX > ss - Plot.width * ts) calcX = ss - Plot.width * ts + 8;
		if (calcY < 8) calcY = 8;
		if (calcY > ss - Plot.height * ts) calcY = ss - Plot.height * ts + 8;
		Plot.pos = { x: Math.round(calcX / ts - 0.5) * (Plot.zoom / 2), y: Math.round(calcY / ts - 0.5) * (Plot.zoom / 2)};
		calcX = Math.round(calcX / ts - 0.5) * ts + 8 + margin + 0.5;
		calcY = Math.round(calcY / ts - 0.5) * ts + 8;
		Graphics.setPos(Plot.tb, calcX, calcY);
		Plot.move();
	} else {
		let pos = Game.getTilePos(event.offsetX, event.offsetY);
		let tiles = Plot.tb.rows;
		if (pos == false) {
			if (Game.hovered != []) tiles.item(Game.hovered[1]).cells.item(Game.hovered[0]).style.opacity = 0;
			Game.hovered = [];
			return;
		}
		let tile = tiles.item(pos[1]).cells.item(pos[0]);
		if (Game.hovered == pos && Game.hovered[0] != undefined) {
			return;
		} else {
			tiles.item(Game.hovered[1]).cells.item(Game.hovered[0]).style.opacity = 0;
			Game.hovered = pos;
			tile.style.opacity = 0.14;
		}
	}
};