var Interface = {
	Panel: class {
		constructor(elem) {
			this.elem = elem;
		}
	},
	openFloat: (panel) => {
		Interface.activeFloat = panel;
		panel.elem.style.display = 'block';
		document.getElementById('dim').style.opacity = 0.5;
		document.getElementById('dim').style.pointerEvents = 'auto';
	},
	closeFloat: (panel) => {
		Interface.activeFloat = undefined;
		panel.elem.style.display = 'none';
		document.getElementById('dim').style.opacity = 0;
		document.getElementById('dim').style.pointerEvents = 'none';
	},
	definePanels: () => {
		
	},
	init: () => {
		Interface.test = new Interface.Panel(document.getElementById('test'));
	}
};