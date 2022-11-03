import React, { Component } from 'react'

/**
 * Form to change user details as admin (projectpartner setting, confirmation of user, deactivate a user)
 */
class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = { user: props.user}
    }

    /**
     * Update the field state on input
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name.split("-")[0];
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let user = this.state.user;
        user[name] = value;
        this.setState({ user : user });

    }
    
    /**
     * Hide the user details in the list of users
     */
    closeDetails() {
        this.props.unClickUser();
    }

    /**
     * Save changes to the user by dispatching the changeUserDetailsSuperuser action
     */
    saveChanges() {
        const token = this.props.cookies.token;
        this.props.changeUserDetailsSuperuser(this.state.user.id, this.state.user.username, this.state.user.email, this.state.user.confirmed, this.state.user.projectpartner, this.state.user.deactivated, token)
    }

    render() {

        return(

            <div className="superuser-userdetail">

                {((this.props.fetching.formRequest.form === 'changeuserdetailssuper') && (this.props.fetching.formRequest.isFetching)) &&
                    <div className="fetching-overlay">
                      <div className="loader"></div>
                    </div>
                }

                <label>Username:</label>
                <input onChange={(event) => this.updateField(event)} name="username-form" type="text" value={this.state.user.username} />

                <label>Email:</label>
                <input onChange={(event) => this.updateField(event)} name="email-form" type="text" value={this.state.user.email} />

                <input onChange={(event) => this.updateField(event)} id="confirmed-form" name="confirmed-form" type="checkbox" checked={this.state.user.confirmed} />
                <label htmlFor="confirmed-form" className="checkbox-label">User is confirmed</label><br />
                <input id="projectpartner-form" name="projectpartner-form" type="checkbox" checked={this.state.user.projectpartner} onChange={(event) => this.updateField(event)} />
                <label htmlFor="projectpartner-form" className="checkbox-label">User is project partner of GeoPLASMA-CE</label><br />
                <input id="deactivated-form" name="deactivated-form" type="checkbox" checked={this.state.user.deactivated} onChange={(event) => this.updateField(event)} />
                <label htmlFor="deactivated-form" className="checkbox-label">User deactivated</label>
                <div className="btn-group">
                    <button onClick={() => this.saveChanges()} className="btn btn-green">Save changes</button>
                    <button onClick={() => this.closeDetails()} className="btn btn-green">Close Details</button>
                </div>

            </div>
        )
    }
}

export default UserDetail
