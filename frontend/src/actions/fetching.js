import {
    FORM_REQUEST_SENT,
    FORM_REQUEST_SUCCESS,
    FORM_REQUEST_FINISHED,
    FORM_REQUEST_ERROR,
    DATA_REQUEST_SENT,
    DATA_REQUEST_SUCCESS,
    DATA_REQUEST_ERROR
} from './types'

/**
 * A form request 
 * 
 * @param  {} form - which form sent the request
 * @param  {} status - status of the request (true/false)
 * @param  {} message - The response message of the request
 */
export const formRequest = (form, status, message) => {
    return {
        type: FORM_REQUEST_SENT,
        form,
        status,
        message
    }
}

/**
 * A finished form request is dispatched to the fetching reducer
 */
export const formRequestFinished = () => {
    return {
        type: FORM_REQUEST_FINISHED,
    }
}

/**
 * A failed form request is send to the reducer
 * 
 * @param  {} error - Error message
 */
export const formRequestError = (error) => {
    return {
        type: FORM_REQUEST_ERROR,
        form: error.form,
        status: error.status,
        message: error.message
    }
}

/**
 * A form request was successfull
 * 
 * @param  {} form - The response object
 */
export const formRequestSuccess = (form) => {
    return {
        type: FORM_REQUEST_SUCCESS,
        form: form.form,
        status: form.status,
        message: form.message
    }
}

/**
 * A data request
 * 
 * @param  {} data - which data was requested
 * @param  {} status - status of the request
 * @param  {} message - message of the requesta
 */
export const dataRequest = (data, status, message) => {
    return {
        type: DATA_REQUEST_SENT,
        data,
        status,
        message
    }
}
/**
 * A data request was successfull and the data is dispatched to the reducer
 * 
 * @param  {} data - The response data
 */
export const dataRequestSuccess = (data) => {
    return {
        type: DATA_REQUEST_SUCCESS,
        data: data.data,
        status: data.status,
        message: data.message
    }
}

/**
 * A data request returned an error
 * 
 * @param  {} data - The response / error data
 */
export const dataRequestError = (data) => {
    return {
        type: DATA_REQUEST_ERROR,
        data: data.data,
        status: data.status,
        message: data.message
    }
}
