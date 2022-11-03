import {
    ALLOW_COOKIES,
    DELETE_COOKIE,
    SET_COOKIE,
} from "./types";
import Cookies from "universal-cookie";
const cookies = new Cookies();

/**
 * Change value of a cookie
 * @param  {} name - Name of the cookie that should be set
 * @param  {} value - value that should be stored in the cookie
 */
export function setCookie(name, value) {
    return {
        type: SET_COOKIE,
        name,
        value
    }
}

// Synchronizes the state with any cookie set in the browser
export function getCookie(name) {
    // check if the cookie is set in the browser
    const value = cookies.get(name);
    if (value === undefined) {
        return {
            type: ''
        };
    }
    
    // update the state accordingly
    return {
        type: SET_COOKIE,
        name,
        value,
    }
}

/**
 * Delete a cookie
 * @param  {} name - Name of the cookie that should be deleted
 */
export function deleteCookie(name) {
    return {
        type: DELETE_COOKIE,
        name: name
    }
}

export function allowAllCookies() {
    return {
        type: ALLOW_COOKIES,
        consent: 'all'
    }
}
export function allowEssentialCookie() {
    return {
        type: ALLOW_COOKIES,
        consent: 'essential'
    }
}
export function allowNoCookies() {
    return {
        type: ALLOW_COOKIES,
        consent: 'none'
    }
}
