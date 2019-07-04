
const initialState = {
  entries: [],
  basic: true
}

/**
 * Glossary reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const glossary = (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_GLOSSARY_SUCCESS':
            return {
              entries: action.entries,
              basic: state.basic
            }

        case 'TOGGLE_GLOSSARY_FILTER':
            return {
              entries: state.entries,
              basic: !state.basic
            }

        default:
        return state;
    }
}
