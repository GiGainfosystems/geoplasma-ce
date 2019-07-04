import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'
import { LOAD_EVENTS_SUCCESS, ADD_EVENTS_SUCCESS } from './types'

/**
 * The request to the backend to load all events
 */
export function getEvents() {
    return (dispatch) => {
        dispatch(dataRequest('getevents', true));
        fetch(config.apiBaseUrl+'api/events', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getevents', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadEventsSuccess(data))
            })
    };
}

/**
 * The response of the getEvents request thats sent to the reducer
 * 
 * @param  {} data - All events on the knowledge platform
 */
export const loadEventsSuccess = (data) => {
    return {
        type: LOAD_EVENTS_SUCCESS,
        events: data
    }
}

/**
 * The request to save an event on the knowledge platform
 * 
 * @param  {} id - If an event is edited, the ID of the according event
 * @param  {} name - The name of the event
 * @param  {} organized_by - Organizer of the event
 * @param  {} contact - Contact person for the event
 * @param  {} contact_email - Contact person email
 * @param  {} date1 - Start date 
 * @param  {} date2 - End date
 * @param  {} location - Location
 * @param  {} country - Country
 * @param  {} website - Website of the event
 * @param  {} token - JWT token
 */
export function addEvent(id, name, organized_by, contact, contact_email, date1, date2, location, country, website, token) {

    return (dispatch) => {
        dispatch(formRequest('addevent', true));
        fetch(config.apiBaseUrl+'api/events?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, name, organized_by, contact, contact_email, date1, date2, location, country, website})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('addevent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((events) => {
                dispatch(formRequestSuccess({ form: 'addevent', status: true}));
                dispatch(addEventsSuccess(events))
            })
    };
}

/**
 * Request to the backend to remove an event
 * 
 * @param  {} id - ID of the event that should be removed
 * @param  {} token - JWT token
 */
export function removeEvent(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removeevent', true));
        fetch(config.apiBaseUrl+'api/events/delete?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('removeevent', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((content) => {
                dispatch(formRequestSuccess({ form: 'removeevent', status: true}));
                dispatch(loadEventsSuccess(content))
            })
    };
}

/**
 * The events that are loaded after an successfull addEvent request and sent to the reducer
 * 
 * @param  {} events - The events on the knowledge platform
 */
export const addEventsSuccess = (events) => {
    return {
        type: ADD_EVENTS_SUCCESS,
        events
    }
}
