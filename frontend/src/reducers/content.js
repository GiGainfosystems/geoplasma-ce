const initialState = [
]

/**
 * Reducer for the contents of the knowledge platform
 * @param  {} state=initialState
 * @param  {} action
 */
export const content = (state = initialState, action) => {
  switch(action.type) {

    case 'LOAD_CONTENT_SUCCESS':
        return action.content;


    case 'ADD_CONTENT_SUCCESS':
        return action.content;
    default:
      return state;
  }
}
