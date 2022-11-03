import React, { Component } from 'react'
import UserDetailContainer from "../../containers/UserDetailContainer";

/**
 * List of users that is displayed in the admin area
 */
class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = { activeUser: 0, activeUserDetails: {}}
    }
    
    /**
     * Show details of a user by clicking on the user in the table
     * @param  {} user - User object
     */
    clickUser(user) {
        this.setState({activeUser: user})
    }

    /**
     * Hide details of a user
     */
    unClickUser() {
        this.setState({activeUser: 0})
    }

    render() {

        return(

            <div>
                <table cellSpacing="0" className="superuser-table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Username</td>
                            <td>Email</td>
                            <td>Confirmed</td>
                            <td>Projectpartner</td>
                            <td>Deactivated</td>
                        </tr>
                    </thead>

                    {this.props.users.map((user, index) =>
                    <tbody key={user.id}>
                        <tr className={(index % 2 === 0 ? 'even' : 'odd')} onClick={() => this.clickUser(user.id)}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <input id="confirmed" name="confirmed" type="checkbox" checked={user.confirmed} readOnly="readonly" />
                                <label htmlFor="confirmed" className="checkbox-label top"></label>
                            </td>
                            <td>
                                <input id="projectpartner" name="projectpartner" type="checkbox" checked={user.projectpartner} readOnly="readonly" />
                                <label htmlFor="projectpartner" className="checkbox-label top"></label>
                            </td>
                            <td>
                                <input id="deactivated" name="deactivated" type="checkbox" checked={user.deactivated} readOnly="readonly" />
                                <label htmlFor="deactivated" className="checkbox-label top"></label>
                            </td>
                        </tr>
                        {user.id === this.state.activeUser &&
                        <tr>
                            <td colSpan="6"><UserDetailContainer user={user} unClickUser={() => this.unClickUser()} changeUserDetailsSuperuser={this.props.changeUserDetailsSuperuser} fetching={this.props.fetching} /></td>
                        </tr>
                        }
                        </tbody>
                    )}
                </table>
            </div>
        )
    }
}

export default UserList
