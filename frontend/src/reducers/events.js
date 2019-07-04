const initialState = []

/**
 * Events reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const events = (state = initialState, action) => {
  switch(action.type) {

      case 'LOAD_EVENTS_SUCCESS':
          return action.events;


          case 'ADD_EVENTS_SUCCESS':
              return action.events;

    default:
      return state;
  }
}
