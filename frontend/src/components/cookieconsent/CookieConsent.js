import React, { Component } from "react";
import { Link } from "react-router-dom";
import './CookieConsent.css'
import Cookies from "universal-cookie";
import getTranslation from "../../i18n";

const cookiesAPI = new Cookies();

class CookieConsent extends Component {

    /**
     * Cookie consent dialog where users can change which kind of cookies can be used
     * all, essential, none
     */

    constructor(props) {
        super(props);
        this.state = {
            settingsOpen: false,
            accepted: null
        }
    }

    toggleSettings(settingsOpen) {
        this.setState({
            ...this.state,
            settingsOpen
        })
    }

    setAcceptance(accepted) {
        this.setState({
            ...this.state,
            accepted
        })
    }

    /**
     * This works similar to 'useEffect' in modern react code.
     * This effect writes current cookies app state into actual browser cookies if consent was given by the user.
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        const { cookies } = this.props;
        if (!cookies) {
            return;
        }
        if (cookies.consent === 'none' || cookies.consent === null) {
            Object.keys(cookies.values).forEach((name) => {
                cookiesAPI.remove(name, { path: '/'})
            })
            return
        }

        Object.entries(cookies.values).forEach(([name, value]) => {
            if (
                value === undefined ||
                value === null ||
                (name === 'consent' && value === 'none')
            ) {
                cookiesAPI.remove(name, { path: '/'})
            } else {
                cookiesAPI.set(name, value, { path: '/'});
            }
        })
    }

    componentDidMount() {
        // initially load the cookie content into the app state
        this.props.getCookie('consent');
    }

    render() {
        const { setCookie, cookies } = this.props;
        const { settingsOpen, accepted } = this.state;

        if (cookies.consent) {
            return null;
        }
        // Don't show the consent dialog if any choice made before could be loaded

        const radio = (
            <div className={'cookie-settings-fieldset'}>
                <fieldset onChange={(e) => this.setAcceptance(e.target.value)}>
                    <legend>{getTranslation('cookies.radio.legend')}</legend>

                    <label htmlFor="all">
                        <input type="radio" id="all" name="cookies" value="all" checked={accepted === 'all'} />
                        {getTranslation('cookies.radio.all')}
                    </label>

                    <label htmlFor="essential">
                        <input type="radio" id="essential" name="cookies" value="essential" checked={accepted === 'essential'} />
                        {getTranslation('cookies.radio.essential')}
                    </label>

                    <label htmlFor="none">
                        <input type="radio" id="none" name="cookies" value="none" checked={accepted === 'none' || accepted === null} />
                        {getTranslation('cookies.radio.none')}
                    </label>
                    <button className="btn btn-green" type={'submit'} onClick={() => {
                        setCookie('consent', accepted);
                    }}>{getTranslation('cookies.buttons.save')}</button>
                </fieldset>
            </div>
        );

        return (
            <div className='dialog'>
                <div className='dialog-content'>
                    <h3>{getTranslation('cookies.dialog.header')}</h3>
                    <div className='cookie-settings'>
                        <p>{getTranslation('cookies.dialog.description')} <Link to="/content/disclaimer">
                            {getTranslation('cookies.dialog.disclaimer')}
                        </Link>.</p>
                        <span className="cookie-btn-group">
                            <button className="btn btn-green" onClick={() => setCookie('consent', 'all')}>{getTranslation('cookies.buttons.accept')}</button>
                            <button className="btn btn-green" onClick={() => setCookie('consent', 'none')}>{getTranslation('cookies.buttons.decline')}</button>
                            <button className="btn" onClick={() => this.toggleSettings(true)}>{getTranslation('cookies.buttons.settings')}</button>
                        </span>
                        {settingsOpen && radio}
                    </div>
                </div>
            </div>
        )
    }
}

export default CookieConsent;