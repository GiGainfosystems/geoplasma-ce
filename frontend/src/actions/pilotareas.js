import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished } from './fetching'
import { LOAD_PILOTAREAS_SUCCESS } from './types'

/**
 * Load all pilotareas that are present on the web portal
 */
export function getPilotareas() {
    return (dispatch) => {
        dispatch(dataRequest('getpilotareas', true));
        fetch(config.apiBaseUrl+'api/pilotareas', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getpilotareas', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadPilotareasSuccess(data))
            })
    };
}

/**
 * Pilot areas were loaded successfully
 * 
 * @param  {} data - The pilot areas of the web portal
 */
export const loadPilotareasSuccess = (data) => {
    return {
        type: LOAD_PILOTAREAS_SUCCESS,
        areas: data
    }
}
