import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'

/**
 * Send the request to the backend to save a local contact
 * 
 * @param  {} id - If an existing contact was edited, the ID of this contact
 * @param  {} language - The language for which the contact is added
 * @param  {} pilotarea - The pilot area this contact is responsible for
 * @param  {} contactinfo - The actual contact info (html)
 * @param  {} token - The JWT authentication token
 */
export function saveLocalContact(id, language, pilotarea, contactinfo, token) {

    return (dispatch) => {
        dispatch(formRequest('savecontact', true));
        fetch(config.apiBaseUrl+'api/superuser/localcontact?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, pilotarea, language, contactinfo})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('savecontact', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((contacts) => {
                dispatch(formRequestSuccess({ form: 'savecontact', status: true}));
                dispatch(loadLocalContactsSuccess(contacts))
            })
    };
}

/**
 * The request to the backend to remove a contact
 * 
 * @param  {} id - The ID of the contact that sould be removed
 * @param  {} token - The JWT token
 */
export function removeContact(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removecontact', true));
        fetch(config.apiBaseUrl+'api/superuser/contact/delete?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('removecontact', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((contacts) => {
                dispatch(formRequestSuccess({ form: 'removecontact', status: true}));
                dispatch(loadLocalContactsSuccess(contacts))
            })
    };
}

/**
 * Send the local contacts from the successfull request to the contacts reducer
 * 
 * @param  {} contacts - The local contacts
 */
export const loadLocalContactsSuccess = (contacts) => {
    return {
        type: 'LOAD_LOCAL_CONTACTS_SUCCESS',
        contacts
    }
}