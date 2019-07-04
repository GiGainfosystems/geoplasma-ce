import config from '../config';
import { getTags } from './tags'
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'
import { LOAD_CONTENT_SUCCESS, ADD_CONTENT_SUCCESS } from './types'

/**
 * Get the content (knowledge repository) from the backend
 */
export function getContent() {
    return (dispatch) => {
        dispatch(dataRequest('getcontent', true));
        fetch(config.apiBaseUrl+'api/content', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getcontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadContentSuccess(data))
            })
    };
}

/**
 * Send the request response data containing the knowledge repository content to the reducer
 * 
 * @param  {} data - The contents of the knowledge repository
 */
export const loadContentSuccess = (data) => {
    return {
        type: LOAD_CONTENT_SUCCESS,
        content: data
    }
}
/**
 * Send the request to the backend to save content of the knowledge repository
 * 
 * @param  {} id - If an entry is edited, the ID of the according entry
 * @param  {} title - The title of the entry
 * @param  {} year - The publication year
 * @param  {} author - The author of the document that is linked / uploaded
 * @param  {} publisher_place - The location of the publisher
 * @param  {} territorial_coverage - The territorial coverage of the content
 * @param  {} language - The language of the content
 * @param  {} synopsis - A short summary of the content
 * @param  {} link - Link to download the article / publication if possible
 * @param  {} topics - The thematic coverages of the entry
 * @param  {} tags - The tags of the article
 * @param  {} internal_id
 * @param  {} external_link - External link to full document 
 * @param  {} token
 */
export function addContent(id, title, year, author, publisher_place, territorial_coverage, language, synopsis, link, topics, tags, internal_id, external_link, token) {

    return (dispatch) => {
        dispatch(formRequest('addcontent', true));
        fetch(config.apiBaseUrl+'api/topics?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, title, year, author, publisher_place, territorial_coverage, language, synopsis, link, topics, tags, internal_id, external_link })
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('addcontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((content) => {
                dispatch(formRequestSuccess({ form: 'addcontent', status: true}));
                dispatch(addContentSuccess(content))
                dispatch(getTags())
            })
    };
}

/**
 * The request to the backend to remove content from the knowledge repository
 * 
 * @param  {} id - The ID of the content that should be deleted
 * @param  {} token - The JWT token
 */
export function removeContent(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removecontent', true));
        fetch(config.apiBaseUrl+'api/topics/delete?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('removecontent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((content) => {
                dispatch(formRequestSuccess({ form: 'removecontent', status: true}));
                dispatch(loadContentSuccess(content))
            })
    };
}

/**
 * Send the contents from the loadContents request to the reducer
 * 
 * @param  {} content - The contents of the knowledge repository
 */
export const addContentSuccess = (content) => {
    return {
        type: ADD_CONTENT_SUCCESS,
        content
    }
}
