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
	init: () => {
		Game.inv.seeds = {};
		Game.inv.defineItems();
	}
};