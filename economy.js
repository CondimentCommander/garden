Game.inv = {
	balance: 0,
	Item: class {
		constructor(name, id, icon, categories, desc, lore) {
			this.name = name;
			this.id = id;
			this.icon = icon;
			this.cat = categories;
			this.desc = desc;
			this.lore = lore;
			this.amount = 0;
		}
	},
	defineItems: () => {
		Game.inv.Seed = class extends Game.inv.Item {
			constructor(name, id, icon, categories, lore, plant) {
				super(name, id, icon, categories, 'A seed that can be planted in the plot', lore);
				this.plant = plant;
				this.cat.push('Seed');
				Game.inv.seeds[this.id] = this;
			}
		};
		Game.inv.items = {
			'grass_seed': new Game.inv.Seed('Grass Seed', 'grass_seed', 'images/lime/2.png', ['seed'], 'The most common seed around. You almost have too much...', Game.plants[2]),
			'cornweed_seed': new Game.inv.Seed('Dusty Kernels', 'cornweed_seed', 'images/kernels.png', ['seed'], 'Try it popped!', Game.plants[3]),
		}
	},
	getOwned: () => {
		return Object.values(Game.inv.items).filter((e) => {return e.amount > 0});
	},
	getGenerated: (a) => {
		return a.filter((e) => {!Interface.inventory.elem.children.map((f) => {f.id.substr(4)}).includes(e)});
	},
	genInv: () => {
		let owned = Game.inv.getOwned();
		let gen = owned;
		clearChildren(Game.inv.sect);
		for (let i = 0; i < gen.length; i++) {
			let elem = document.createElement("DIV");
			elem.id = 'inb_' + gen[i].id;
			elem.dataset.item = gen[i].id;
			elem.className = 'inb';
			let img = document.createElement("IMG");
			img.width = 64;
			img.height = 64;
			img.src = gen[i].icon;
			let amt = document.createTextNode(gen[i].amount);
			let amtd = document.createElement("DIV");
			amtd.className = 'inv_amt';
			amtd.appendChild(amt);
			elem.appendChild(img);
			elem.appendChild(amtd);
			elem.onmouseenter = (event) => {Tooltip.tt(event, Tooltip.buildItem(Game.inv.items[event.target.dataset.item]), 0, 0, '')};
			elem.onmousemove = (event) => {Tooltip.ttMove(event, 0, 0, '')};
			elem.onmouseleave = () => {Tooltip.ttClose()};
			Game.inv.sect.appendChild(elem);
		}
	},
	init: () => {
		Game.inv.sect = document.getElementById('inv_items');
		Game.inv.seeds = {};
		Game.inv.defineItems();
		Game.inv.items['grass_seed'].amount = 100;
		Game.inv.items['cornweed_seed'].amount = 10;
	}
};