import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect } from 'react-router-dom'
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'
import UserProfileViewContainer from "../../containers/UserProfileViewContainer";

/**
 * The my data overview page where the user sees which information about him/her is saved on our web portal
 */
class MyData extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, deleteButton: true,
        deleteButtonExpanded: false}
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
     * Remove the user from the knowledge platform
     */
    removeUser() {
      const token = this.props.cookies.token
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
                <h3>{getTranslation("mydata.infotext")}:</h3>
                <table>
                  <tr><td>{getTranslation('forms.general.email.label')}:</td><td>{this.props.user.email}</td></tr>
                  <tr><td>{getTranslation('forms.signup.username.label')}:</td><td>{this.props.user.username}</td></tr>
                </table><br /><br />

                {userprofile.id &&
                    <React.Fragment>
                    <UserProfileViewContainer hidenav={true} countries={this.props.countries} pilotareas={this.props.pilotareas} professionalgroups={this.props.professionalgroups} userprofile={userprofile} /><br /><br />
                    </React.Fragment>
                }
                <p>{getTranslation("delete.infotext")}</p>
                {((!this.state.deleteButtonExpanded) && (this.state.deleteButton)) &&
                  <button className="btn btn-red btn-icon btn-delete" onClick={() => this.toggleDelete()}>{getTranslation("delete.userdata")}</button>
                }
                {this.state.deleteButtonExpanded &&
                    <span>
                        <button className="btn btn-red btn-icon btn-delete" onClick={() => this.removeUser()}>{getTranslation("forms.general.button.confirm_delete")}</button>
                        <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.cancel_delete")}</button>
                    </span>
                }

            </div>
          </div>
          <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }

}


export default MyData
