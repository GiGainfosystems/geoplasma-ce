

const initialState = [
    { id: 1, label: "country.albania", flag: 'alb' },
    { id: 2, label: "country.andorra", flag: 'and' },
    { id: 3, label: "country.armenia", flag: 'arm' },
    { id: 4, label: "country.austria", flag: 'aut' },
    { id: 5, label: "country.azerbaijan", flag: 'aze' },
    { id: 50, label: "country.belarus", flag: 'blr' },
    { id: 6, label: "country.belgium", flag: 'bel' },
    { id: 8, label: "country.bosnia_and_herzegovina", flag: 'bos' },
    { id: 9, label: "country.bulgaria", flag: 'blg' },
    { id: 10, label: "country.croatia", flag: 'cro' },
    { id: 11, label: "country.cyprus", flag: 'cyp' },
    { id: 12, label: "country.czech_republic", flag: 'czr' },
    { id: 13, label: "country.denmark", flag: 'den' },
    { id: 14, label: "country.estonia", flag: 'est' },
    { id: 15, label: "country.finland", flag: 'fin' },
    { id: 16, label: "country.france", flag: 'fra' },
    { id: 17, label: "country.georgia", flag: 'geo' },
    { id: 18, label: "country.germany", flag: 'ger' },
    { id: 19, label: "country.greece", flag: 'gre' },
    { id: 20, label: "country.hungary", flag: 'hun' },
    { id: 21, label: "country.iceland", flag: 'ice' },
    { id: 22, label: "country.ireland", flag: 'ire' },
    { id: 23, label: "country.italy", flag: 'ita' },
    { id: 24, label: "country.kazakhstan", flag: 'kaz' },
    { id: 25, label: "country.kosovo", flag: 'kos' },
    { id: 26, label: "country.latvia", flag: 'lat' },
    { id: 27, label: "country.liechtenstein", flag: 'lie' },
    { id: 28, label: "country.lithuania", flag: 'lit' },
    { id: 29, label: "country.luxembourg", flag: 'lux' },
    { id: 30, label: "country.macedonia", flag: 'mac' },
    { id: 31, label: "country.malta", flag: 'mlt' },
    { id: 32, label: "country.moldova", flag: 'mol' },
    { id: 33, label: "country.montenegro", flag: 'mon' },
    { id: 34, label: "country.netherlands", flag: 'ned' },
    { id: 35, label: "country.norway", flag: 'nor' },
    { id: 36, label: "country.poland", flag: 'pol' },
    { id: 37, label: "country.portugal", flag: 'por' },
    { id: 38, label: "country.romania", flag: 'rom' },
    { id: 39, label: "country.russia", flag: 'rus' },
    { id: 40, label: "country.san_marino", flag: 'san' },
    { id: 41, label: "country.serbia", flag: 'ser' },
    { id: 42, label: "country.slovakia", flag: 'svk' },
    { id: 43, label: "country.slovenia", flag: 'svn' },
    { id: 44, label: "country.spain", flag: 'esp' },
    { id: 45, label: "country.sweden", flag: 'swe' },
    { id: 46, label: "country.switzerland", flag: 'swi' },
    { id: 47, label: "country.turkey", flag: 'tur' },
    { id: 48, label: "country.ukraine", flag: 'ukr' },
    { id: 49, label: "country.united_kingdom", flag: 'uk' },
]

/**
 * Reducer for the countries that a user can select in the yellow pages section
 * @param  {} state=initialState
 * @param  {} action
 */
export const countries = (state = initialState, action) => {
    switch (action.type) {

        default:
        return state;
    }
}
