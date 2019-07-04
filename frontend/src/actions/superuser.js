import config from '../config';
import { dataRequest, dataRequestError, dataRequestSuccess, formRequest, formRequestError, formRequestFinished } from './fetching'
import { SUPERUSER_DATA_SUCCESS, CHANGE_USER_DETAILS_SUCCESS_SUPERUSER } from './types'
import { loadContentSuccess, loadEventsSuccess, loadMeasurementsSuccess } from './'

/**
 * Load the data that is specific to the admin
 * @param  {} token - JWT token
 */
export function loadSuperuserData(token) {
    return (dispatch) => {
        dispatch(dataRequest('loadsuperuserdata', true));
        fetch(config.apiBaseUrl+'api/superuser/loadsuperuserdata?token='+token, {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('loadsuperuserdata', false));
                }
                dispatch(dataRequest('loadsuperuserdata', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadSuperuserDataSuccess(data))
            })
    };
}

/**
 * Loading the admin data was successfull
 * @param  {} data - The admin data
 */
export const loadSuperuserDataSuccess = (data) => {
    return {
        type: SUPERUSER_DATA_SUCCESS,
        data
    }
}

/**
 * Change specifc user details that only an admin can change
 * 
 * @param  {} id - ID of the user
 * @param  {} username - Username
 * @param  {} email - Email
 * @param  {} confirmed - Confirmed 
 * @param  {} projectpartner - User is a project partner (gives upload rights for knowledge repository)
 * @param  {} deactivated - User is deactivated
 * @param  {} token - JWT token
 */
export function changeUserDetailsSuperuser(id, username, email, confirmed, projectpartner, deactivated, token) {
    return (dispatch) => {
        dispatch(formRequest('changeuserdetailssuper', true));
        fetch(config.apiBaseUrl+'api/superuser/changeuserdetails?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, username, email, confirmed, projectpartner, deactivated})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('changeuserdetailssuper', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(changeUserDetailsSuccess(data))
            })
    };
}

/**
 * Changing the user details was successfull
 * @param  {} data - The updated user details
 */
export const changeUserDetailsSuccess = (data) => {
    return {
        type: CHANGE_USER_DETAILS_SUCCESS_SUPERUSER,
        data
    }
}

/**
 * Remove content from the knowledge repository
 * @param  {} id - ID of the content
 * @param  {} token - JWT token
 */
export function removeContentSuperuser(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removesuperusercontent', true));
        fetch(config.apiBaseUrl+'api/superuser/removecontent?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('removesuperusercontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((content) => {
                dispatch(loadContentSuccess(content))
            })
    };
}

/**
 * Remove an event from the knowledge platform
 * @param  {} id - ID of the event
 * @param  {} token - JWT token
 */
export function removeEventSuperuser(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removesuperuserevent', true));
        fetch(config.apiBaseUrl+'api/superuser/removeevent?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('removesuperuserevent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((events) => {
                dispatch(loadEventsSuccess(events))
            })
    };
}

/**
 * Update the pilot area details
 * @param  {} id - ID of the pilot area
 * @param  {} contact_details - Contact details for this area
 * @param  {} excel_identifier - Excel identifier (metadata table filename)
 * @param  {} uri - URI string for this area
 * @param  {} ne_corner - NE bounding box corner
 * @param  {} sw_corner - SW bounding box corner
 * @param  {} description_en - Description
 * @param  {} description_de
 * @param  {} description_cs
 * @param  {} description_pl
 * @param  {} description_sk
 * @param  {} description_sl
 * @param  {} token - JWT token
 */
export function updatePilotarea(id, contact_details, excel_identifier, uri, ne_corner, sw_corner,  description_en, description_de, description_cs, description_pl, description_sk, description_sl, token) {

    return (dispatch) => {        
        dispatch(formRequest('updatearea', true));
        fetch(config.apiBaseUrl+'api/superuser/updatearea?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, contact_details, excel_identifier, uri, ne_corner, sw_corner, description_en, description_de, description_cs, description_pl, description_sk, description_sl})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('updatearea', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((areas) => {
                dispatch(loadEventsSuccess(areas))
            })
    };
}

/**
 * Update the field measurements
 * @param  {} area - Pilotarea
 * @param  {} token - JWT token
 */
export function updateFieldmeasurements(area, token) {

    return (dispatch) => {
        dispatch(formRequest('updatefieldmeasurements', true));
        fetch(config.apiBaseUrl+'api/superuser/measurements?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({area})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('updatefieldmeasurements', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((measurements) => {
                dispatch(loadMeasurementsSuccess(measurements))
            })
    };
}
