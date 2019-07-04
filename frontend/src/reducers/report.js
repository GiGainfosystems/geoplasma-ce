
const initialState = {
    conflicts: [],
    non_conflict : [],
    traffic_light_maps: [],
    hasLoaded: false,
    coordinates: [],
    boreholes: {},
    validLocation: false,
    address: '',
    borehole: '',
}
/**
 * Report reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const report = (state = initialState, action) => {
    switch (action.type) {

        case 'REPORT_QUERY_SUCCESS':
            let layers = [];
            layers.conflicts = action.values.conflicts;
            layers.traffic_light_maps = action.values.traffic_light_maps;
            layers.non_conflict = action.values.non_conflict;


            layers.hasLoaded = true;
            layers.coords = action.coords,
            layers.validLocation = true
            layers.address = state.address
            layers.borehole = ''
            return layers;

        case 'PREPARE_REPORT':
            return {
                conflicts: [],
                non_conflict : [],
                traffic_light_maps: [],
                hasLoaded: false,
                coordinates: [],
                validLocation: false,
                address: state.address,
                borehole: ''
            }     
            
        case 'REVERSE_GEOCODE_SUCCESS':
            return {
                conflicts: state.conflicts,
                non_conflict: state.non_conflict,
                traffic_light_maps: state.traffic_light_maps,
                hasLoaded: state.hasLoaded,
                coordinates: state.coordinates,
                validLocation: state.validLocation,
                address: action.address,
                borehole: state.borehole
            }

        case 'VIRTUAL_BOREHOLE_SUCCESS':
            return {
                conflicts: state.conflicts,
                non_conflict: state.non_conflict,
                traffic_light_maps: state.traffic_light_maps,
                hasLoaded: state.hasLoaded,
                coordinates: state.coordinates,
                validLocation: state.validLocation,
                address: state.address,
                borehole: action.data.message
            }

        default:
        return state;
    }
}
