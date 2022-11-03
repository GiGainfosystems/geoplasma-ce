import React, { Component } from 'react'
import './UserProfile.css'
import { Link, Redirect } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import EmailValidator from 'email-validator'
import { Map, Marker, TileLayer } from 'react-leaflet';
import getTranslation from '../../i18n/'
import 'react-select/dist/react-select.css';
import marker from 'leaflet/dist/images/marker-icon.png';
import markershadow from 'leaflet/dist/images/marker-shadow.png';
import leaflet from 'leaflet';
import Select from 'react-select';

/**
 * The form to update a userprofile
 */
class ProfileForm extends Component {

  constructor(props) {
    super(props);
    
    let lat, lon;
        if(!props.lat) {
        lat = 48.191;
        lon = 15.989;
    } else {
        lat = parseFloat(props.lat);
        lon = parseFloat(props.lon);
    }
        this.state = {
            lat: lat,
            lon: lon,
            zoom: 13,
            redirect: false,
            errorMessages: [],
            errors: {
                map: false, name: false, occupation: false, street: false, zip: false, city: false, country: false, phone: false, email: false, website: false, pilotArea: false, profile: false
            },
            userprofile: {
                name: '',
                occupation: [0, 0, 0],
                street: '',
                zip: '',
                city: '',
                country: 1,
                phone: '',
                email: '',
                website: '',
                pilot_area: 0,
                profile: '',
                contactform: false,
                activated: false,
            },
            required: [
                "name", "street", "zip", "city", "country", "pilot_area", "occupation", "email"
            ]
        }

  }

  /**
   * Update the field state on change
   * @param  {} event
   */
  updateField(event) {
      let userprofile = this.state.userprofile;
      const target = event.target;
      const name = target.name;
      let value = target.type === 'checkbox' ? target.checked : target.value;

      let errors = this.state.errors;
      
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

      if(name === 'profile') {
          let words = value.split(" ");
          if(words.length > 151) {
              errors[name] = true;
              value = this.state.userprofile.profile
          } else {
              errors[name] = false;
          }
      }
      userprofile[name] = value;
      this.setState({ userprofile: userprofile, errors: errors });   
  }

  /**
   * Submit the profile by dispatching the according action with the form state + JWT token
   */
  submitProfile() {
      let errorMessages = [];
      let errors = this.state.errors;
      let redirect = false;
      let required = [];
     
      this.state.required.map(field => {
          if(this.state.userprofile[field] === '') {
              required.push(field);
              errors[field] = true;
          } else if ((field === 'occupation') && (this.state.userprofile.occupation.filter(group => group === 0).length > 2)) {
              required.push(field);
               errors[field] = true;
          }
          else if ((field === 'country') && (this.state.userprofile.country === 0)) {
              required.push(field);
               errors[field] = true;
          }
      })
      if(required.length > 0) {
          errorMessages.push("forms.general.error.message.fields_required");
      }

      if(!EmailValidator.validate(this.state.userprofile.email)) {
          errorMessages.push('forms.general.error.message.valid_email');
          errors.email = true;
      }

      if(errorMessages.length === 0) {
          let website = this.state.userprofile.website;
          if(this.state.userprofile.website.substring(0,7) !== 'http://') {
              if(this.state.userprofile.website.substring(0,8) !== 'https://') {
                  if(this.state.userprofile.website !== '') {
                      website = 'http://'+website;
                  }
              }
          }
          const token = this.props.cookies.values;
          this.props.updateUserprofile(this.state.userprofile.name, this.state.userprofile.occupation, this.state.userprofile.street, this.state.userprofile.zip, this.state.userprofile.city, this.state.userprofile.country, this.state.userprofile.phone, this.state.userprofile.email, website, this.state.userprofile.pilot_area, this.state.lat, this.state.lon, this.state.userprofile.contactform, this.state.userprofile.activated, this.state.userprofile.profile, token)
          redirect = true;
      }
      this.setState({errorMessages: errorMessages, redirect: redirect, errors: errors});
  }

  /**
   * Geocode the entered address
   */
  geocode() {
      if((this.state.userprofile.street === '') || (this.state.userprofile.zip === '') || (this.state.userprofile.city === '')) {
          let errors = this.state.errors;
          errors.map = true;
          this.setState({errors: errors})
      } else {
          this.props.geocodeAddress(this.state.userprofile.street, this.state.userprofile.zip, this.state.userprofile.city)
          this.setState({mapOverlay: false})
      }
  }

  /**
   * Change the coordinates based on either a dragged marker or a geocoded address
   * @param {*} event 
   */
  updateCoordinates(event) {
    const zoom = this.refs.map.leafletElement.getZoom()
    let userprofile = this.state.userprofile;
    userprofile.lon = event.target.getLatLng().lng;
    userprofile.lat = event.target.getLatLng().lat;
    this.setState({zoom, userprofile, lat: userprofile.lat, lon: userprofile.lon})
  }

  /**
   * Change the professional group (occupation) of a user
   * @param {} value 
   * @param {*} index 
   */
  changeProfessionalGroup(value, index) {
      let already_selected = this.state.userprofile.occupation.filter(pgroup => pgroup === value.value);
      if(already_selected.length === 0) {
          let userprofile = this.state.userprofile;
          userprofile.occupation[index] = value.value;
          this.setState({userprofile: userprofile})
      }
  }

  /**
   * Change the pilot area of a user
   * @param {} value 
   */
  changePilotArea(value) {
      let userprofile = this.state.userprofile;
      userprofile.pilot_area = value.value;
      this.setState({userprofile: userprofile})
  }

  /**
   * Change the country of a user
   * @param {} value 
   */
  changeCountry(value) {
      let userprofile = this.state.userprofile;
      userprofile.country = value.value;
      this.setState({userprofile: userprofile})
  }

  componentWillReceiveProps(nextProps) {

      let lat, lon;
      if((nextProps.fetching.dataFetching.data === 'geocode') && (nextProps.fetching.dataFetching.status) && (!nextProps.fetching.dataFetching.isFetching)) {
          lat = nextProps.fetching.dataFetching.coordinates[0];
          lon = nextProps.fetching.dataFetching.coordinates[1];
          this.setState({lat: parseFloat(lat), lon: parseFloat(lon)})
      } else if(nextProps.fetching.dataFetching.data !== 'geocode') {
          let userprofile = nextProps.userprofile;
          if(userprofile.lat === undefined) {
              lat = this.state.lat;
              lon = this.state.lon;
          } else {
              lat = userprofile.lat;
              lon = userprofile.lon;
          }
          this.setState({userprofile: userprofile, lat: lat, lon: lon})
      }


  }

  componentDidMount() {
      this.setState({
       userprofile: this.props.userprofile
   })
  }

  render() {
      
      let occupations = [];

      this.props.professionalgroups.map(occupation =>
          occupations.push({
              value: occupation.id,
              label: getTranslation(occupation.name)
          })
      )
      occupations.sort(function(a, b) {
      var textA = a.label.toUpperCase();
      var textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      occupations.unshift({ value: 0, label: getTranslation('userprofile.form.group.placeholder')})


      let pilotareas = [];

      this.props.pilotareas.map(area =>
          pilotareas.push({
              value: area.id,
              label: getTranslation(area.name)
          })
      )

      pilotareas.sort(function(a, b) {
      var textA = a.label.toUpperCase();
      var textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      pilotareas.unshift({value: 0, label: getTranslation('userprofile.form.pilot_area.not_in_pilotarea')})

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
      countries.unshift({value: 0, label: getTranslation('select.country')})

      let position = [parseFloat(this.state.lat), parseFloat(this.state.lon)];
      if((this.props.fetching.dataFetching.data === 'geocode') && (this.props.fetching.dataFetching.status === true) && (this.props.fetching.dataFetching.isFetching === false)) {
        position = this.props.fetching.dataFetching.coordinates;
      }

      let icon = leaflet.icon({
        iconUrl: marker,
        shadowUrl: markershadow,
        iconSize: [24,36],
        iconAnchor: [12,36]
      });

      let words = this.state.userprofile.profile.split(" ").length-1;

    return(
        <div className="user-profile container-flex form-container">
        {this.state.redirect &&
            <Redirect to="/experts/contribute/overview" />
        }
          <div className="half">
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.name.label')}:{this.state.errors.name && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
              <input className={(this.state.errors.name ? 'v-error' : 'v-check')} name="name" type="text" value={this.state.userprofile.name} onChange={(event) => this.updateField(event)} placeholder={getTranslation('userprofile.form.name.placeholder')} />
            </div>
            <div className="user-profile-item profile-form-select">
                <label className="centered">{getTranslation('userprofile.form.group.label')}:{this.state.errors.occupation && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                {this.state.userprofile.occupation.map((group, index) =>
                    <Select key={index}
                        name={"occupation-"+index}
                        value={group}
                        options={occupations}
                        clearable={false}
                        onChange={(value) => this.changeProfessionalGroup(value, index)}
                      />
                )}

            </div>
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.address.label')}:{this.state.errors.street && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
              <input className={(this.state.errors.street ? 'v-error' : 'v-check')} name="street" type="text" value={this.state.userprofile.street} onChange={(event) => this.updateField(event)}/>
            </div>
            <div className="user-profile-item container-flex">
              <div className="half">
                <label className="centered">{getTranslation('userprofile.form.zip.label')}:{this.state.errors.zip && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                <input className={(this.state.errors.zip ? 'v-error' : 'v-check')} name="zip" type="text" value={this.state.userprofile.zip} onChange={(event) => this.updateField(event)}/>
              </div>
              <div className="half">
                <label className="centered">{getTranslation('userprofile.form.city.label')}:{this.state.errors.city && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                <input onBlur={() => this.geocode()} className={(this.state.errors.city ? 'v-error' : 'v-check')} name="city" type="text" value={this.state.userprofile.city} onChange={(event) => this.updateField(event)}/>
              </div>
            </div>
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.country.label')}:{this.state.errors.country && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
              <Select
                  name="country"
                  value={Number(this.state.userprofile.country)}
                  options={countries}
                  clearable={false}
                  onChange={(value) => this.changeCountry(value)}
                />
            </div>
            <div className="user-profile-item profile-form-select">
                <label className="centered">{getTranslation('userprofile.form.pilot_area.label')}:{this.state.errors.pilot_area && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                <Select
                    name="pilot_area"
                    value={Number(this.state.userprofile.pilot_area)}
                    options={pilotareas}
                    clearable={false}
                    onChange={(value) => this.changePilotArea(value)}
                  />
            </div>
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.phone.label')}:</label>
              <input name="phone" type="text" value={this.state.userprofile.phone} onChange={(event) => this.updateField(event)}/>
            </div>
            <div className="user-profile-item">
              <label className="centered">{getTranslation('forms.general.email.label')}:{this.state.errors.email && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
              <input className={(this.state.errors.email ? 'v-error' : 'v-check')} name="email" type="email" value={this.state.userprofile.email} onChange={(event) => this.updateField(event)}/>
            </div>
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.website.label')}:</label>
              <input name="website" type="text" value={this.state.userprofile.website} onChange={(event) => this.updateField(event)}/>
            </div>

            <div className="user-profile-item">
              <input name="contactform" id="contactform" type="checkbox" checked={this.state.userprofile.contactform} onChange={(event) => this.updateField(event)} />
              <label htmlFor="contactform" className="checkbox-label">{getTranslation('userprofile.form.contactform.label')}</label>
            </div>

            <div className="user-profile-item">
              <input name="activated" id="activated" type="checkbox" checked={this.state.userprofile.activated} onChange={(event) => this.updateField(event)} />
              <label htmlFor="activated" className="checkbox-label">{getTranslation('userprofile.form.publish.label')}</label>
            </div>

            <div className="user-profile-item">
            {this.state.errorMessages.length > 0 &&
                <div className="error-messages">
                    {this.state.errorMessages.map((error, index) =>
                        <p key={index}>{getTranslation(error)}</p>
                    )}
                </div>
            }
            <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitProfile()}>{getTranslation('userprofile.form.button.save')}</button>
            <Link to="/experts/contribute/overview"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>
            </div>
          </div>
          <div className="half">
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.map.label')}:</label>
              <div className="mapbox">
              <button className="btn btn-green btn-icon btn-geocode" onClick={() => this.geocode()}>{getTranslation('userprofile.form.button.geocode')}</button>
              <Map ref="map" center={position} zoom={this.state.zoom}>
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker icon={icon} draggable={true} onDragEnd={(event) => this.updateCoordinates(event)} position={position}></Marker>
              </Map>
              </div>
              <div className="mapbox-errors">
                {this.state.errors.map && <span className="validation-error">{getTranslation('userprofile.form.error.map')}</span>}
              </div>
            </div>
            <div className="user-profile-item">
              <label className="centered">{getTranslation('userprofile.form.profile.label')}:{this.state.errors.profile && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
              <textarea className={(this.state.errors.profile ? 'v-error' : 'v-check')} name="profile" value={this.state.userprofile.profile} rows="15" onChange={(event) => this.updateField(event)}></textarea>
              <label>{words}{getTranslation("userprofile.form.profile.counter")}</label>
            </div>

          </div>
        </div>
    )
  }
}

export default ProfileForm
