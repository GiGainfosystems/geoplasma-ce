import config from '../config';
import { LOAD_USERPROFILES_SUCCESS, UPDATE_USERPROFILE_SUCCESS } from './types'
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestError, formRequestSuccess } from './fetching'

/**
 * Get the userprofiles for the yellow pages
 */
export function getUserprofiles() {
    return (dispatch) => {
        dispatch(dataRequest('getuserprofiles', true));
        fetch(config.apiBaseUrl+'api/userprofiles', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getuserprofiles', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadUserprofilesSuccess(data))
            })
    };
}

/**
 * The userprofiles were loaded
 * @param  {} data - Userprofiles
 */
export const loadUserprofilesSuccess = (data) => {
    return {
        type: LOAD_USERPROFILES_SUCCESS,
        user: data
    }
}

/**
 * Update a userprofile for the yellow pages section
 * @param  {} name - Name
 * @param  {} occupation - Occupation
 * @param  {} street - Street
 * @param  {} zip - ZIP code
 * @param  {} city - City
 * @param  {} country - Country
 * @param  {} phone - Phone number
 * @param  {} email - Email
 * @param  {} website - Website
 * @param  {} pilotArea - Pilotarea
 * @param  {} lat - Latitude
 * @param  {} lon - Longitude
 * @param  {} contactForm - Contact via contactform? (true/false)
 * @param  {} activated - Activated? (true/false)
 * @param  {} profile - Description
 * @param  {} token - JWT token
 */
export function updateUserprofile(name, occupation, street, zip, city, country, phone, email, website, pilotArea, lat, lon, contactForm, activated, profile, token) {
    return (dispatch) => {
        dispatch(formRequest('updateuserprofile', true));
        fetch(config.apiBaseUrl+'api/userprofiles?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({name, occupation, street, zip, city, country, phone, email, website, pilotArea, lat, lon, contactForm, activated, profile})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('updateuserprofile', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((users) => {

                dispatch(formRequestSuccess({ form: 'updateuserprofile', status: true}));
                dispatch(updateUserprofileSuccess(users))
            })
    };
}

/**
 * Toggle the active status of a userprofile
 * @param  {} id - ID of the profile
 * @param  {} token - JWT token
 */
export function toggleUserprofile(id, token) {
    return (dispatch) => {
        dispatch(formRequest('toggleuserprofile', true));
        fetch(config.apiBaseUrl+'api/userprofiles/toggle?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('toggleuserprofile', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((users) => {

                dispatch(formRequestSuccess({ form: 'toggleuserprofile', status: true}));
                dispatch(updateUserprofileSuccess(users))
            })
    };
}

/**
 * Userprofile was updated
 * @param  {} users - Updated userprofiles
 */
export const updateUserprofileSuccess = (users) => {
    return {
        type: UPDATE_USERPROFILE_SUCCESS,
        users
    }
}
