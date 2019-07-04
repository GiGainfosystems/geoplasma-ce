import React, { Component } from 'react'
import './UserProfile.css'
import map from './map.png'
import leaflet from 'leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Cookies from 'universal-cookie';
import getTranslation from '../../i18n/'
import marker from 'leaflet/dist/images/marker-icon.png';
import markershadow from 'leaflet/dist/images/marker-shadow.png';

const cookies = new Cookies();

/**
 * The actual display of a user profile in the user dashboard
 */
class UserProfileView extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Toggle the active status of the userprofile
   */
  toggleActivate() {
      let token = cookies.get('token');
      this.props.toggleUserprofile(this.props.userprofile.id, token);
  }

  render() {

      let occupations = [];
      {this.props.userprofile.occupation.map((group, index) => {
          if(group !== 0) {
              let temp_occupation = this.props.professionalgroups.filter(pgroup => pgroup.id === group);
              if(temp_occupation.length > 0) {
                  occupations.push(temp_occupation[0].name);
              }

        }
      })}
      let pilot_area;
      if(Number(this.props.userprofile.pilot_area) === 0) {
          pilot_area = getTranslation('userprofile.form.pilot_area.not_in_pilotarea')
      } else {
          let temp_pilotarea = this.props.pilotareas.filter(area => area.id ===  Number(this.props.userprofile.pilot_area))
          if(temp_pilotarea.length > 0) {
              pilot_area = temp_pilotarea[0].name;
          }

      }

      let country;
          let temp_country = this.props.countries.filter(country => country.id ===  Number(this.props.userprofile.country))
          if(temp_country.length > 0) {
              country = temp_country[0].label;
          }


      let position = [parseFloat(this.props.userprofile.lat), parseFloat(this.props.userprofile.lon)];

      let icon = leaflet.icon({
        iconUrl: marker,
        shadowUrl: markershadow,
        iconSize: [24,36],
        iconAnchor: [12,36]
      });


          let text_profile = this.props.userprofile.profile.split('\n').map((item, key) => {
              return <span key={key}>{item}<br/></span>
          })


    return(
          <div className="default-element-gray-content">
            {!this.props.hidenav &&
            <div className={"flash-message " + (this.props.userprofile.activated ? "flash-green" : "flash-red")}>
              {this.props.userprofile.activated &&
                <h3>{getTranslation('userprofile.flash.ispublished')} <span onClick={() => this.toggleActivate()}>{getTranslation('userprofile.flash.unpublish')}</span></h3>
              }
              {!this.props.userprofile.activated &&
                <h3>{getTranslation('userprofile.flash.isnotpublished')} <span onClick={() => this.toggleActivate()}>{getTranslation('userprofile.flash.publish')}</span></h3>
              }
            </div>
            }
            <div className="user-profile container-flex profile-view">
              <div className="half">
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.name.label')}:</label>
                  <span>{this.props.userprofile.name}</span>
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.group.label')}:</label>
                  {occupations.map((name, index) =>
                      <span className="occupation-title" key={index}>{getTranslation(name)}</span>
                  )}
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.address.label')}:</label>
                  <span>{this.props.userprofile.street}<br />{this.props.userprofile.zip} {this.props.userprofile.city}<br />{getTranslation(country)}</span>
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.pilot_area.label')}:</label>
                  <span>{pilot_area}</span>
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.phone.label')}:</label>
                  <span>{this.props.userprofile.phone}</span>
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('forms.general.email.label')}:</label>
                  <span>{this.props.userprofile.email}</span>
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.website.label')}:</label>
                  <span>{this.props.userprofile.website}</span>
                </div>
              </div>
              <div className="half">
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.map.label')}:</label>
                  <div className="mapbox">
                  <Map center={position} zoom={13}>
                    <TileLayer
                      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker icon={icon} draggable={false} position={position}></Marker>
                  </Map>
                  </div>
                </div>
                <div className="user-profile-item">
                  <label>{getTranslation('userprofile.form.profile.label')}:</label>
                  <span>{text_profile}</span>
                </div>
              </div>
            </div>
          </div>

    )
  }
}

export default UserProfileView
