import { formRequest, formRequestError, formRequestSuccess, formRequestFinished,
 dataRequest, dataRequestSuccess} from './fetching'
import config from '../config';

/**
 * Send the request to the backend to confirm a user account after registration
 * 
 * @param  {} confirmationCode - The confirmation code
 * @param  {} email - The email for which the confirmation code was generated
 */
export function confirmAccount(confirmationCode, email) {
    return (dispatch) => {
        dispatch(dataRequest('confirm', true));
        fetch(config.apiBaseUrl+'api/user/confirm/'+confirmationCode+'/'+email, {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(dataRequest('confirm', false));
                return response;
            })
            .then((response) => response.json())
            .then((confirmed) => {
                    dispatch(dataRequestSuccess(confirmed))
            })
    };
}
/**
 * Send the request to the backend if a user forgot his/her password
 * 
 * @param  {} email - The email of the account for which the password was forgotten
 */
export function forgotPassword(email) {
    return (dispatch) => {
        dispatch(formRequest('forgotpassword', true));
        fetch(config.apiBaseUrl+'api/user/forgotpassword', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({email}),
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
                dispatch(formRequestSuccess(user))
            })
    };
}

/**
 * Confirm that the password was forgotten (via link in email)
 * 
 * @param  {} token - The "forgot password token" that was generated when the forgot password request was done
 * @param  {} email - The email of the account for which the password was forgotten
 */
export function confirmPasswordReset(token, email) {
    return (dispatch) => {
        dispatch(dataRequest('confirmpasswordreset', true));
        fetch(config.apiBaseUrl+'api/user/confirmpasswordreset/'+token+'/'+email, {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(dataRequest('confirmpasswordreset', false));
                return response;
            })
            .then((response) => response.json())
            .then((user) => {
                dispatch(dataRequestSuccess(user))
            })
    };
}

/**
 * Reset the password request to the backend
 * 
 * @param  {} token - The "forgot password token"
 * @param  {} email - The email of the account for which the password should be changed
 * @param  {} password - The new password
 */
export function changePassword(token, email, password) {
    return (dispatch) => {
        dispatch(formRequest('changepassword', true));
        fetch(config.apiBaseUrl+'api/user/changepassword', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({token, email, password}),
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
                dispatch(formRequestSuccess(user))
            })
    };
}
