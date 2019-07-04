
const initialState = []
/**
 * Reducer for the thematic coverages of the knowledge repository
 * @param  {} state=initialState
 * @param  {} action
 */
export const topics = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_TOPICS_SUCCESS':
            return action.topics;

        default:
        return state;
    }
}
