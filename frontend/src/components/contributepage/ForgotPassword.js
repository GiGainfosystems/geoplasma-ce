import React, { Component } from 'react'
import Header from '../header/Header';
import Subheader from '../subheader/Subheader';
import { Link } from 'react-router-dom';
import getTranslation from '../../i18n/'
import EmailValidator from 'email-validator'
import Footer from '../footer/Footer'

/**
 * Forgot password form
 */
class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailForm: true,
            passwordForm: false,
            email: '',
            errorMessages: [],
            errors: {
            email: false
            }
        }
    }

    /** 
     * Update the fields, function gets called if any of the form fields gets changed
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name] : value })

        let errors = this.state.errors;

        // If the field is empty set the error state for this field to true
        if(event.target.value === '') {
            errors[name] = true;
        } else {
            errors[name] = false;
        }

        // If the email field does not contain a valid email set the error state for this field to true
        if(name === 'email') {
            if(!EmailValidator.validate(event.target.value)) {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }
    }

    /**
     * The actual request for the password forgotten function
     * Validates the given email and if no error exists dispatches the forgotPassword action
     * @param  {} event
     */
    forgotPasswordRequest(event) {
        event.preventDefault()
        let errorMessages = [];

        // Check if valid email is given
        if(!EmailValidator.validate(this.state.email)) {
            errorMessages.push('forms.general.error.message.valid_email');
        }

        // If no validation error => dispatch forgotPassword action
        if(errorMessages.length === 0) {
            this.props.forgotPassword(this.state.email);
        }
        this.setState({errorMessages: errorMessages});
    }

    render() {

        // By default no fetching is happening
        let errorMessages = this.state.errorMessages;

        // Fetch error message from response, if error does not exist in state yet push it in the errorMessages array
        if((this.props.fetching.formRequest.form === 'forgotpassword') && (!this.props.fetching.formRequest.isFetching) && (!this.props.fetching.formRequest.status)) {
            let index_of = errorMessages.indexOf(this.props.fetching.formRequest.message);
            if(index_of === -1) {
                errorMessages.push(this.props.fetching.formRequest.message)
            }
        }

        return(
            <div>
                <Header />
                <div className="container container-small">
                    <Subheader title={"subheader.reset_password"} />
                </div>
                <div className="container container-very-small">
                    <div className="default-element default-element-dark">
                        <h3>{getTranslation("forgotpassword.title")}</h3>
                        <div className="default-element-content">
                            {((this.props.fetching.formRequest.form === 'forgotpassword') && (this.props.fetching.formRequest.isFetching)) &&
                                <div>
                                    <div className="loader"></div>
                                </div>
                            }
                            {((this.props.fetching.formRequest.form !== 'forgotpassword') && (!this.props.fetching.formRequest.isFetching) && (!this.props.fetching.formRequest.status)) &&
                                <div>
                                    <p>{getTranslation("forgotpassword.teaser")}</p>
                                    {errorMessages.length > 0 &&
                                        <div className="error-messages">
                                            {errorMessages.map((error, index) =>
                                                <p key={index}>{getTranslation(error)}</p>
                                            )}
                                        </div>
                                    }
                                    <form onSubmit={(e) => this.forgotPasswordRequest(e)}>
                                      <label className="centered">{getTranslation('forms.general.email.label')}:{this.state.errors.email && <span className="validation-error">{getTranslation('forms.general.error.hints.valid_email')}</span>}</label>
                                      <input name="email" className={(this.state.errors.email ? 'v-error' : 'v-check')} type="email" placeholder={getTranslation('forms.general.email.placeholder')} value={this.state.email} onChange={(e) => this.updateField(e)} />
                                      <button type="submit" className="btn-icon btn-green btn-signin">{getTranslation("forgotpassword.button.submit")}</button> <span className="green-link"><Link to="/experts/contribute">{getTranslation("forgotpassword.back_to_signin")}</Link></span>
                                    </form>
                                </div>
                            }
                            {((this.props.fetching.formRequest.form === 'forgotpassword') && (!this.props.fetching.formRequest.isFetching)) &&
                                <div>
                                    <div className="big-icon-container">
                                            <i className={"fa "+(!this.props.fetching.formRequest.status ? "fa-times" : "fa-check")+" big-icon"} aria-hidden="true"></i>
                                    </div>
                                    <p>{getTranslation(this.props.fetching.formRequest.message)}</p>
                                    <Link to="/experts"><button className="btn btn-green centered">{getTranslation("forgotpassword.back_to_homepage")}</button></Link>
                                </div>
                            }


                        </div>
                    </div>
                </div>
                <div className="container container-small">
                <Footer pages={this.props.pages} />
                </div>
            </div>
        )
    }
}
export default ForgotPassword;
