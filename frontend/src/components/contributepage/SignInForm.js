import React, { Component } from 'react'
import EmailValidator from 'email-validator'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'

/**
 * The form to signin a user
 */
class SignInForm extends Component {

  constructor(props) {
    super(props);
    // Set initial state
    // All fields get their own state, the error messages get an own state
    // and each field has an "error" state that shows if there is a validation error for this field
    this.state = {
        errors: {
            email: false,
            password: false
        },
        errorMessages: [],
        email: '',
        password: ''
    };
  }

  /**
   * Update the fields, function gets called if any of the form fields gets changed
   * Does validation depending on the field that was changed and displays validation errors
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
     * The actual signin function, gets called when submitting the signin form
     * Validation of the form and if no validation error exists the signIn action gets dispatched
     * @param  {} e
     */
    signIn(e) {
      e.preventDefault()
      let errorMessages = [];

      // Check if any of the fields is empty, if so display error message that all fields
      // need to be filled
      if((this.state.email === '') ||(this.state.password === '')) {
          errorMessages.push('forms.general.error.message.fields_required');
      }

      // Checks if a valid email was entered (Format: xx@yy.zz)
      if(!EmailValidator.validate(this.state.email)) {
          errorMessages.push('forms.general.error.message.valid_email');
      }

      // If there is no error dispatch the signUp action
      if(errorMessages.length === 0) {
          this.props.signIn(this.state.email, this.state.password);
      }

      // Set new error messages in the state.
      this.setState({errorMessages: errorMessages});
    }

  render() {

      // By default no fetching is happening
      let errorMessages = this.state.errorMessages;

      // Fetch error message from response, if error does not exist in state yet push it in the errorMessages array
      if((this.props.fetching.formRequest.form === 'signin') && (!this.props.fetching.formRequest.isFetching) && (!this.props.fetching.formRequest.status)) {
          let index_of = errorMessages.indexOf(this.props.fetching.formRequest.message);
          if(index_of === -1) {
              errorMessages.push(this.props.fetching.formRequest.message)
          }
      }

    return(
      <div className="half">
        <div className="default-element default-element-dark">
          <h3>{getTranslation("forms.signin.title")}</h3>
          <div className="default-element-content">
          {((this.props.fetching.formRequest.form === 'signin') && (this.props.fetching.formRequest.isFetching)) &&
              <div className="fetching-overlay">
                <div className="loader"></div>
              </div>
          }

            <p>{getTranslation("forms.signin.text")}</p>
            {errorMessages.length > 0 &&
                <div className="error-messages">
                    {errorMessages.map((error, index) =>
                        <p key={index}>{getTranslation(error)}</p>
                    )}
                </div>
            }
            <form onSubmit={(e) => this.signIn(e)}>
              <label className="centered">{getTranslation('forms.general.email.label')}:{this.state.errors.email && <span className="validation-error">{getTranslation('forms.general.error.hints.valid_email')}</span>}</label>
              <input name="email" className={(this.state.errors.email ? 'v-error' : 'v-check')} type="email" placeholder={getTranslation('forms.general.email.placeholder')} value={this.state.email} onChange={(e) => this.updateField(e)} />

              <label className="centered">{getTranslation('forms.general.password.label')}:{this.state.errors.password && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
              <input name="password" className={(this.state.errors.password ? 'v-error' : 'v-check')} type="password" placeholder={getTranslation('forms.general.password.placeholder')} value={this.state.password} onChange={(e) => this.updateField(e)} />
              <button type="submit" className="btn-icon btn-green btn-signin">{getTranslation('forms.signin.button.signin')}</button> <span className="green-link"><Link to="/experts/forgot-password">{getTranslation('forms.signin.forgot_password')}</Link></span>
            </form>

          </div>
        </div>
      </div>
    )
  }

}

export default SignInForm
