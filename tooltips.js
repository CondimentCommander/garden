var Tooltip = {
    init: () => {
        Tooltip.el = document.getElementById('tooltip');
        Tooltip.wrap = document.getElementById('ttwrap');
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
        let tdiv = document.createElement("DIV");
        tdiv.style.display = 'inline-block';
        tdiv.appendChild(document.createTextNode(tool.name));
        let ddiv = document.createElement("DIV");
        ddiv.style.color = 'black';
        ddiv.appendChild(document.createTextNode(tool.desc));
        e.appendChild(i);
        e.appendChild(tdiv);
        e.appendChild(ddiv);
        return e;
    },
    buildTime: () => {
        let e = document.createElement("DIV");
        let tdiv = document.createElement("DIV");
        tdiv.appendChild(document.createTextNode('Tick: ' + Time.timeTick));
        let ddiv = document.createElement("DIV");
        ddiv.appendChild(document.createTextNode('Day: ' + Time.timeDay));
        let hdiv = document.createElement("DIV");
        hdiv.appendChild(document.createTextNode('Time: ' + Time.dayPoint));
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
        ndiv.style.fontSize = '15pt';
        ndiv.style.display = 'inline-block';
        ndiv.appendChild(document.createTextNode(item.name));
        let ddiv = document.createElement("DIV");
        ddiv.appendChild(document.createTextNode(item.desc));
        let ldiv = document.createElement("DIV");
        ldiv.style.color = 'black';
        ldiv.style.fontStyle = 'italic';
        ldiv.style.fontSize = '8pt';
        ldiv.appendChild(document.createTextNode(item.lore));
        e.appendChild(i);
        e.appendChild(ndiv);
        e.appendChild(ddiv);
        e.appendChild(ldiv);
        return e;
    }
};