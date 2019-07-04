import config from '../config';
import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'
import { LOAD_GLOSSARY_SUCCESS } from './types'

/**
 * Get all the glossary entries
 */
export function getGlossary() {
    return (dispatch) => {
        dispatch(dataRequest('getglossary', true));
        fetch(config.apiBaseUrl+'api/glossary', {
                mode: 'cors'
            })
            .then((response) => {
                if (!response.ok) {
                    dispatch(dataRequestError('getglossary', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(loadGlossarySuccess(data))
            })
    };
}

/**
 * The glossary data was loaded successfully and is sent to the reducer
 * @param  {} data - The glossary data
 */
export const loadGlossarySuccess = (data) => {
    return {
        type: LOAD_GLOSSARY_SUCCESS,
        entries: data
    }
}

/**
 * Save a glossary entry
 * 
 * @param  {} id - If given, edit the entry with the given ID
 * @param  {} keyword - Keyword that should be explained
 * @param  {} keyword_de
 * @param  {} keyword_pl
 * @param  {} keyword_cz
 * @param  {} keyword_sk
 * @param  {} keyword_sl
 * @param  {} synonyms - Synonyms of the keyword
 * @param  {} synonyms_de
 * @param  {} synonyms_pl
 * @param  {} synonyms_cz
 * @param  {} synonyms_sk
 * @param  {} synonyms_sl
 * @param  {} link - Link for more explanation
 * @param  {} definition - Definition of the keyword
 * @param  {} definition_de
 * @param  {} definition_cz
 * @param  {} definition_pl
 * @param  {} definition_sl
 * @param  {} definition_sk
 * @param  {} basic - Should be displayed in basic glossary
 * @param  {} token - JWT token
 */
export function addGlossary(id, keyword, keyword_de, keyword_pl, keyword_cz, keyword_sk, keyword_sl, synonyms, synonyms_de, synonyms_pl, synonyms_cz, synonyms_sk, synonyms_sl, link, definition, definition_de, definition_cz, definition_pl, definition_sl, definition_sk, basic, token) {

    return (dispatch) => {
        dispatch(formRequest('addglossary', true));
        fetch(config.apiBaseUrl+'api/superuser/glossary?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, keyword, keyword_de, keyword_pl, keyword_cz, keyword_sk, keyword_sl, synonyms, synonyms_de, synonyms_pl, synonyms_cz, synonyms_sk, synonyms_sl, link, definition,  definition_de, definition_cz, definition_pl, definition_sl, definition_sk, basic})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('addglossary', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((entries) => {
                dispatch(formRequestSuccess({ form: 'addglossary', status: true}));
                dispatch(loadGlossarySuccess(entries))
            })
    };
}

/**
 * Remove an entry from the glossary
 * 
 * @param  {} id - ID of the entry that should be deleted
 * @param  {} token - JWT token
 */
export function removeGlossary(id, token) {

    return (dispatch) => {
        dispatch(formRequest('removeglossary', true));
        fetch(config.apiBaseUrl+'api/superuser/glossary/delete?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('removeglossary', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((entries) => {
                dispatch(formRequestSuccess({ form: 'removeglossary', status: true}));
                dispatch(loadGlossarySuccess(entries))
            })
    };
}
