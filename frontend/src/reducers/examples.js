const initialState = []

/**
 * Redcuer for the case studies
 * @param  {} state=initialState
 * @param  {} action
 */
export const examples = (state = initialState, action) => {
  switch(action.type) {

      case 'LOAD_EXAMPLES_SUCCESS':
          return action.examples;

    default:
      return state;
  }
}
