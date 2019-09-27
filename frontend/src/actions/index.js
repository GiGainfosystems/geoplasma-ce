import { CHANGE_LANGUAGE } from './types'
import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestError, formRequestSuccess} from './fetching'
import { loadContentSuccess } from './content'
import { loadEventsSuccess } from './events'
import { loadGlossarySuccess } from './glossary'
import { loadPagesSuccess } from './pages'
import { loadPilotareasSuccess } from './pilotareas'
import { loadProfessionalgroupsSuccess } from './professionalgroups'
import { loadSiteContentSuccess } from './sitecontent'
import { loadTagsSuccess } from './tags'
import { loadNotesSuccess } from './explanatorynotes'
import { loadContactsSuccess, loadLocalContactsSuccess } from './contact'
import { loadUserprofilesSuccess } from './userprofiles'
import { loadUnitsSuccess } from './units';
import { loadLinksSuccess } from './links';
import { loadExamplesSuccess } from './examples';
export * from './auth'
export * from './filter'
export * from './signup'
export * from './accountsettings'
export * from './superuser'
export * from './userprofiles'
export * from './geocode'
export * from './pilotareas'
export * from './professionalgroups'
export * from './tags'
export * from './glossary'
export * from './thematiccoverages'
export * from './content'
export * from './events'
export * from './pages'
export * from './sitecontent'
export * from './contact'
export * from './geoserver'
export * from './explanatorynotes'
export * from './measurements'
export * from './units'
export * from './links'
export * from './examples'

/**
 * Change the language of the web portal
 * 
 * @param  {} language - New language
 */
export const changeLanguage = (language) => {
  return {
    type: CHANGE_LANGUAGE,
    language
  }
}

/**
 * Send a request to the backend to get all needed data for the landingpage / knowledge platform
 */
export function getAllData() {
    return (dispatch) => {
        dispatch(dataRequest('getdata', true));
        fetch(config.apiBaseUrl+'api/data', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getdata', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadContentSuccess(data.content))
                dispatch(loadEventsSuccess(data.events))
                dispatch(loadGlossarySuccess(data.glossary))
                dispatch(loadPagesSuccess(data.pages))
                dispatch(loadPilotareasSuccess(data.pilotareas))
                dispatch(loadProfessionalgroupsSuccess(data.professionalgroups))
                dispatch(loadSiteContentSuccess(data.sitecontent))
                dispatch(loadTagsSuccess(data.tags))
                dispatch(loadUserprofilesSuccess(data.userprofiles))
                dispatch(loadNotesSuccess(data.explanatory_notes))
                dispatch(loadLocalContactsSuccess(data.localcontacts))
                dispatch(loadUnitsSuccess(data.units))
                dispatch(loadLinksSuccess(data.links))
                dispatch(loadExamplesSuccess(data.examples))
            })
    };
}

/**
 * Send a request to the backend to get all needed data for web GIS
 */
export function getAllGISData(pilotarea) {
    return (dispatch) => {
        dispatch(dataRequest('getdata', true));
        fetch(config.apiBaseUrl+'api/gisdata', {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({pilotarea})
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getdata', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadGlossarySuccess(data.glossary))
                dispatch(loadPilotareasSuccess(data.pilotareas))
                dispatch(loadProfessionalgroupsSuccess(data.professionalgroups))
                dispatch(loadTagsSuccess(data.tags))
                dispatch(loadUserprofilesSuccess(data.userprofiles))
                dispatch(loadNotesSuccess(data.explanatory_notes))
                dispatch(loadLocalContactsSuccess(data.localcontacts))
                dispatch(loadUnitsSuccess(data.units))
                dispatch(loadExamplesSuccess(data.examples))
            })
    };
}

/**
 * Request to send a message via the contact form on the yellow pages
 * 
 * @param  {} contactemail - Contact person email
 * @param  {} name - Name 
 * @param  {} email - Email
 * @param  {} topic - Topic
 * @param  {} message - Message
 */
export function sendMessage(contactemail, name, email, topic, message) {
    return (dispatch) => {
        dispatch(formRequest('contactform', true));
        fetch(config.apiBaseUrl+'api/contactform', {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({contactemail, name, email, topic, message})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('contactform', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((entries) => {
                dispatch(formRequestSuccess({ form: 'contactform', status: true}));
            })
    };
}
