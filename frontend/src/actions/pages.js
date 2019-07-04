import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'
import { LOAD_PAGES_SUCCESS } from './types'

/**
 * Get all pages that are present on the web portal
 */
export function getPages() {
    return (dispatch) => {
        dispatch(dataRequest('getpages', true));
        fetch(config.apiBaseUrl+'api/pages', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getpages', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadPagesSuccess(data))
            })
    };
}

/**
 * Loaded the pages successfully
 * 
 * @param  {} pages - The pages of the web portal
 */
export const loadPagesSuccess = (pages) => {
    return {
        type: LOAD_PAGES_SUCCESS,
        pages
    }
}

/**
 * Save a page to the web portal
 * 
 * @param  {} id - If a page is edited, the according ID of the page
 * @param  {} title - Title of the page
 * @param  {} title_de
 * @param  {} title_cs
 * @param  {} title_pl
 * @param  {} title_sk
 * @param  {} title_sl
 * @param  {} navigation - Placement of the link to the page on the web portal (Top navi, Footer)
 * @param  {} url - URL of the new page
 * @param  {} token - JWT token
 */
export function savePage(id, title, title_de, title_cs, title_pl, title_sk, title_sl, navigation, url, token) {
    return (dispatch) => {
        dispatch(formRequest('savepage', true));
        fetch(config.apiBaseUrl+'api/superuser/page/edit?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, title, title_de, title_cs, title_pl, title_sk, title_sl, navigation, url})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('savepage', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((entries) => {
                dispatch(formRequestSuccess({ form: 'savepage', status: true}));
                dispatch(loadPagesSuccess(entries))
            })
    };
}

/**
 * Remove a page from the web portal
 * 
 * @param  {} id - ID of the page that should be removed
 * @param  {} token - JWT token
 */
export function removePage(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removepage', true));
        fetch(config.apiBaseUrl+'api/superuser/page/delete?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('removepage', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((entries) => {
                dispatch(formRequestSuccess({ form: 'removepage', status: true}));
                dispatch(loadPagesSuccess(entries))
            })
    };
}
