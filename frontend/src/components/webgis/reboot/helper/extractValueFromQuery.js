import getTranslation from '../../../../i18n/'

/**
 * Extract the value from a location query, the response can be different so we need this helper function
 * @param  {} layer - Active layer
 * @param  {} value - Value that was returned from the backend / geoserver
 * @param  {} language - Active language
 */
export const extractValueFromQuery = (layer, value, language) => {
    let response;
    
    if((value !== undefined) && (value !== '-')) {
        if((layer.traffic_light_map_open_loop) || (layer.traffic_light_map_closed_loop)) {
            response = (value == -9999 ? '-' : getTranslation(layer.legend.filter(entry => entry.quantity == value)[0].label))
        }
    
        if(layer.conflicts !== false) {
            response = ((value == -9999) ? 'No data available' : (value == 0) ? 'Not existing' : (layer.legend.filter(entry => entry.quantity == value)[0].labels[language] ? layer.legend.filter(entry => entry.quantity == value)[0].labels[language] : layer.legend.filter(entry => entry.quantity == value)[0].labels.English))
        }
    
        if((layer.conflicts === false) && (!layer.traffic_light_map_open_loop) && (!layer.traffic_light_map_closed_loop)) {
            response = (layer.variable_type_of_cell_related_parameter === "binary" ? (value == 1 ? 'fa-check' : 'fa-times') : value)
        }
    } else {
        response = false
    } 
    return response;
}

