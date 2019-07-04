import { GEOCODE_SUCCESS, GEOCODE_ERROR } from './types'
import { dataRequest, formRequestFinished } from './fetching'

/**
 * Request to nominatim to geocode a given address and get the coordinates
 * 
 * @param  {} street - Street of the address
 * @param  {} zip - ZIP code of the address
 * @param  {} city - City of the address
 */
export function geocodeAddress(street, zip, city) {
    return (dispatch) => {
        dispatch(dataRequest('geocode', true));
        let url;
        if((zip) && (city)) {
            url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&street='+street+'&postalcode='+zip+'&city='+city
        } else {
            url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+street;
        }
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    dispatch(geocodeError());
                }
                dispatch(dataRequest('geocode', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                if(data[0]) {
                    let coordinates = [];
                    coordinates.push(parseFloat(data[0].lat));
                    coordinates.push(parseFloat(data[0].lon));
                    dispatch(geocodeSuccess(coordinates))
                }
            })
    };
}

/**
 * Geocoding was successfull, send data to the reducer
 * 
 * @param  {} data - The coordinates
 */
export const geocodeSuccess = (data) => {
    return {
        type: GEOCODE_SUCCESS,
        data
    }
}

/**
 * An error occured during the geocoding proccess
 */
export const geocodeError = () => {
    return {
        type: GEOCODE_ERROR
    }
}

/**
 * Reverse geocoding (click on map -> coordiantes -> get the address based on the coordinates)
 * @param  {} coords - The requested coordinates
 */
export function reverseGeocode(coords) {
    return (dispatch) => {
        dispatch(dataRequest('geocode', true));
        let url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+coords[0]+'&lon='+coords[1]+'&zoom=18&addressdetails=1'
       
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    dispatch(reverseGeocodeFail());
                }
                dispatch(dataRequest('geocode', false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                if(data) {
                    let address = '-';
                    if(data.address.postcode && (data.address.city || data.address.town)) {
                        address = (data.address.road ? data.address.road+', ' : '') + (data.address.house_number ? data.address.house_number+', ' : '' ) + data.address.postcode + " " + (data.address.city ? data.address.city : data.address.town)
                    }
                    dispatch(reverseGeocodeSuccess(address))
                }
            })
    };
}

/**
 * Reverse geocoding was successfull
 * 
 * @param  {} address - The address
 */
export const reverseGeocodeSuccess = (address) => {
    return {
        type: 'REVERSE_GEOCODE_SUCCESS',
        address
    }
}

/**
 * An error occured during the reverse geocoding
 */
export const reverseGeocodeFail = () => {
    return {
        type: 'REVERSE_GEOCODE_ERROR'
    }
}
