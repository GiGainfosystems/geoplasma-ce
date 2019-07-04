import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished } from './fetching'
import { LOAD_TOPICS_SUCCESS } from './types'

/**
 * Load the thematic coverages that contents on the knowledge repository can have
 */
export function getThematicCoverages() {
    return (dispatch) => {
        dispatch(dataRequest('getthematiccoverages', true));
        fetch(config.apiBaseUrl+'api/topics', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getthematiccoverages', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadThematicCoveragesSuccess(data))
            })
    };
}

/**
 * Loading the thematic coverages was successfull
 * @param  {} data - Thematic coverages
 */
export const loadThematicCoveragesSuccess = (data) => {
    return {
        type: LOAD_TOPICS_SUCCESS,
        topics: data
    }
}
