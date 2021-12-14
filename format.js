var Format = {
    fStage: (stage) => {
        let map = ['Growing', 'Mature', 'Decaying'];
        return map[stage]
    },
    fTime: (time) => {
        let f = time / Time.dayInterval * 24;
        let hours = Math.floor(f);
        let minutes = Math.floor((f - hours) * 60);
        hours = (hours % 12) + 1
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ':' + minutes;
    }
};