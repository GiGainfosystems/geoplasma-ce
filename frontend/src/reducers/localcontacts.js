
const initialState = []

/**
 * Contacts reducer (local contacts on the landing pages)
 * @param  {} state=initialState
 * @param  {} action
 */
export const localcontacts = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_LOCAL_CONTACTS_SUCCESS':
            return action.contacts;

        default:
        return state;
    }
}
