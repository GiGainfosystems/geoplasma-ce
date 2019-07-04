
const initialState = []
/**
 * Tags reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const tags = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_TAGS_SUCCESS':
            return action.tags;

        default:
        return state;
    }
}
