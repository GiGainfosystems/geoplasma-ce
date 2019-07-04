import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'
import { LOAD_SITECONTENT_SUCCESS } from './types'

/**
 * Load the content of the landing pages
 */
export function getSiteContent() {
    return (dispatch) => {
        dispatch(dataRequest('getsitecontent', true));
        fetch(config.apiBaseUrl+'api/sitecontent', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getsitecontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((contents) => {
                dispatch(loadSiteContentSuccess(contents))
            })
    };
}

/**
 * Loading the content of the landing pages was successfull, return data to reducer
 * @param  {} contents - The contents of the landing pages
 */
export const loadSiteContentSuccess = (contents) => {
    return {
        type: LOAD_SITECONTENT_SUCCESS,
        contents
    }
}

/**
 * Save content for a specific landing page
 * 
 * @param  {} id - If given, edit the according content
 * @param  {} activated - Content is active
 * @param  {} page_id - The page where the content should appear
 * @param  {} title - The title of the content
 * @param  {} title_de
 * @param  {} title_cz
 * @param  {} title_pl
 * @param  {} title_sk
 * @param  {} title_sl
 * @param  {} text - The text of the content (rich text)
 * @param  {} text_de
 * @param  {} text_cz
 * @param  {} text_pl
 * @param  {} text_sk
 * @param  {} text_sl
 * @param  {} position - The position of the content on the given page
 * @param  {} token - JWT token
 */
export function saveSiteContent(id, activated, page_id, title, title_de, title_cz, title_pl, title_sk, title_sl, text, text_de, text_cz, text_pl, text_sk, text_sl, position, token) {
 
    return (dispatch) => {
        dispatch(formRequest('savepage', true));
        fetch(config.apiBaseUrl+'api/superuser/content/edit?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, activated, page_id, title, title_de, title_cz, title_pl, title_sk, title_sl, text, text_de, text_cz, text_pl, text_sk, text_sl, position})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('savesitecontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((contents) => {
                dispatch(formRequestSuccess({ form: 'savesitecontent', status: true}));
                dispatch(loadSiteContentSuccess(contents))
            })
    };
}

/**
 * Remove content from a landing page
 * 
 * @param  {} id - The ID of the content that should be removed
 * @param  {} token
 */
export function removeSiteContent(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removesitecontent', true));
        fetch(config.apiBaseUrl+'api/superuser/content/delete?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('removesitecontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((contents) => {
                dispatch(formRequestSuccess({ form: 'removesitecontent', status: true}));
                dispatch(loadSiteContentSuccess(contents))
            })
    };
}
