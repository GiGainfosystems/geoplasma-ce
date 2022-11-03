import React, { Component } from 'react'
import './UserProfile.css'
import UserProfileView from './UserProfileView'
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'
import UserProfileViewContainer from "../../containers/UserProfileViewContainer";

/**
 * Display a user profile in the user dashboard
 */
class UserProfile extends Component {

  constructor(props) {
    super(props);

  }

  render() {
      let userprofile;
      if (Object.keys(this.props.userprofile).length === 0) {
          userprofile = false
      } else {
          userprofile = true;
      }
    return (
        <div className="contribute-section">
            <h4><i className="fa fa-address-book" aria-hidden="true"></i> {getTranslation("userprofile.title")}: <Link to="/experts/contribute/profile"><button className="btn btn-icon btn-green btn-new">{getTranslation("userprofile.button.update_profile")}</button></Link></h4>
              {!userprofile &&
                <p>{getTranslation("userprofile.no_profile")}</p>
              }
              {userprofile &&
                <UserProfileViewContainer countries={this.props.countries} toggleUserprofile={this.props.toggleUserprofile} pilotareas={this.props.pilotareas} professionalgroups={this.props.professionalgroups} userprofile={this.props.userprofile} />
              }

        </div>
    )
  }
}

export default UserProfile
