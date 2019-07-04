import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'

/**
 * Load the links that are presented in the "International projects" section
 */
export function getLinks() {
    return (dispatch) => {
        dispatch(dataRequest('getlinks', true));
        fetch(config.apiBaseUrl+'api/links', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getlinks', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadLinksSuccess(data))
            })
    };
}

/**
 * Send a request to update the links that are presentsd in the "international projects" section
 * @param  {} token - JWT token
 */
export function updateLinks(token) {
    return (dispatch) => {
        dispatch(dataRequest('updateLinks', true));
        fetch(config.apiBaseUrl+'api/links?token='+token, {
                mode: 'cors',
                method: 'post'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('updateLinks', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadLinksSuccess(data))
            })
    };
}

/**
 * Links were loaded successfully and are sent to the reducer
 * 
 * @param  {} data - The links
 */
export const loadLinksSuccess = (data) => {
    return {
        type: 'LOAD_LINKS_SUCCESS',
        links: data
    }
}