import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'

/**
 * Get all case studies from the backend
 */
export function getExamples() {
    return (dispatch) => {
        dispatch(dataRequest('getexamples', true));
        fetch(config.apiBaseUrl+'api/examples', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getexamples', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadExamplesSuccess(data))
            })
    };
}
/**
 * Request to save a case study to the backend
 * 
 * @param  {} id - If a case study is edited, the ID of the according entry
 * @param  {} pilotarea_id - The ID of the pilot area of the case study
 * @param  {} title - Title of the case study
 * @param  {} address_of_project - The address
 * @param  {} gps_coordinates - GPS coordinates of the location of the case study
 * @param  {} usage_form - Usage form
 * @param  {} heating_capacity - Heating capacity
 * @param  {} heating_production - Heating production
 * @param  {} cooling_capacity - Cooling capacity
 * @param  {} cooling_production - Cooling production
 * @param  {} seasonal_performance - Seasonal performance
 * @param  {} number_of_tubes_wells - Number of tubes / wells
 * @param  {} depth_of_tubes_wells - Depths of tubes / wells
 * @param  {} geothermal_coverage_rate - Geothermal coverage rate
 * @param  {} supply_temperature_borehole - Supply temperature borehole
 * @param  {} supply_temperature_heating - Supply temperature heating
 * @param  {} supply_temperature_cooling - Supply temperature cooling
 * @param  {} planning_company - The planning company
 * @param  {} specialties_of_project - Specialties of the project
 * @param  {} drilling_company - Drilling company
 * @param  {} heating_installer - Heating installer
 * @param  {} thermal_response_test - TRT test yes/no
 * @param  {} year_of_installation - The year of the installation
 * @param  {} web_link - Link to the project with more information
 * @param  {} description - Description of the project
 * @param  {} introduction - Introduction to the project
 * @param  {} token - JWT token
 */
export function saveExample(id, pilotarea_id, title, address_of_project, gps_coordinates, usage_form, heating_capacity, heating_production, cooling_capacity, cooling_production, seasonal_performance, number_of_tubes_wells, depth_of_tubes_wells, geothermal_coverage_rate, supply_temperature_borehole, supply_temperature_heating, supply_temperature_cooling, planning_company, specialties_of_project, drilling_company, heating_installer, thermal_response_test, year_of_installation, web_link, description, introduction,token) {

    return (dispatch) => {
        dispatch(formRequest('saveexample', true));
        fetch(config.apiBaseUrl+'api/examples?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, pilotarea_id, title, address_of_project, gps_coordinates, usage_form, heating_capacity, heating_production, cooling_capacity, cooling_production, seasonal_performance, number_of_tubes_wells, depth_of_tubes_wells, geothermal_coverage_rate, supply_temperature_borehole, supply_temperature_heating, supply_temperature_cooling, planning_company, specialties_of_project, drilling_company, heating_installer, thermal_response_test, year_of_installation, web_link, description, introduction})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(formRequestError('saveexample', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((units) => {
                dispatch(loadExamplesSuccess(units))
            })
    };
}

/**
 * Send the case studies after the load request to the dispatcher
 * 
 * @param  {} data - Contains all case studies from the web portal
 */
export const loadExamplesSuccess = (data) => {
    return {
        type: 'LOAD_EXAMPLES_SUCCESS',
        examples: data
    }
}