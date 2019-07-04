import React, { Component } from 'react'
import './Overlay.css'
import getTranslation from '../../i18n/'
import EmailValidator from 'email-validator'
import onClickOutside from "react-onclickoutside";

/**
 * The contactform that is displayed in the yellow pages inside of an overlay
 */
class ContactForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {
                name: false, email: false, topic: false, message: false
            },
            required: [
                "name", "email", "topic", "message"
            ],
            name: '',
            email: '',
            topic: '',
            message: '',
            errorMessages: [],
            sent: false
        }
    }

    /**
     * Close the dialog if the user clicks outside of the contactform modal dialog
     */
    handleClickOutside() {
        this.closeDialog()
    }

    /**
     * Update the field state on input
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        let value = target.type === 'checkbox' ? target.checked : target.value;

        let errors = this.state.errors;
        let required = false;
        if(this.state.required.indexOf(name) !== -1) {
            if(value === '') {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }

        if(name === 'email') {
            if(!EmailValidator.validate(value)) {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }


        this.setState({ [name]: value, errors: errors });
    }

    /**
     * Close the modal dialog
     */
    closeDialog() {
        this.setState({ name: '', email: '', topic: '', message: '', sent: false})
        this.props.toggleOverlay();
    }

    /**
     * Send the contactform data to the backend via the sendMessage action that is dispatched 
     * width the form state
     */
    submitForm() {
        let errorMessages = [];
        let errors = this.state.errors;
        let redirect = false;
        let required = [];
        this.state.required.map(field => {
            if(this.state[field] === '') {
                required.push(field);
                errors[field] = true;
            }
        })
        if(required.length > 0) {
            errorMessages.push("forms.general.error.message.fields_required");
        }

        if(!EmailValidator.validate(this.state.email)) {
            errorMessages.push('forms.general.error.message.valid_email');
            errors.email = true;
        }



        if(errorMessages.length === 0) {
            this.props.sendMessage(this.props.contactemail, this.state.name, this.state.email, this.state.topic, this.state.message)
            this.setState({ name: '', email: '', topic: '', message: '', sent: true})
        }
        this.setState({errorMessages: errorMessages, errors: errors});
    }

    render() {
        return(
            <div>
                <h3>{getTranslation('forms.contact.title')} {this.props.contactname}</h3>
                <div className="contactform">

                    {((this.state.sent) && (!this.props.fetching.status)) &&
                        <div className="user-profile-item">
                            <h2>{getTranslation('forms.contact.sent')}</h2>
                            <button className="btn btn-green centered" onClick={() => this.closeDialog()}>{getTranslation('forms.contact.close')}</button>
                        </div>
                    }

                    {((this.state.sent) && (this.props.fetching.status)) &&
                        <div className="default-element default-element-dark profile-teaser">
                          <div className="loader"></div>
                        </div>
                    }

                    {!this.state.sent &&
                        <div>

                            <div className="user-profile-item">
                              <label className="centered">{getTranslation('forms.contact.name.label')}:{this.state.errors.name && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                              <input className={(this.state.errors.name ? 'v-error' : 'v-check')} name="name" type="text" value={this.state.name} onChange={(event) => this.updateField(event)} placeholder={getTranslation('userprofile.form.name.placeholder')} />
                            </div>

                            <div className="user-profile-item">
                              <label className="centered">{getTranslation('forms.contact.email.label')}:{this.state.errors.email && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                              <input className={(this.state.errors.email ? 'v-error' : 'v-check')} name="email" type="text" value={this.state.email} onChange={(event) => this.updateField(event)} placeholder={getTranslation('forms.general.email.placeholder')} />
                            </div>
                            <div className="user-profile-item">
                              <label className="centered">{getTranslation('forms.contact.topic.label')}:{this.state.errors.topic && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                              <input className={(this.state.errors.topic ? 'v-error' : 'v-check')} name="topic" type="text" value={this.state.topic} onChange={(event) => this.updateField(event)} placeholder={getTranslation('forms.contact.topic.placeholder')} />
                            </div>

                            <div className="user-profile-item">
                              <label className="centered">{getTranslation('forms.contact.message.label')}:{this.state.errors.message && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                              <textarea className={(this.state.errors.message ? 'v-error' : 'v-check')} name="message" value={this.state.message} rows="10" onChange={(event) => this.updateField(event)}></textarea>
                            </div>

                            <div className="user-profile-item">
                            {this.state.errorMessages.length > 0 &&
                                <div className="error-messages">
                                    {this.state.errorMessages.map((error, index) =>
                                        <p key={index}>{getTranslation(error)}</p>
                                    )}
                                </div>
                            }
                            <button className="btn btn-green btn-icon btn-email" onClick={() => this.submitForm()}>{getTranslation('forms.contact.submit.label')}</button>
                            <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.closeDialog()}>{getTranslation("forms.general.button.cancel")}</button>
                            </div>
                        </div>
                    }

                </div>
            </div>
        )
    }
}

export default onClickOutside(ContactForm);
