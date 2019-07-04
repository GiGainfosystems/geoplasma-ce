import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'

/**
 * Get all the field measurements for the given pilot area
 * 
 * @param  {} area - Pilot area
 */
export function getMeasurements(area) {
    return (dispatch) => {
        dispatch(dataRequest('getmeasurements', true));
        fetch(config.apiBaseUrl+'api/measurements/'+area, {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getmeasurements', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadMeasurementsSuccess(data))
            })
    };
}

/**
 * Field measurements were loaded successfully
 * 
 * @param  {} data - The field measurements
 */
export const loadMeasurementsSuccess = (data) => {
    return {
        type: 'LOAD_MEASUREMENTS_SUCCESS',
        measurements: data
    }
}