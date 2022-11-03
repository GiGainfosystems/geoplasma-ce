import {
    ALLOW_COOKIES,
    DELETE_COOKIE,
    SET_COOKIE,
} from "../actions/types";

const initialState = {
    consent: null, // null | all | essential | none
    values: {},
    version: 0
}

/**
 * Reducer for the cookie values
 * @param  {} state=initialState
 * @param  {} action
 */
export const cookiesReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_COOKIE: {
            const consent = action.name === 'consent' ? action.value : state.consent;
            return {
                consent,
                values: {
                    ...state.values,
                    [action.name]: action.value
                },
                version: state.version + 1
            }
        }
        case DELETE_COOKIE: {
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.name]: null
                },
                version: state.version + 1
            }
        }
        case ALLOW_COOKIES: {
            return {
                ...state,
                consent: action.consent,
            }
        }
        default:
            return state;
    }
}
