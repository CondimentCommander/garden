var Time = {
    tickInterval: 10,
    dayInterval: 60,
    seasonInterval: 18,
    timeSecond: 0,
    timeTick: 0,
    timeDay: 0,
    timeSeason: 0,
    tickPoint: 0,
    dayPoint: 0,
    init: () => {
        Time.updateTime();
        Time.loop = setInterval(Time.updateTime, 1000);
    },
    updateTime: () => {
        let date = new Date();
        Time.timeSecond = (date.getHours() * 3600) + (date.getMinutes() * 60) + Math.floor(date.getSeconds());
        Time.timeTick = Time.timeSecond / Time.tickInterval;
        Time.timeDay = Time.timeTick / Time.dayInterval;
        Time.timeSeason = Time.timeDay / Time.seasonInterval;
        Time.tickPoint = 10 - (Time.timeSecond % Time.tickInterval);
        Time.dayPoint = Time.timeTick % Time.dayInterval;

        //let light = Math.abs(Time.dayPoint - 30) / 30;
        if (Time.dayPoint >= 15 && Time.dayPoint < 45) {
            if (Graphics.elems[Graphics.back].img.src != 'images/sky_night.png') {
                Graphics.elems[Graphics.back].img = Graphics.resources['sky_night'];
                Graphics.refreshBG();
            }
        } else {
            if (Graphics.elems[Graphics.back].img.src != 'images/sky_day.png') {
                Graphics.elems[Graphics.back].img = Graphics.resources['sky_day'];
                Graphics.refreshBG();
            }
        }
        //Graphics.elems[Graphics.back].op = light;
        //Graphics.refreshBG();
    },
};