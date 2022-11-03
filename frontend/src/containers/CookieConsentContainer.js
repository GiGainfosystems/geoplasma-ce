import { connect } from 'react-redux'
import CookieConsent from '../components/cookieconsent/CookieConsent'
import { setCookie, getCookie } from '../actions'

const mapStateToProps = (state) => {
    return { cookies: state.cookies }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCookie: (name, value) => {
            const action = setCookie(name, value);
            dispatch(action)
        },
        getCookie: (name) => {
            const action = getCookie(name)
            dispatch(action)
        }
    }
}

const CookieConsentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CookieConsent)

export default CookieConsentContainer