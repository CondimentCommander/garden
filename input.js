Game.mouseDown = false;
Game.panStartX = 0;
Game.panStartY = 0;
Game.plotX = 0;
Game.plotY = 0;
Game.hovered = [];
Game.scroll = 0;
Game.appMousePos = [];
Game.focused = false;
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
		Game.clickPlot(event);
		//let pos = Game.getTilePos(event.offsetX, event.offsetY);
		//if (!pos) return;
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
	Game.heldTool.events.move(event.clientX - 8, event.clientY - 8);
	Game.focused = document.elementFromPoint(event.clientX, event.clientY) == Graphics.canvas;
	Game.appMousePos = [event.offsetX, event.offsetY];
	//console.log(Game.focused);
	//console.log(event.offsetX - document.elementFromPoint(event.clientX, event.clientY).clientHeight);
	//if (!Game.focused) Game.appMousePos[1] -= document.elementFromPoint(event.clientX, event.clientY).clientHeight;
	if (Game.mouseDown) {
		let margin = Plot.farm.getBoundingClientRect().left;
		let moveX = ((event.clientX - 8 - Game.panStartX) - margin);
		let moveY = (event.clientY - 8 - Game.panStartY);
		let calcX = Game.plotX + moveX;
		let calcY = Game.plotY + moveY;
		let ts = Graphics.screenInfo().ts;
		let ss = Graphics.screenInfo().ss;
		
		if (calcX < 8 - Plot.width * ts) calcX = 8 - Plot.width * ts;
		if (calcX > ss) calcX = ss + 8;
		if (calcY < 8 - Plot.height * ts) calcY = 8 - Plot.height * ts;
		if (calcY > ss) calcY = ss + 8;
		
		Plot.farm.style.borderColor = 'black';
		
		if (calcX < 8) Plot.farm.style.borderLeftColor = 'blue';
		if (calcX > ss - Plot.width * ts) Plot.farm.style.borderRightColor = 'blue';
		if (calcY < 8) Plot.farm.style.borderTopColor = 'blue';
		if (calcY > ss - Plot.height * ts) Plot.farm.style.borderBottomColor = 'blue';
		
		Plot.pos = { x: Math.round(calcX / ts - 0.5) * (Plot.zoom / 2), y: Math.round(calcY / ts - 0.5) * (Plot.zoom / 2)};
		calcX = Math.round(calcX / ts - 0.5) * ts + 8 + margin + 0.5;
		calcY = Math.round(calcY / ts - 0.5) * ts + 8;
		Graphics.setPos(Plot.tb, calcX, calcY);
		Plot.move();
	} else {
		let pos = Game.getTilePos(event.clientX - 8, event.clientY - 8);
		let tiles = Plot.tb.rows;
		if (!pos) {
			tiles.item(Game.hovered[1]).cells.item(Game.hovered[0]).style.opacity = 0;
			if (Game.hovered.length != 0) Game.heldTool.events.unhov(Plot.tiles[Game.hovered[1]][Game.hovered[0]], event.clientX - 8, event.clientY - 8);
			Game.hovered = [];
			return;
		}
		let tile = tiles.item(pos[1]).cells.item(pos[0]);
		if (compareArrays(Game.hovered, pos)) {
			return;
		} else {
			//console.log(Game.hovered, pos);
			tiles.item(Game.hovered[1]).cells.item(Game.hovered[0]).style.opacity = 0;
			//if (Game.hovered.length != 0) Game.heldTool.events.unhov(Plot.tiles[Game.hovered[1]][Game.hovered[0]], event.offsetX, event.offsetY);
			let tmp = Game.hovered;
			Game.hovered = pos;
			if (Game.hovered.length != 0) Game.heldTool.events.chhov(Plot.tiles[Game.hovered[1]][Game.hovered[0]], event.clientX - 8, event.clientY - 8);
			if (tmp.length == 0) Game.heldTool.events.hov(Plot.tiles[Game.hovered[1]][Game.hovered[0]], event.clientX - 8, event.clientY - 8);
			tile.style.opacity = 0.14;
		}
	}
};
Game.zoom = (event) => {
	if (Game.scroll + event.deltaY >= -200 && Game.scroll + event.deltaY <= 200) Game.scroll += event.deltaY;
	if (Game.scroll >= 100) {
		if (Plot.zoom == 32) return;
		Plot.changeZoom(32);
	} else {
		if (Game.scroll <= -100) {
			if (Plot.zoom == 128) return;
			Plot.changeZoom(128);
		} else {
			if (Plot.zoom == 64) return;
			Plot.changeZoom(64);
		}
	}
};
Game.clickPlot = (event) => {
	if (!Game.focused) {
		//console.log('gar2');
		//eval(document.elementFromPoint(event.clientX, event.clientY).dataset.click);
		return;
	}
	let pos = Game.getTilePos(event.offsetX, event.offsetY);
	if (!pos) return;
	Game.heldTool.events.click(Plot.tiles[pos[1]][pos[0]], event.offsetX, event.offsetY);
};