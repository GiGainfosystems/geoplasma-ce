const initialState = []

/**
 * Reducer for the international links section
 * @param  {} state=initialState
 * @param  {} action
 */
export const links = (state = initialState, action) => {
  switch(action.type) {
      case 'LOAD_LINKS_SUCCESS':
          return action.links;
    default:
      return state;
  }
}
