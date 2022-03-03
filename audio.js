var Sound = {
    init: () => {
        Sound.channels = {
            'music': new Audio()
        };
    },
    playSound: (src) => {
        let ad = new Audio(src);
        ad.addEventListener('canplaythrough', (event) => {ad.play(); delete ad;});
    },
    playChannelSound: (src, channel) => {
        let channel = Sound.channels[src];
        channel.addEventListener('canplaythrough', (event) => {ad.play(); delete ad;});
    }
};