import {
    SIGNUP_SUCCESSFULL,
    SIGNIN_SUCCESSFULL,
    LOGOUT
} from '../actions/types'
import Cookies from 'universal-cookie';
const cookies = new Cookies();

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
            if(action.user.isLoggedIn) {
                let token = cookies.get('token');
                if(!token) {
                    if(action.user.token) {
                        cookies.set('token', action.user.token.token, { path: '/'});
                    }

                }
            } else {
                cookies.remove('token', { path: '/'});
            }
            return action.user;

        case LOGOUT:
            cookies.remove('token', { path: '/'});
            return {};

        case 'REMOVE_USER_SUCCESS':
            cookies.remove('token', { path: '/'});
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
