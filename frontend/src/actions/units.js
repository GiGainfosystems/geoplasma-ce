import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'

/**
 * Get the units for the virtual boreholes
 */
export function getUnits() {
    return (dispatch) => {
        dispatch(dataRequest('getunits', true));
        fetch(config.apiBaseUrl+'api/units', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getunits', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadUnitsSuccess(data))
            })
    };
}

/**
 * Save a unit request
 * @param  {} id - If a unit should be edited, ID of this unit
 * @param  {} color - Color of the unit in borehole (hexcode)
 * @param  {} area - Pilotarea
 * @param  {} identifier - Identifier in the model
 * @param  {} title_en - Title of the unit
 * @param  {} title_de
 * @param  {} title_cz
 * @param  {} title_pl
 * @param  {} title_sk
 * @param  {} title_sl
 * @param  {} description_en - Description of the unit
 * @param  {} description_de
 * @param  {} description_cz
 * @param  {} description_pl
 * @param  {} description_sk
 * @param  {} description_sl
 * @param  {} token - JWT token
 */
export function saveUnit(id, color, area, identifier, title_en, title_de, title_cz, title_pl, title_sk, title_sl, description_en, description_de, description_cz, description_pl, description_sk, description_sl, token) {

    return (dispatch) => {
        dispatch(formRequest('saveunit', true));
        fetch(config.apiBaseUrl+'api/units?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, color, area, identifier, title_en, title_de, title_cz, title_pl, title_sk, title_sl, description_en, description_de, description_cz, description_pl, description_sk, description_sl})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('saveunit', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((units) => {
                dispatch(loadUnitsSuccess(units))
            })
    };
}

/**
 * Remove a unit
 * @param  {} id - ID of the unit
 * @param  {} token - JWT token
 */
export function removeUnit(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removeunit', true));
        fetch(config.apiBaseUrl+'api/units/delete?token='+token, {
                mode: 'cors',
                method: 'post',
                body: JSON.stringify({id})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('removeunit', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((units) => {
                dispatch(loadUnitsSuccess(units))
            })
    };
}

/**
 * Units were loaded successfully
 * @param  {} data - Units
 */
export const loadUnitsSuccess = (data) => {
    return {
        type: 'LOAD_UNITS_SUCCESS',
        units: data
    }
}