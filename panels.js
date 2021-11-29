var Interface = {
	panels: {},
	Panel: class {
		constructor(elem) {
			this.elem = elem;
			Interface.panels[this.elem.id] = this;
			this.panels = {};
		}
		addSubPanel(name, content) {
			this.panels[name] = new Interface.SubPanel(name, content);
		}
	},
	SubPanel: class {
		constructor(name, content) {
			this.name = name;
			this.content = content;
			this.panels = {};
		}
		addSubPanel(name, content) {
			this.panels[name] = new Interface.SubPanel(name, content);
		}
	},
	Content: class {
		constructor() {
			this.parts = [];
			this.content = [];
		}
		construct() {
			for (let i = 0; i < this.parts.length; i++) {
				switch(typeof this.parts[i]) {
					case 'Interface.text':
						
				}
			}
		}
		addText(text, style) {
			this.parts.push(new Interface.Text(text, style));
		}
		addPanel(name, content) {
			
		}
		addButton() {
			
		}
		addMulti() {
			
		}
	},
	PanelElement: class {
		constructor() {
			
		}
	},
	defineElements: () => {
		Interface.Text = class extends Interface.PanelElement {
			constructor(text, style) {
				super(style);
			}
		}
	},
	openFloat: (panel) => {
		Interface.activeFloat = panel;
		panel.elem.style.display = 'block';
		if (panel.elem.dataset.fill == 'main') {
			document.getElementById('dim').style.opacity = 0.5;
			document.getElementById('dim').style.pointerEvents = 'auto';
			Graphics.addFilter('blur(5px)', false);
			Graphics.addFilter('blur(5px)', true);
		}
	},
	closeFloat: (panel) => {
		Interface.activeFloat = undefined;
		panel.elem.style.display = 'none';
		document.getElementById('dim').style.opacity = 0;
		document.getElementById('dim').style.pointerEvents = 'none';
		Graphics.addFilter('saturate(100%)', false);
		Graphics.addFilter('saturate(100%)', true);
	},
	definePanels: () => {
		Interface.test = new Interface.Panel(document.getElementById('test'));
		Interface.toolContext = new Interface.Panel(document.getElementById('toolcontext'));
		Interface.openFloat(Interface.toolContext);
	},
	close: (event) => {
		Interface.closeFloat(Interface.panels[event.srcElement.parentElement.id]);
	},
	init: () => {
		Interface.definePanels();
	}
};