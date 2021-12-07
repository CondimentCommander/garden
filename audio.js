var Sound = {
    init: () => {
        Sound.musicChannel = new Audio();
    },
    playSound: (src) => {
        let ad = new Audio(src);
        ad.addEventListener('canplaythrough', (event) => {ad.play(); delete ad;});
    }
};