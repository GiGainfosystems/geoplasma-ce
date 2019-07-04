const initialState = {
    filter: [],
    profiles: []
};
/**
 * Userprofiles reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const userprofiles = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_USERPROFILES_SUCCESS':
            return {
                filter: [
                    { occupation: [] }
                ],
                profiles: action.user
            }

        case 'UPDATE_USERPROFILE_SUCCESS':
        return {
            filter: [
                { occupation: [] }
            ],
            profiles: action.users
        }

        default:
        return state;
    }
}
