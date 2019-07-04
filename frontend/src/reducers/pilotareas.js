
const initialState = []

/**
 * Reducer for the pilot areas
 * @param  {} state=initialState
 * @param  {} action
 */
export const pilotareas = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_PILOTAREAS_SUCCESS':
            action.areas.map(area => {
                area.neCorner = area.ne_corner.split(",");
                area.swCorner = area.sw_corner.split(",");
            })
            return action.areas;

        default:
        return state;
    }
}
