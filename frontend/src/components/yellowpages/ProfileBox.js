import React, { Component } from 'react'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'

/**
 * The actual display box for the profiles in the yellow pages
 */
class ProfileBox extends Component {
    
    /**
     * Toggle the contact form
     * @param  {} name
     * @param  {} email
     */
    toggleOverlay(name, email) {
        this.props.toggleOverlay(name, email)
    }

    render() {
        let profile = this.props.profile

        return(
            <div key={profile.id} className="default-element default-element-dark profile-teaser">
              <Link to={"/experts/yellow-pages/"+profile.id}><h4><i className="fa fa-user-o" aria-hidden="true"></i> {profile.name}</h4></Link>
                <div className="container-flex">
                  <div className="third">
                      <p>
                      <label>{getTranslation("userprofile.form.pilot_area.label")}:</label>
                      <span>{getTranslation(profile.area)}</span>

                      <label>{getTranslation("userprofile.form.address.label")}</label>

                      {profile.street}<br />
                      {profile.zip} {profile.city}<br />
                      {getTranslation(profile.countryname)}<br />
                      </p><p>
                      {profile.phone !== '' &&
                      <span>
                      <label>{getTranslation("userprofile.form.phone.label")}:</label>
                      <span>{profile.phone}</span>
                      </span>
                      }
                      <label>{getTranslation("forms.general.email.label")}:</label>
                      <span>{profile.email}</span>

                      {profile.website !== '' &&
                      <span>
                      <label>{getTranslation("userprofile.form.website.label")}:</label>
                      <span><a href={profile.website}>{profile.website}</a></span>
                      </span>
                      }

                      {profile.contactform &&
                      <span>
                      <button className="btn btn-blue btn-icon btn-email" onClick={() => this.toggleOverlay(profile.name, profile.email)}>{getTranslation("contact.button")}</button>
                      </span>
                      }
                      </p>

                  </div>
                  <div className="two-third">
                  <ul className="list-of-occupations">
                      {profile.groups.map((group, index) =>
                          <li key={index}>{group}</li>
                      )}
                  </ul>
                      <p><label>{getTranslation("userprofile.short_profile")}:</label></p>
                    <p>

                      <span>{profile.desc}</span>

                    </p>
                    {profile.desc === '' &&
                    <p>{getTranslation("userprofile.short_profile_none_given")}</p>
                      }
                  </div>
                </div>

            </div>
        )
    }
}

export default ProfileBox
