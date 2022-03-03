var Tooltip = {
    init: () => {
        Tooltip.el = document.getElementById('tooltip');
        Tooltip.wrap = document.getElementById('ttwrap');
    },
    tooltip: (el, content, x, y, hide = true) => {
        Tooltip.focus = el;
        Tooltip.wrap.style.display = 'block';
        if (hide) Plot.farm.style.cursor = 'none';
        Tooltip.ttUpdate(content);
        Graphics.setPos(Tooltip.wrap, x, y);
    },
    tooltipMove: (x, y) => {
        if (Tooltip.focus == undefined) return;
        Graphics.setPos(Tooltip.wrap, x, y);
    },
    tt: (ev, content, ox, oy, lock) => {
        Tooltip.focus = ev.target;
        Tooltip.wrap.style.display = 'block';
        Plot.farm.style.cursor = 'none';
        Tooltip.ttUpdate(content);
        Tooltip.ttMove(ev, ox, oy, lock);
    },
    ttMove: (ev, ox, oy, lock) => {
        let x = ev.clientX;
        let y = ev.clientY;
        if (lock == 'right') x = ev.target.getBoundingClientRect().left + ev.target.clientWidth;
        if (lock == 'left') x = ev.target.getBoundingClientRect().left - Tooltip.el.clientWidth;
        if (lock == 'bottom') y = ev.target.getBoundingClientRect().top + ev.target.clientHeight;
        if (lock == 'top') y = ev.target.getBoundingClientRect().top - Tooltip.el.clientHeight;
        x += ox;
        y += oy;
        Graphics.setPos(Tooltip.wrap, x, y);
    },
    ttClose: () => {
        Tooltip.wrap.style.display = 'none';
        Plot.farm.style.cursor = 'url(' + Game.heldTool.icon + '),auto';
        Tooltip.focus = undefined;
    },
    ttUpdate: (content) => {
        clearChildren(Tooltip.el);
        Tooltip.el.appendChild(content);
    },
    buildTool: (ev, tool) => {
        let e = document.createElement("DIV");
        let i = document.createElement("IMG");
        i.src = ev.target.firstElementChild.src;
        i.style.display = 'inline-block';
        i.width = 32;
        i.height = 32;
        i.style.backgroundColor = 'black';
        i.style.borderStyle = 'solid';
        i.style.borderWidth = '0px';
        i.style.borderRadius = '10px';
        let tdiv = document.createElement("DIV");
        tdiv.style.display = 'inline-block';
        tdiv.style.marginLeft = '8px';
        tdiv.appendChild(document.createTextNode(tool.name));
        let ddiv = document.createElement("DIV");
        ddiv.style.color = 'white';
        ddiv.appendChild(document.createTextNode(tool.desc));
        e.appendChild(i);
        e.appendChild(tdiv);
        e.appendChild(ddiv);
        return e;
    },
    buildTime: () => {
        let e = document.createElement("DIV");
        let tdiv = document.createElement("DIV");
        tdiv.appendChild(document.createTextNode('Tick: ' + Math.floor(Time.timeTick)));
        let ddiv = document.createElement("DIV");
        ddiv.appendChild(document.createTextNode('Day: ' + Math.floor(Time.timeDay)));
        let hdiv = document.createElement("DIV");
        hdiv.appendChild(document.createTextNode('Time: ' + Lang.formatTime(Time.dayPoint)));
        e.appendChild(tdiv);
        e.appendChild(ddiv);
        e.appendChild(hdiv);
        return e;
    },
    buildItem: (item) => {
        let e = document.createElement("DIV");
        let i = document.createElement("IMG");
        i.src = item.icon;
        i.width = 32;
        i.height = 32;
        i.style.display = 'inline-block';
        let ndiv = document.createElement("DIV");
        ndiv.style.fontSize = '17pt';
        ndiv.style.display = 'inline-block';
        ndiv.style.position = 'relative';
        ndiv.style.bottom = '10px';
        ndiv.style.left = '15px';
        ndiv.appendChild(document.createTextNode(item.name));
        let ddiv = document.createElement("DIV");
        ddiv.appendChild(document.createTextNode(item.desc));
        let ldiv = document.createElement("DIV");
        ldiv.style.color = 'black';
        ldiv.style.fontStyle = 'italic';
        ldiv.style.fontSize = '10pt';
        ldiv.appendChild(document.createTextNode(item.lore));
        e.appendChild(i);
        e.appendChild(ndiv);
        e.appendChild(ddiv);
        e.appendChild(ldiv);
        return e;
    },
    buildInspect: (tile) => {
        let e = document.createElement("DIV");
        let ndiv = document.createElement("DIV");
        ndiv.style.fontSize = '14pt';
        ndiv.style.color = 'Gold';
        ndiv.appendChild(document.createTextNode(tile.plant.plant.dn));
        let ddiv = document.createElement("DIV");
        ddiv.appendChild(document.createTextNode(tile.plant.plant.desc));
        let ldiv = document.createElement("DIV");
        ldiv.style.color = 'white';
        ldiv.style.fontStyle = 'italic';
        ldiv.style.fontSize = '11pt';
        ldiv.appendChild(document.createTextNode(tile.plant.plant.lore));
        let sdiv = document.createElement("DIV");
        sdiv.style.color = 'DarkGreen';
        sdiv.appendChild(document.createTextNode('Stage: ' + Lang.formatStage(tile.plant.stage)));
        let gdiv = document.createElement("DIV");
        gdiv.style.color = 'LightGreen';
        gdiv.appendChild(document.createTextNode('Growth: ' + tile.plant.grows + '/' + (tile.plant.inh.growth.stages.length - 1)));
        e.appendChild(ndiv);
        e.appendChild(ddiv);
        e.appendChild(ldiv);
        e.appendChild(sdiv);
        e.appendChild(gdiv);
        return e;
    },
    buildSeed: (seed) => {
        let e = Tooltip.buildItem(seed);
        e.appendChild(document.createTextNode('Owned: ' + seed.amount));
        return e;
    }
};