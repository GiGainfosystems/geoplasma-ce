import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import FilterBox from '../filterbox/FilterBox'
import Footer from '../footer/Footer'
import Overlay from '../overlay/Overlay'
import ContactForm from '../overlay/ContactForm'
import getTranslation from '../../i18n/'
import { Redirect } from 'react-router-dom';
import ProfileBox from './ProfileBox'

/**
 * Page that displays a single profile of the yellow pages
 */
class SingleProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
        contactname: '',
        contactemail: '',
        overlay: false
    }
  }

  /**
   * Toggle the contact form
   * @param  {} name
   * @param  {} email
   */
  toggleOverlay(name, email) {
    this.setState({contactname: name, contactemail: email, overlay: !this.state.overlay})
  }

  render() {

      let profile = this.props.profile
      if(!this.props.notfound) {
        profile.desc = profile.profile.split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>
        })
    }


    return(
      <div>
        {this.state.overlay &&<Overlay><ContactForm fetching={this.props.fetching} sendMessage={this.props.sendMessage} toggleOverlay={() => this.toggleOverlay()} contactname={this.state.contactname} contactemail={this.state.contactemail} /></Overlay>}
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.yellow_pages" />

          {((this.props.notfound) && (!this.props.fetching.dataFetching.isFetching)) &&
              <h2>Not found</h2>
          }

          {((this.props.fetching.dataFetching.isFetching) && (this.props.notfound)) &&
              <div className="default-element default-element-dark profile-teaser">
                <div className="loader"></div>
              </div>
          }

          {!this.props.notfound &&

              <ProfileBox profile={profile} toggleOverlay={(name, email) => this.toggleOverlay(name, email)} />
        }
              <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default SingleProfile
