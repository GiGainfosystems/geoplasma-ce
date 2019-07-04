
const initialState = []

/**
 * Contacts reducer (local contacts on the landing pages)
 * @param  {} state=initialState
 * @param  {} action
 */
export const contacts = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_CONTACTS_SUCCESS':
            return action.contacts;

        default:
        return state;
    }
}
