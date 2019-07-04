
const initialState = []
/**
 * Reducer for the contents of the landingpages
 * @param  {} state=initialState
 * @param  {} action
 */
export const sitecontent = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_SITECONTENT_SUCCESS':
            return action.contents;

        default:
        return state;
    }
}
