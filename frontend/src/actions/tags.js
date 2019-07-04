import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished } from './fetching'
import { LOAD_TAGS_SUCCESS } from './types'

/**
 * Load all tags for the knowledge repository
 */
export function getTags() {
    return (dispatch) => {
        dispatch(dataRequest('gettags', true));
        fetch(config.apiBaseUrl+'api/tags', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('gettags', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadTagsSuccess(data))
            })
    };
}

/**
 * Loading the tags was successfull, return tags to the reducer
 * @param  {} data - The tags
 */
export const loadTagsSuccess = (data) => {
    return {
        type: LOAD_TAGS_SUCCESS,
        tags: data
    }
}
