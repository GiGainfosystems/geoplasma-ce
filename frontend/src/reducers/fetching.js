import {
    FORM_REQUEST_SENT,
    FORM_REQUEST_SUCCESS,
    FORM_REQUEST_FINISHED,
    FORM_REQUEST_ERROR,
    DATA_REQUEST_SENT,
    DATA_REQUEST_SUCCESS,
    DATA_REQUEST_ERROR,
} from '../actions/types'

const initialState = {
    dataFetching: {},
    formRequest: {},
}

/**
 * Reducer for requests to the backend (data fetching, form submitting)
 * @param  {} state=initialState
 * @param  {} action
 */
export const fetching = (state = initialState, action) => {
    switch (action.type) {

        case DATA_REQUEST_SENT:
            return {
                dataFetching: {
                    data: action.data,
                    isFetching: true,
                    status: action.status,
                    message: action.message
                },
                formRequest: {}
            }

        case DATA_REQUEST_SUCCESS:
            return {
                dataFetching: {
                    data: action.data,
                    isFetching: false,
                    status: action.status,
                    message: action.message
                },
                formRequest: {}
            }
        case DATA_REQUEST_ERROR:
            return {
                dataFetching: {
                    data: action.data,
                    isFetching: false,
                    status: action.status,
                    message: action.message
                },
                formRequest: {}
            }

        case FORM_REQUEST_ERROR:
            return {
                dataFetching: {},
                formRequest: {
                    form: action.form,
                    isFetching: false,
                    status: action.status,
                    message: action.message
                }
            }
        case FORM_REQUEST_SENT:
            return {
                dataFetching: {},
                formRequest: {
                    form: action.form,
                    isFetching: true
                }
            }

        case FORM_REQUEST_SUCCESS:
            return {
                dataFetching: {},
                formRequest: {
                    form: action.form,
                    isFetching: false,
                    status: action.status,
                    message: action.message
                }
            }
        case FORM_REQUEST_FINISHED:
            return {
                dataFetching: {},
                formRequest: {}
            }

            case 'GEOCODE_SUCCESS':
                return {
                    dataFetching: {
                        data: 'geocode',
                        isFetching: false,
                        message: '',
                        status: true,
                        coordinates: action.data
                    },
                    formRequest: {}
                }
                case 'GEOCODE_ERROR':
                    return {
                        dataFetching: {
                            data: 'geocode',
                            isFetching: false,
                            message: 'geocode.error',
                        },
                        formRequest: {}
                    }
        default:
            return state;
    }

}
