import { dataRequest, dataRequestError, formRequestFinished, formRequest, formRequestSuccess, formRequestError } from './fetching'
import config from '../config';

/**
 * Send the explanatory notes to the reducer
 * 
 * @param  {} data - All explanatory notes for the web GIS
 */
export const loadNotesSuccess = (data) => {
    return {
        type: 'LOAD_NOTES_SUCCESS',
        entries: data
    }
}

/**
 * Request to save a explanatory note to the web portal
 * 
 * @param  {} id - If a note is edited, the according ID
 * @param  {} key - The key (identifier for the layer)
 * @param  {} explanatory_note - The explanatory note itself
 * @param  {} explanatory_note_de
 * @param  {} explanatory_note_cz
 * @param  {} explanatory_note_pl
 * @param  {} explanatory_note_sk
 * @param  {} explanatory_note_sl
 * @param  {} layer_description - A layer description in more detail
 * @param  {} layer_description_de
 * @param  {} layer_description_cz
 * @param  {} layer_description_pl
 * @param  {} layer_description_sk
 * @param  {} layer_description_sl
 * @param  {} token - JWT token
 */
export function saveNote(id, key, explanatory_note, explanatory_note_de, explanatory_note_cz, explanatory_note_pl, explanatory_note_sk, explanatory_note_sl, layer_description, layer_description_de, layer_description_cz, layer_description_pl, layer_description_sk, layer_description_sl, token) {

    return (dispatch) => {
        dispatch(formRequest('savenote', true));
        fetch(config.apiBaseUrl+'api/superuser/note?token='+token, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({id, key, explanatory_note, explanatory_note_de, explanatory_note_cz, explanatory_note_pl, explanatory_note_sk, explanatory_note_sl, layer_description, layer_description_de, layer_description_cz, layer_description_pl, layer_description_sk, layer_description_sl})
            })
            .then((response) => {

                if (!response.ok) {
                    dispatch(formRequestError('savenote', false));
                }
                dispatch(formRequestFinished());
                return response;
            })
            .then((response) => response.json())
            .then((entries) => {
                dispatch(formRequestSuccess({ form: 'savenote', status: true}));
                dispatch(loadNotesSuccess(entries))
            })
    };
}
