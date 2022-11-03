import {
    SIGNUP_SUCCESSFULL,
    SIGNIN_SUCCESSFULL,
    LOGOUT
} from '../actions/types'

const initialState = {
    isSignedUp: false,
    isLoggedIn: false,
    layers: [],
}
/**
 * User reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const user = (state = initialState, action) => {
    switch (action.type) {

        case SIGNUP_SUCCESSFULL:
            return action.user;

        case SIGNIN_SUCCESSFULL:
            return action.user;

        case LOGOUT:
            return {};

            return {}

        case 'UPDATE_LAYERS_SUCCESS':
            return {
                isSignedUp: state.isSignedUp,
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                layers: action.layers
            }

        default:
        return state;
    }
}
