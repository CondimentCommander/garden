var Interface = {
	panels: {},
	Panel: class {
		constructor(elem) {
			this.elem = elem;
			Interface.panels[this.elem.id] = this;
		}
	},
	defineElements: () => {
		
	},
	openFloat: (panel) => {
		Interface.activeFloat = panel;
		panel.elem.style.display = 'block';
		if (panel.elem.dataset.fill == 'main') {
			document.getElementById('dim').style.opacity = 0.5;
			document.getElementById('dim').style.pointerEvents = 'auto';
			//Graphics.addFilter('blur(5px)', false);
			//Graphics.addFilter('blur(5px)', true);
		}
	},
	closeFloat: (panel) => {
		Interface.activeFloat = undefined;
		panel.elem.style.display = 'none';
		document.getElementById('dim').style.opacity = 0;
		document.getElementById('dim').style.pointerEvents = 'none';
		//Graphics.addFilter('saturate(100%)', false);
		//Graphics.addFilter('saturate(100%)', true);
	},
	definePanels: () => {
		Interface.test = new Interface.Panel(document.getElementById('test'));
		Interface.toolContext = new Interface.Panel(document.getElementById('toolcontext'));
		Interface.openFloat(Interface.toolContext);
		Interface.inventory = new Interface.Panel(document.getElementById('inventory'));
	},
	close: (event) => {
		Interface.closeFloat(Interface.panels[event.srcElement.parentElement.id]);
	},
	init: () => {
		Interface.definePanels();
	}
};