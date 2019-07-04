const initialState = []

/**
 * Reducer for the units that are displayed in the virtual boreholes (needed for their legend)
 * @param  {} state=initialState
 * @param  {} action
 */
export const units = (state = initialState, action) => {
  switch(action.type) {

      case 'LOAD_UNITS_SUCCESS':
          return action.units;
      case 'SAVE_UNIT_SUCCESS':
          return action.units;
    default:
      return state;
  }
}
