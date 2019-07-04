
const initialState = []

/**
 * Reducer for the pages (landingpages)
 * @param  {} state=initialState
 * @param  {} action
 */
export const pages = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_PAGES_SUCCESS':
            return action.pages;

        default:
        return state;
    }
}
