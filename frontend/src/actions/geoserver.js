import { GET_LAYERS_SUCCESS, GEOCODE_ERROR } from './types'
import { dataRequest, dataRequestError, formRequestFinished, dataRequestSuccess } from './fetching'
import config from '../config'
import { compareData } from '../components/webgis/helper'
import { saveAs } from 'file-saver'
import { reverseGeocode, geocodeError } from './geocode'


/**
 * Update the map props 
 * 
 * @param  {} bounds - Bounding box of the map
 * @param  {} area - Active pilot area
 * @param  {} selected_layer - Selected layer
 */
export const updateMapProps = (bounds, area, selected_layer) => {
    return {
        type: 'UPDATE_MAP_PROPS',
        bounds,
        area,
        selected_layer
    }
}
/**
 * Get all the layers from the geoserver for a given pilot area
 * 
 * @param  {} workspace - The pilot area
 * @param  {} filter
 */
export function getLayers(workspace, filter) {
    return (dispatch) => {

        dispatch(dataRequest('getlayers', true));
        let url = config.apiBaseUrl+'api/geoserver/getlayers/'+workspace
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    dispatch(geocodeError());
                }
                dispatch(dataRequest('getlayers', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                data.filter = filter
                dispatch(getLayersSuccess(data))
                dispatch(dataRequestSuccess({data: 'getlayers', status: true}));
            })
    };
}

/**
 * Request to get all layers was successfull, data is sent to the reducer
 * 
 * @param  {} layers - The layers of the requested pilot area
 */
export const getLayersSuccess = (layers) => {
    return {
        type: GET_LAYERS_SUCCESS,
        layers
    }
}

/**
 * Send a location query request to the backend
 *  
 * @param  {} link - Link containing the geoserver params
 * @param  {} reportParams - link containing the geoserver params for a full report at this location
 * @param  {} layers - All layers for the active pilot area (used for the report query)
 * @param  {} coords - Coordinates of the location query
 */
export function locationQuery(link, reportParams, layers, coords) {
    return (dispatch) => {
        dispatch(dataRequest('locationquery', true));
        // Empty the report data in case a report was created before
        dispatch(prepareReport())
        dispatch(queryRequest(coords))
        dispatch(reverseGeocode(coords))
        let url = config.apiBaseUrl+'api/geoserver/locationquery'
        fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({link})
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(geocodeError());
                }
                dispatch(dataRequest('locationquery', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(dataRequestSuccess(data)) 
                const query = {
                    lat: coords[0],
                    lng: coords[1],
                    value: data.message
                }   
                dispatch(queryRequestSuccess(query))
                // Send a report query to the backend
                if(query.value !== '-') {
                    dispatch(reportQuery(reportParams, layers, coords))
                }
            })
    };
}

/**
 * Send a request to the reducer to empty the report data
 */
export const prepareReport = () => {
    return {
        type: 'PREPARE_REPORT',
    }
}

/**
 * A query request for the given coordinates was started
 * 
 * @param  {} coords - Coordinates of the request
 */
export const queryRequest = (coords) => {
    return {
        type: 'REQUESTED_QUERY',
        lat: coords[0],
        lng: coords[1]
    }
}

/**
 * Location query request was successfull
 * 
 * @param  {} query - The response data
 */
export const queryRequestSuccess = (query) => {
    return {
        type: 'REQUESTED_QUERY_SUCCESS',
        query
    }
}

/**
 * Send a report request for a specific location to the backend
 * 
 * @param  {} link - Link for the geoserver containing the needed params
 * @param  {} layers - layers of the active pilot area
 * @param  {} coords - coordinates of the request
 */
export function reportQuery(link, layers, coords) {
    layers = layers.filter(layer => layer.report === true)
    return (dispatch) => {
        dispatch(dataRequest('reportquery', true));
        let url = config.apiBaseUrl+'api/geoserver/report'
        fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({link, layers})
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(geocodeError());
                }

                dispatch(dataRequest('reportquery', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(reportQuerySuccess(data, coords))
            })
    };
}

/**
 * Report query was successfull, send report data to the reducer
 * 
 * @param  {} values - The report data
 * @param  {} coords - The coordinates of the report
 */
export const reportQuerySuccess = (values, coords) => {
    return {
        type: 'REPORT_QUERY_SUCCESS',
        values,
        coords
    }
}

/**
 * Request to read the metadata excel sheet (a step to copy data to the web gis)
 * 
 * @param  {} area - The active pilot area
 * @param  {} token - The JWT token
 * @param  {} layers - The layers that are currently online in the given pilot area
 */
export function readExcelFile(area, token, layers) {
    return (dispatch) => {
        dispatch(dataRequest('metadataquery', true));
        let url = config.apiBaseUrl+'api/geoserver/readmetadata?token='+token
        fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({area})
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(geocodeError());
                }

                dispatch(dataRequest('metadataquery', false));
                
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                
                if(data.message.errors.length === 0) {
                  const compared = compareData(data.message.layers, layers.layers);
                  data.message.compared = compared;
                  
                  dispatch(dataRequestSuccess(data))
                } else {
                  dispatch(dataRequestError(data))
                }

            })
    };
}

/**
 * Request to add layers to the web GIS for a given pilot area
 * 
 * @param  {} area - The given pilot area
 * @param  {} token - The JWT token
 * @param  {} layers - The layers that should be added
 */
export function addLayers(area, token, layers) {

    return (dispatch) => {
        dispatch(dataRequest('copylayer', true));
        let url = config.apiBaseUrl+'api/geoserver/copylayer?token='+token
        fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({area, layers})
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError({data : 'copylayer', status: false}));
                }

                dispatch(dataRequest('copylayer', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {

                dispatch(dataRequestSuccess(data))
            //    dispatch(getLayers(area))
            })
    };
}

/**
 * Request to upload the pilot area outline to the web GIS
 * @param  {} token - JWT token
 */
export function uploadAreas(token) {

    return (dispatch) => {
        dispatch(dataRequest('uploadareas', true));
        let url = config.apiBaseUrl+'api/geoserver/uploadareas?token='+token
        fetch(url,
        {
            method: 'POST',
            mode: 'cors'
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError({data : 'uploadareas', status: false}));
                }

                dispatch(dataRequest('uploadareas', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {

                dispatch(dataRequestSuccess(data))
            //    dispatch(getLayers(area))
            })
    };
}

/**
 * Request to create a PDF file based on the active report
 * 
 * @param  {} headline - Report title
 * @param  {} html - The report "html" from which the PDF is generated
 * @param  {} image - The map image (base64)
 * @param  {} notes - Explanatory notes 
 * @param  {} exNotesHeadline - Headline for explanatory notes
 */
export function generatePDF(headline, html, image, notes, exNotesHeadline) {

    return (dispatch) => {
        //dispatch(dataRequest('pdf', true));
        let url = config.apiBaseUrl+'api/standardreport/pdf'
        fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({headline, html, image, notes, exNotesHeadline})
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError({data : 'pdf', status: false}));
                }
                return response;
            })
            .then((response) => response.blob())
            .then((blob) => {
              saveAs(blob, 'Report.pdf')
                const data = {
                    data: 'pdf',
                    status: true,
                    message: 'success'
                }
                dispatch(dataRequestSuccess(data))
            })
    };
}

/**
 * Request to create a virtual borehole
 * 
 * @param  {} pilotarea - Active pilot area
 * @param  {} coordinates - Coordinates of the virtual borehole
 * @param  {} srs - Active SRS
 */
export function virtualBorehole(pilotarea, coordinates, srs) {
    return (dispatch) => {
        dispatch(dataRequest('borehole', true));
        let url = config.apiBaseUrl+'api/gst'
        fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({pilotarea, coordinates, srs})
        })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError());
                }

                dispatch(dataRequest('borehole', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(virtualBoreholeSuccess(data))
            })
    };
}

/**
 * The virtual borehole request was successfull
 * 
 * @param  {} data - The borehole image
 */
export const virtualBoreholeSuccess = (data) => {
    return {
        type: 'VIRTUAL_BOREHOLE_SUCCESS',
        data
    }
}
