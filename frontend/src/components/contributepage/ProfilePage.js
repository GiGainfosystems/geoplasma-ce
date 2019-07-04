import React, { Component } from 'react'
import './UserProfile.css'
import Header from '../header/Header'
import ProfileForm from './ProfileForm'
import Subheader from '../subheader/Subheader'
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'

/**
 * Display the user profile form
 */
class ProfilePage extends Component {

  render() {
      let filter = this.props.userprofile.filter(profile => profile.user_id === this.props.user.id);
      let userprofile;
      let lat, lon;
      if(filter.length === 1) {
          userprofile = Object.assign({}, filter[0])
          lat = userprofile.lat;
          lon = userprofile.lon;
      } else {
          lat = 51.505;
          lon = -0.09;
          userprofile = {
              name: '',
              occupation: [0, 0, 0],
              street: '',
              zip: '',
              city: '',
              country: '',
              phone: '',
              email: '',
              website: '',
              pilot_area: 0,
              profile: '',
              contactform: false,
              activated: false,
          };
      }

      let fetching = true;
      if((!this.props.fetching.dataFetching.isFetching) || (this.props.fetching.data !== '')) {
          fetching = false;
      }
    return(
      <div>
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.contribute" />
          <div className="default-element">
            <div className="contribute-section">
              <h4><i className="fa fa-address-book" aria-hidden="true"></i> {getTranslation("userprofile.form.title")}:</h4>
              <div className="default-element-gray-content">
                {fetching &&
                    <div className="fetching-overlay">
                      <div className="loader"></div>
                    </div>
                }
                {!fetching &&
                    <ProfileForm lat={lat} lon={lon} countries={this.props.countries} pilotareas={this.props.pilotareas} professionalgroups={this.props.professionalgroups} geocodeAddress={this.props.geocodeAddress} updateUserprofile={this.props.updateUserprofile} userprofile={userprofile} fetching={this.props.fetching} user={this.props.user} />
                }
              </div>
            </div>
          </div>
          <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default ProfilePage
