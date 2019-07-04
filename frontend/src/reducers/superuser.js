import {
    SUPERUSER_DATA_SUCCESS,
    CHANGE_USER_DETAILS_SUCCESS_SUPERUSER
} from '../actions/types'
const initialState = {
    users: [],
    settings: [],
    steps: [],
    layers: []
}
/**
 * Reducer for the admin stuff (is always empty except user is admin)
 * @param  {} state=initialState
 * @param  {} action
 */
export const superuser = (state = initialState, action) => {
    switch (action.type) {

        case SUPERUSER_DATA_SUCCESS:
            return action.data;

        case CHANGE_USER_DETAILS_SUCCESS_SUPERUSER:
            return action.data;

        case 'CREATE_NEW_STEP_SUCCESS':
            return {
                users: state.users,
                settings: state.settings,
                layers: action.data.layers,
                steps: action.data.steps
            }

        case 'GET_GISLAYERS_SUCCESS':
            return {
                users: state.users,
                settings: state.settings,
                layers: action.data,
                steps: state.steps
            }

        default:
        return state;
    }
}
