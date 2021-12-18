var Lang = {
    fStage: (stage) => {
        let map = [Lang.l.map.format.stage[0], Lang.l.map.format.stage[1], Lang.l.map.format.stage[2]];
        return map[stage]
    },
    fTime: (time) => {
        let f = time / Time.dayInterval * 24;
        let hours = Math.floor(f);
        let minutes = Math.floor((f - hours) * 60);
        hours = (hours % 12) + 1
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ':' + minutes;
    },
    l: '',
    langs: {
        'en_us': {
            name: 'en_us',
            dn: 'United States English',
            map: {
                format: {
                    stage: ['Growing', 'Mature', 'Decaying']
                },
                plant: {
                    empty: {
                        name: 'Empty',
                        desc: '',
                        lore: 'Nothing to see here...'
                    },
                    test: {
                        name: 'Test',
                        desc: 'Unused debug plant',
                        lore: 'How did you get this?'
                    },
                    grass: {
                        name: 'Grass',
                        desc: 'Grows quickly and sprouts on unkempt soil',
                        lore: 'Don\'t you think it\'s time to mow?'
                    },
                    cornweed: {
                        name: 'Cornweed',
                        desc: 'A weed that spreads slowly and appears where you don\'t want it',
                        lore: 'Feels dry just looking at it'
                    }
                },
                inv: {
                    item: {
                        grass_seed: {
                            name: 'Grass Seed',
                            lore: 'The most common seed around. You almost have too much...'
                        },
                        cornweed_seed: {
                            name: 'Dusty Kernels',
                            lore: 'Try it popped!'
                        },
                        test_seed: {
                            name: 'Debug Pellets',
                            lore: 'Why'
                        }
                    },
                    seed_description: 'A seed that can be planted in the plot'
                },
                tool: {
                    inspect: {
                        name: 'Inspect',
                        desc: 'View plant information'
                    },
                    plant: {
                        name: 'Plant',
                        desc: 'Plant seeds on farmland'
                    },
                    harvest: {
                        name: 'Harvest',
                        desc: 'Obtain resources from plants'
                    }
                },
                soil: {
                    rough: {
                        name: 'Rough Soil'
                    },
                    farmland: {
                        name: 'Farmland'
                    }
                }
            }
        }
    },
    init: () => {
        Lang.l = Lang.langs.en_us;
    }
};
Lang.init();