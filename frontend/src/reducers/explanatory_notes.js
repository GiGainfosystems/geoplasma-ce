
const initialState = {
  notes: []
}

/**
 * Reducer for the explanatory notes
 * @param  {} state=initialState
 * @param  {} action
 */
export const explanatorynotes = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_NOTES_SUCCESS':
            return {
              notes: action.entries
            }

        default:
        return state;
    }
}
