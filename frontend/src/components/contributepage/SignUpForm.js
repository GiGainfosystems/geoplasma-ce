import React, { Component } from 'react'
import EmailValidator from 'email-validator'
import getTranslation from '../../i18n/'

/**
 * Signup form
 */
class SignUpForm extends Component {

    constructor(props) {
        super(props);
        // Set initial state
        // All fields get their own state, the error messages get an own state
        // and each field has an "error" state that shows if there is a validation error for this field
        this.state = {
            errors: {
                username: false,
                email: false,
                password: false,
                confirmPassword: false
            },
            errorMessages: [],
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
            termsVisible: false
        };
    }
    
    /**
     * The actual signup function, gets called when submitting the signup form
     * Validation of the form and if no validation error exists the signUp action gets called
     * @param  {} event
     */
    signUp(event) {
        event.preventDefault();
        let errorMessages = [];
        // Check if any of the fields is empty, if so display error message that all fields
        // need to be filled
        if((this.state.username === '') || (this.state.email === '') ||(this.state.password === '') ||(this.state.confirmPassword === '')) {
            errorMessages.push('forms.general.error.message.fields_required');
        }

        // Check if the terms checkbox is checked
        if(!this.state.terms) {
            errorMessages.push('forms.general.error.message.terms');
        }

        // Checks if a valid email was entered (Format: xx@yy.zz)
        if(!EmailValidator.validate(this.state.email)) {
            errorMessages.push('forms.general.error.message.valid_email');
        }

        // Checks if the password and the confirmPassword field have the same value
        if(this.state.password !== this.state.confirmPassword) {
            errorMessages.push('forms.signup.error.message.passwords_match');
        }

        if(this.state.password.length < 6) {
            errorMessages.push('forms.signup.error.password_length');
        }

        // If there is no error dispatch the signUp action
        if(errorMessages.length === 0) {
            this.props.signUp(this.state.username, this.state.email, this.state.password);
        }

        // Set new error messages in the state.
        this.setState({errorMessages: errorMessages});
    }

    /**
     * Update the fields, function gets called if any of the form fields gets changed
     * Does validation depending on the field that was changed and displays validation errors
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        // If the field is empty set the error state for this field to true
        let errors = this.state.errors;
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

        // If the passwords in the password and the confirmPassword field dont match set the error state for this field to true
        if(name === 'confirmPassword') {
            if(this.state.password !== event.target.value) {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }

        // If the passwords in the password and the confirmPassword field dont match set the error state for this field to true
        if(name === 'password') {

            if(this.state.confirmPassword !== '') {
                if(this.state.confirmPassword != event.target.value) {
                    errors.confirmPassword = true;
                } else {
                    errors.confirmPassword = false;
                }

            }
        }

        // Actually set the error states and the updated value for the field
        this.setState({ errors : errors, [name] : value });

    }
    
    /**
     * Toggle the visibility of the terms and conditions
     */
    toggleTermsvisible() {
        this.setState({termsVisible: !this.state.termsVisible})
    }

    render() {

        // By default no fetching is happening
        let errorMessages = this.state.errorMessages;

        // Fetch error message from response, if error does not exist in state yet push it in the errorMessages array
        if((this.props.fetching.formRequest.form === 'signup') && (!this.props.fetching.formRequest.isFetching) && (!this.props.fetching.formRequest.status)) {
            let index_of = errorMessages.indexOf(this.props.fetching.formRequest.message);
            if(index_of === -1) {
                errorMessages.push(this.props.fetching.formRequest.message)
            }
        }

        return(
          <div className="half">
            <div className="default-element default-element-dark">
              <h3>{getTranslation('forms.signup.title')}</h3>
              <div className="default-element-content">

                {((this.props.fetching.formRequest.form === 'signup') && (this.props.fetching.formRequest.isFetching)) &&
                    <div className="fetching-overlay">
                      <div className="loader"></div>
                    </div>
                }

                <p>{getTranslation('forms.signup.text')}</p>

                {errorMessages.length > 0 &&
                    <div className="error-messages">
                        {errorMessages.map((error, index) =>
                            <p key={index}>{getTranslation(error)}</p>
                        )}
                    </div>
                }
                <form onSubmit={(e) => this.signUp(e)} method="post">
                  <label className="centered">{getTranslation('forms.signup.username.label')}: {this.state.errors.username && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                  <input className={(this.state.errors.username ? 'v-error' : 'v-check')} name="username" value={this.state.username} type="text" placeholder={getTranslation('forms.signup.username.placeholder')} onChange={(event) => this.updateField(event)} />
                  <label className="centered">{getTranslation('forms.general.email.label')}:{this.state.errors.email && <span className="validation-error">{getTranslation('forms.general.error.hints.valid_email')}</span>}</label>
                  <input className={(this.state.errors.email ? 'v-error' : 'v-check')} name="email" value={this.state.email} type="email" placeholder={getTranslation('forms.general.email.placeholder')} onChange={(event) => this.updateField(event)} />
                  <label className="centered">{getTranslation('forms.general.password.label')}:{this.state.errors.password && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                  <input className={(this.state.errors.password ? 'v-error' : 'v-check')} name="password" value={this.state.password} type="password" placeholder={getTranslation('forms.general.password.placeholder')} onChange={(event) => this.updateField(event)} />
                  <label className="centered">{getTranslation('forms.signup.password_repeat.label')}:{this.state.errors.confirmPassword && <span className="validation-error">{getTranslation('forms.signup.error.hint.passwords_match')}</span>}</label>
                  <input className={(this.state.errors.confirmPassword ? 'v-error' : 'v-check')} name="confirmPassword" value={this.state.confirmPassword} type="password" placeholder={getTranslation('forms.signup.password_repeat.placeholder')} onChange={(event) => this.updateField(event)} />

                  <button type="button" className="btn btn-blue" onClick={() => this.toggleTermsvisible()}>{getTranslation('forms.signup.termsbutton')}</button><br /><br />
                  {this.state.termsVisible &&
                      <div className="termstext-box">
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.introduction")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.firstpoint")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.secondpoint")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.thirdpoint")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.fourthpoint")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.fifthpoint")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.terminaton.title")}}></p>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("terms.general.terminaton.text")}}></p>
                      </div>
                  }
                  <input id="activated" name="terms" type="checkbox" checked={this.state.activated} onChange={(event) => this.updateField(event)} />
                  <label htmlFor="activated" className="checkbox-label">{getTranslation('forms.signup.terms')}</label>


                  <button type="submit" className="btn-icon btn-green btn-signup">{getTranslation('forms.signup.button.signup')}</button>
                </form>
              </div>
            </div>
          </div>
        )
    }
}

export default SignUpForm
