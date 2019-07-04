import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished } from './fetching'
import { LOAD_PROFESSIONALGROUPS_SUCCESS } from './types'

/**
 * Load all the professional groups that users can select in the yellow pages
 */
export function getProfessionalgroups() {
    return (dispatch) => {
        dispatch(dataRequest('getprofessionalgroups', true));
        fetch(config.apiBaseUrl+'api/professionalgroups', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getprofessionalgroups', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadProfessionalgroupsSuccess(data))
            })
    };
}

/**
 * The professional groups were loaded
 * 
 * @param  {} data - The groups
 */
export const loadProfessionalgroupsSuccess = (data) => {
    return {
        type: LOAD_PROFESSIONALGROUPS_SUCCESS,
        groups: data
    }
}
