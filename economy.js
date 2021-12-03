Game.inv = {
	balance: 0,
	Item: class {
		constructor(name, id, icon, categories) {
			this.name = name;
			this.id = id;
			this.icon = icon;
			this.cat = categories;
			this.amount = 0;
		}
	},
	defineItems: () => {
		Game.inv.Seed = class extends Game.inv.Item {
			constructor(name, id, icon, categories, plant) {
				super(name, id, icon, categories);
				this.plant = plant;
				this.cat.push('Seed');
				Game.inv.seeds[this.name] = this;
			}
		};
		Game.inv.items = {
			'grass_seed': new Game.inv.Seed('Grass Seed', 'grass_seed', Graphics.resources['lime'], [], Game.plants[2])
		}
	},
	getOwned: () => {
		return Object.values(Game.inv.items).filter((e) => {e.amount > 0});
	},
	getGenerated: (a) => {
		return a.filter((e) => {!Interface.inventory.elem.children.map((f) => {f.id.substr(4)}).includes(e)});
	},
	genInv: () => {
		let owned = Game.inv.getOwned();
		let panel = Interface.inventory;
		let gen = Game.inv.getGenerated(owned);
		for (let i = 0; i < gen.length; i++) {
			let elem = document.createElement("DIV");
			elem.id = 'inb_' + gen[i].id;
			elem.className = 'inb';
			let img = document.createElement("IMG");
			img.src = gen[i].icon;
			elem.appendChild(img);
			panel.appendChild(elem);
		}
	},
	init: () => {
		Game.inv.seeds = {};
		Game.inv.defineItems();
	}
};