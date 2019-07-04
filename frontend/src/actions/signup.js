import { SIGNUP_SUCCESSFULL } from './types'
import { formRequest, formRequestFinished, formRequestError } from './fetching'
import config from '../config';

/**
 * Signup was successfull
 * @param  {} user - The user object 
 */
export const signupSuccess = (user) => {
    return {
        type: SIGNUP_SUCCESSFULL,
        user
    }
}

/**
 * Request to signup as a new user on the knowledge platform
 * 
 * @param  {} username - Username 
 * @param  {} email - Email
 * @param  {} password - Password
 */
export function signUp(username, email, password) {
    return (dispatch) => {
        dispatch(formRequest('signup', true));
        fetch(config.apiBaseUrl+'api/user/signup', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({username, email, password}),
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((user) => {
                if(user.isSignedUp) {
                    dispatch(signupSuccess(user))
                } else {
                    dispatch(formRequestError(user))
                }
            })
    };
}
