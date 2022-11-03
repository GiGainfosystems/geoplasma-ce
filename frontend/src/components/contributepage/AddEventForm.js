import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Link, Redirect } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-select/dist/react-select.css';
import getTranslation from '../../i18n/'
import EmailValidator from 'email-validator'
import Footer from '../footer/Footer'
import Select from 'react-select';

/**
 * The form to add events to the knowledge platform
 */
class AddEventForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
        id: 0,
        name: '',
        organized_by: '',
        date1: moment(),
        date2: moment(),
        location: '',
        country: 1,
        website: '',
        contact: '',
        contact_email: '',
        multidate: false,
        errorMessages: [],
        errors: [],
        redirect: false,
        required: [
            "name", "organized_by", "location"
        ],
        deleteButton: false,
        deleteButtonExpanded: false
    }
  }

  /**
   * Date change
   * @param {*} date 
   * @param {*} whichdate 
   */
  handleChange(date, whichdate) {
  this.setState({
    [whichdate]: date
  });

    }

  /**
   * Update the field state
   * @param  {} event
   */
  updateField(event) {
      const target = event.target;
      const name = target.name;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      let errors = this.state.errors;

      if(this.state.required.indexOf(name) !== -1) {
          if(value === '') {
              errors[name] = true;
          } else {
              errors[name] = false;
          }
      }

      if(name === 'contact_email') {
          if(!EmailValidator.validate(value)) {
              errors[name] = true;
          } else {
              errors[name] = false;
          }
      }


      this.setState({ [name] : value, errors: errors });
  }

  componentDidMount() {
      if(this.props.id) {
        this.updateProps(this.props);
      }
  }

  updateProps(nextProps) {
      let eventdata;
      let multidate = false;
      let deleteButton = false;
      let filter = nextProps.events.filter(event => event.user_id === nextProps.user.id);
      let eventfilter = filter.filter(event => event.id === Number(nextProps.id));
      if(eventfilter.length > 0) {
          deleteButton = true;
          eventdata = Object.assign({}, eventfilter[0])
          if(eventdata.date1 !== eventdata.date2) {
              multidate = true;
          }
          this.setState({
              id: nextProps.id,
              name: eventdata.name,
              organized_by: eventdata.organized_by,
              date1: moment(eventdata.date1, "YYYY-MM-DD"),
              date2: moment(eventdata.date2, "YYYY-MM-DD"),
              location: eventdata.location,
              country: eventdata.country,
              website: eventdata.website,
              contact: eventdata.contact,
              contact_email: eventdata.contact_email,
              multidate: multidate,
              deleteButton: deleteButton
          })
      }
  }

  /**
   * Toggle the second date input in case the event has multiple days
   */
  toggleMultidate() {
      if(this.state.multidate) {
        this.setState({multidate: !this.state.multidate, date2: this.state.date1})
    } else {
        this.setState({multidate: !this.state.multidate})
    }

  }

  /**
   * Submit the form by dispatching the according action with the form state
   */
  submitForm() {
      let errorMessages = [];
      let errors = this.state.errors;
      let required = [];
      this.state.required.map(field => {
          if(this.state[field] === '') {
              required.push(field);
              errors[field] = true;
          } else if ((field === 'topics') && (this.state.topics.filter(topic => topic === 0).length > 2)) {
              required.push(field);
               errors[field] = true;
          }

      })

      if(required.length > 0) {
          errorMessages.push("forms.general.error.message.fields_required");
      }
      let date2;
      let date1 = moment(this.state.date1).format("YYYY-MM-DD");
      if(!this.state.multidate) {
          date2 = date1
      } else {
          date2 = moment(this.state.date2).format("YYYY-MM-DD");
          if(moment(date2).isBefore(date1)) {
              errorMessages.push("eventform.error.message.enddate_must_be_after");
          }
      }

      if(this.state.contact_email !== '') {
          if(!EmailValidator.validate(this.state.contact_email)) {
              errorMessages.push('forms.general.error.message.valid_email');
              errors.email = true;
          }
      }


      let redirect = false;
       if(errorMessages.length === 0) {
           const token = this.props.cookies.token;
          redirect = true;
          let website = this.state.website;
          if(this.state.website.substring(0,7) !== 'http://') {
              if(this.state.website.substring(0,8) !== 'https://') {
                  if(this.state.website !== '') {
                      website = 'http://'+website;
                  }
              }
          }

          this.props.addEvent(this.state.id, this.state.name, this.state.organized_by, this.state.contact, this.state.contact_email, date1, date2, this.state.location, this.state.country, website, token)

      }
this.setState({redirect: redirect, errors: errors, errorMessages: errorMessages })
  }

  componentWillReceiveProps(nextProps) {

      if(nextProps.id) {
        this.updateProps(nextProps);
      }
  }

  /**
   * Toggle the delete buttons
   */
  toggleDelete() {
      this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
  }

  /**
   * Remove an event from the knowledge platform
   */
  removeContent() {
      const token = this.props.cookies.token;
      this.props.removeEvent(this.props.id, token);
      this.setState({redirect: true})
  }

  /**
   * Change the country in which the event takes place
   * @param {} value 
   */
  changeCountry(value) {
      let country = value.value;
      this.setState({country: country})
  }

  render() {

      let countries = [];

      this.props.countries.map(country =>
          countries.push({
              value: country.id,
              label: getTranslation(country.label)
          })
      )

      countries.sort(function(a, b) {
      var textA = a.label.toUpperCase();
      var textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });

    return(
      <div>
      {this.state.redirect &&
          <Redirect to="/experts/contribute/overview" />
      }
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.contribute" />
          <div className="default-element">
            <div className="contribute-section">
              <div className="default-element-content">
                <h4><i className="fa fa-calendar" aria-hidden="true"></i> {getTranslation("eventform.title")}</h4>

                <div className="user-profile form-container">

                    <div className="form-item">
                      <label className="centered">{getTranslation("eventform.name.label")}:{this.state.errors.name && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <input className={(this.state.errors.name ? 'v-error' : 'v-check')} name="name" type="text" value={this.state.name} placeholder={getTranslation("eventform.name.placeholder")} onChange={(event) => this.updateField(event)} />

                    </div>
                    <div className="container-flex">
                        <div className="user-profile-item form-item half">
                          <label className="centered">{getTranslation("eventform.organized_by.label")}:{this.state.errors.organized_by && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                          <input className={(this.state.errors.organized_by ? 'v-error' : 'v-check')} name="organized_by" type="text" value={this.state.organized_by} onChange={(event) => this.updateField(event)} placeholder={getTranslation("eventform.organized_by.placeholder")} />

                        </div>
                        <div className="user-profile-item form-item half">
                          <label className="centered">{getTranslation("eventform.contact.label")}:</label>
                          <input name="contact" type="text" value={this.state.contact} onChange={(event) => this.updateField(event)} placeholder={getTranslation("eventform.contact.placeholder")} />

                          <label className="centered">{getTranslation("forms.general.email.label")}:{this.state.errors.contact_email && <span className="validation-error">{getTranslation('forms.general.error.hints.valid_email')}</span>}</label>
                          <input name="contact_email" type="text" value={this.state.contact_email} onChange={(event) => this.updateField(event)} />
                        </div>

                    </div>
                    <div className="container-flex">
                        <div className="user-profile-item form-item half">
                          <label className="centered">{this.state.multidate ? getTranslation("eventform.date.label.start") : getTranslation("eventform.date.label")}:</label>
                          <DatePicker locale="en-gb" readOnly={true} showYearDropdown={true} dateFormat="DD.MM.YYYY" selected={this.state.date1} onChange={(date) => this.handleChange(date, "date1")} />
                          <input name="terms" id="activated" type="checkbox" checked={this.state.multidate} onChange={(event) => this.toggleMultidate(event)} />
                          <label htmlFor="activated" className="checkbox-label">{getTranslation("eventform.date_multiple.label")}</label>
                        </div>
                        {this.state.multidate &&
                            <div className="user-profile-item form-item half">
                              <label className="centered">{getTranslation("eventform.date.label.end")}:</label>
                              <DatePicker locale="en-gb" dateFormat="DD.MM.YYYY" selected={this.state.date2} onChange={(date) => this.handleChange(date, "date2")} />
                            </div>
                        }
                    </div>
                    <div className="user-profile-item form-item">
                      <label className="centered">{getTranslation("eventform.location.label")}:{this.state.errors.location && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <input className={(this.state.errors.location ? 'v-error' : 'v-check')} name="location" type="text" value={this.state.location} onChange={(event) => this.updateField(event)} placeholder={getTranslation("eventform.location.placeholder")} />

                    </div>

                    <div className="user-profile-item form-item">
                      <label className="centered">{getTranslation('userprofile.form.country.label')}:{this.state.errors.country && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <Select
                          name="country"
                          value={Number(this.state.country)}
                          options={countries}
                          clearable={false}
                          onChange={(value) => this.changeCountry(value)}
                        />
                    </div>

                    <div className="user-profile-item form-item">
                      <label className="centered">{getTranslation("eventform.website.label")}:</label>
                      <input name="website" type="text" value={this.state.website} onChange={(event) => this.updateField(event)} placeholder={getTranslation("eventform.website.placeholder")} />

                    </div>
                    {this.state.errorMessages.length > 0 &&
                        <div className="error-messages">
                            {this.state.errorMessages.map((error, index) =>
                                <p key={index}>{getTranslation(error)}</p>
                            )}
                        </div>
                    }

                    <div className="user-profile-item">
                    <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>{getTranslation("eventform.button.save")}</button>
                    <Link to="/experts/contribute/overview"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>
                    {((!this.state.deleteButtonExpanded) && (this.state.deleteButton)) &&
                        <button className="btn btn-red btn-icon btn-delete" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.delete")}</button>
                    }
                    {this.state.deleteButtonExpanded &&
                        <span>
                            <button className="btn btn-red btn-icon btn-delete" onClick={() => this.removeContent()}>{getTranslation("forms.general.button.confirm_delete")}</button>
                            <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.cancel_delete")}</button>
                        </span>
                    }
                    </div>


                </div>
              </div>
            </div>
          </div>
          <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default AddEventForm
