import { SIGNIN_SUCCESSFULL, LOGOUT } from './types'
import { formRequest, formRequestError, formRequestFinished } from './fetching'
import config from '../config';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

/**
 * If a signin war successfull, send the signed in user to the reducer via this action
 * 
 * @param  {} user - The user object of th signed in user
 */
export const signinSuccess = (user) => {
    return {
        type: SIGNIN_SUCCESSFULL,
        user
    }
}

/**
 * Signout of the knowledge platform
 */
export const signOut = () => {
    return {
        type: LOGOUT,
        user: {}
    }
}

/**
 * Send the signin request to the backend
 * 
 * @param  {} email - The email of the user that wants to login
 * @param  {} password - The password belonging to the account
 */
export function signIn(email, password) {
    return (dispatch) => {
        dispatch(formRequest('signin', true));
        fetch(config.apiBaseUrl+'api/user/signin', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({email, password}),
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError(response))
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((user) => {
                if(user.isLoggedIn) {
                    dispatch(signinSuccess(user))

                } else {
                    dispatch(formRequestError(user))
                }
            })
    };
}

/**
 * Check if the user is logged in based on the token that is saved as a cookie
 * 
 * @param  {} token - The JWT token to check the authentification
 */
export function checkIfLoggedIn(token) {
    return (dispatch) => {
        fetch(config.apiBaseUrl+'api/user/checkauthenticate?token='+token, {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(signinSuccess(response))
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((user) => {
                if(!user.isLoggedIn) {
                    cookies.remove('token', { path: '/'});
                }
                dispatch(signinSuccess(user))
            })
    };
}

/**
 * Send the response of the remove user request to the user reducer
 * 
 * @param  {} response
 */
export const removeUserSuccess = (response) => {
    return {
        type: 'REMOVE_USER_SUCCESS',
        response
    }
}

/**
 * Send the request to remove a user from the knowledeg platform to the backend
 * 
 * @param  {} token - The JWT token for authentification
 */
export function removeUser(token) {
    return (dispatch) => {
        dispatch(formRequest('signin', true));
        fetch(config.apiBaseUrl+'api/user/remove?token='+token, {
                method: 'post',
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError(response))
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((user) => {
                if(user.status) {
                    dispatch(removeUserSuccess(user))

                } else {
                    dispatch(formRequestError(user))
                }
            })
    };
}
