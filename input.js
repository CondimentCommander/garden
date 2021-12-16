var Input = {
	mouseDown: false,
	panStartX: 0,
	panStartY: 0,
	plotX: 0,
	plotY: 0,
	hovered: [],
	scroll: 0,
	appMousePos: [],
	mousePos: [],
	focused: false,
	getTilePos: (x, y) => {
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
	},
	panStart: (event) => {
		if (event.button != 2) {
			Input.clickPlot(event);
			//let pos = Input.getTilePos(event.offsetX, event.offsetY);
			//if (!pos) return;
			return;
		}
		Input.mouseDown = true;
		Input.panStartX = event.offsetX;
		Input.panStartY = event.offsetY;
		Input.plotX = Plot.tb.getBoundingClientRect().left;
		Input.plotY = Plot.tb.getBoundingClientRect().top;
	},
	panStop: (event) => {
		Input.mouseDown = false;
	},
	panMove: (event) => {
		Game.heldTool.events.move(event.clientX - 8, event.clientY - 8);
		Input.mousePos = [event.clientX - 8, event.clientY - 8];
		Input.focused = document.elementFromPoint(event.clientX, event.clientY) == Graphics.canvas;
		Input.appMousePos = [event.offsetX, event.offsetY];
		//console.log(Input.focused);
		//console.log(event.offsetX - document.elementFromPoint(event.clientX, event.clientY).clientHeight);
		//if (!Input.focused) Input.appMousePos[1] -= document.elementFromPoint(event.clientX, event.clientY).clientHeight;
		if (Input.mouseDown) {
			let margin = Plot.farm.getBoundingClientRect().left;
			let moveX = ((event.clientX - 8 - Input.panStartX) - margin);
			let moveY = (event.clientY - 8 - Input.panStartY);
			let calcX = Input.plotX + moveX;
			let calcY = Input.plotY + moveY;
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
			Plot.pos = { x: Math.round(calcX / ts - 0.5) * (Plot.zoom / 2), y: Math.round(calcY / ts - 0.5) * (Plot.zoom / 2) };
			calcX = Math.round(calcX / ts - 0.5) * ts + 8 + margin;
			calcY = Math.round(calcY / ts - 0.5) * ts + 8;
			Graphics.setPos(Plot.tb, calcX, calcY);
			Plot.move();
		} else {
			let pos = Input.getTilePos(event.clientX - 8, event.clientY - 8);
			let tiles = Plot.tb.rows;
			if (!pos) {
				tiles.item(Input.hovered[1]).cells.item(Input.hovered[0]).style.opacity = 0;
				if (Input.hovered.length != 0) Game.heldTool.events.unhov(Plot.tiles[Input.hovered[1]][Input.hovered[0]], event.clientX - 8, event.clientY - 8);
				Input.hovered = [];
				return;
			}
			let tile = tiles.item(pos[1]).cells.item(pos[0]);
			if (compareArrays(Input.hovered, pos)) {
				return;
			} else {
				//console.log(Input.hovered, pos);
				tiles.item(Input.hovered[1]).cells.item(Input.hovered[0]).style.opacity = 0;
				//if (Input.hovered.length != 0) Game.heldTool.events.unhov(Plot.tiles[Input.hovered[1]][Input.hovered[0]], event.offsetX, event.offsetY);
				let tmp = Input.hovered;
				Input.hovered = pos;
				if (Input.hovered.length != 0) Game.heldTool.events.chhov(Plot.tiles[Input.hovered[1]][Input.hovered[0]], event.clientX - 8, event.clientY - 8);
				if (tmp.length == 0) Game.heldTool.events.hov(Plot.tiles[Input.hovered[1]][Input.hovered[0]], event.clientX - 8, event.clientY - 8);
				tile.style.opacity = 0.14;
			}
		}
	},
	zoom: (event) => {
		if (Input.mouseDown) return;
		if (!Input.focused) return;
		if (Input.scroll + event.deltaY >= -200 && Input.scroll + event.deltaY <= 200) Input.scroll += event.deltaY;
		if (Input.scroll >= 100) {
			if (Plot.zoom == 32) return;
			Plot.changeZoom(32);
		} else {
			if (Input.scroll <= -100) {
				if (Plot.zoom == 128) return;
				Plot.changeZoom(128);
			} else {
				if (Plot.zoom == 64) return;
				Plot.changeZoom(64);
			}
		}
	},
	clickPlot: (event) => {
		if (!Input.focused) {
			//console.log('gar2');
			//eval(document.elementFromPoint(event.clientX, event.clientY).dataset.click);
			return;
		}
		Sound.playSound('click.wav');
		let pos = Input.getTilePos(event.offsetX, event.offsetY);
		if (!pos) return;
		Game.heldTool.events.click(Plot.tiles[pos[1]][pos[0]], event.offsetX, event.offsetY);
	}
};