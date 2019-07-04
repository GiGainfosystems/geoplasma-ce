
const initialState = {
    lat: undefined,
    lng: undefined,
    value: undefined,
    isFetching: false
}
/**
 * Location query reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const query = (state = initialState, action) => {
    switch (action.type) {

        case 'REQUESTED_QUERY':
            return {
                lat: action.lat,
                lng: action.lng,
                value: undefined,
                isFetching: true
            }
        case 'REQUESTED_QUERY_SUCCESS':
            return {
                lat: action.query.lat,
                lng: action.query.lng,
                value: action.query.value,
                isFetching: false
            }

        default:
        return state;
    }
}
