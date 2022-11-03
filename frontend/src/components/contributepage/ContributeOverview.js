import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import EventsContributed from './EventsContributed'
import ContentContributed from './ContentContributed'
import UserProfile from './UserProfile'
import { Redirect } from 'react-router-dom'
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'
import { Link } from 'react-router-dom'
import {deleteCookie} from "../../actions";

/**
 * The dashboard that a user sees upon logging into the knowledge platform
 */
class ContributeOverview extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, active: 'settings', deleteButton: true,
        deleteButtonExpanded: false}
    }

    /**
     * Log a user out
     */
    logOut() {
        this.props.deleteCookie('token');
        this.props.signOut();
        this.setState({redirect: true});
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.user.isLoggedIn) {
          this.setState({redirect: true});
        }
    }

    /**
     * Toggle delete buttons
     */
    toggleDelete() {
        this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
    }

    /**
     * Remove a user from the knowledge platform
     */
    removeUser() {
      const token = this.props.cookies.token;
      this.props.removeUser(token)
    }

  render() {

      if(this.state.redirect) {
          return <Redirect to="/experts" />
      }

      let userprofile = this.props.userprofiles.filter(profile => profile.user_id === this.props.user.id);
      if(userprofile.length === 1) {
          userprofile = userprofile[0]
      } else {
          userprofile = {};
      }
    return(
      <div>
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.contribute" />
          <div className="default-element">
            <div className="default-element-content">
                <h2 className="backend">{getTranslation("contribute.greeting", this.props.user.username)}
                  <button className="btn btn-gray" onClick={() => this.logOut()}>{getTranslation("contribute.logout")}</button>
                  {((!this.state.deleteButtonExpanded) && (this.state.deleteButton)) &&
                    <button className="btn btn-red btn-icon btn-delete" onClick={() => this.toggleDelete()}>Delete my account</button>
                  }
                  {this.state.deleteButtonExpanded &&
                      <span>
                          <button className="btn btn-red btn-icon btn-delete" onClick={() => this.removeUser()}>{getTranslation("forms.general.button.confirm_delete")}</button>
                          <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.cancel_delete")}</button>
                      </span>
                  }
                  <Link to="/experts/contribute/mydata"><button className="btn btn-green">{getTranslation("mydata.button")}</button></Link>
                </h2>
                <ContentContributed content={this.props.content}  user={this.props.user} />
                <UserProfile countries={this.props.countries} toggleUserprofile={this.props.toggleUserprofile} pilotareas={this.props.pilotareas} professionalgroups={this.props.professionalgroups} userprofile={userprofile} />
                <EventsContributed events={this.props.events} user={this.props.user} />
            </div>
          </div>
          <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }

}


export default ContributeOverview
