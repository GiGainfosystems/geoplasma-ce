
const initialState = []

/**
 * Reducer for the occupations that user can choose from for the yellow pages section
 * @param  {} state=initialState
 * @param  {} action
 */
export const professionalgroups = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_PROFESSIONALGROUPS_SUCCESS':
            return action.groups;

        default:
        return state;
    }
}
