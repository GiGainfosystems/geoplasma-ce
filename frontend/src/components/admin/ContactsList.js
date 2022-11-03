import React, { Component } from 'react'
import ContactDetailContainer from '../../containers/ContactDetailContainer'
import { Link } from 'react-router-dom'

/**
 * Component shows a list of all available contacts in the web portal and makes it possible to get to the form to edit them
 */
class ContactsList extends Component {

    constructor(props) {
        super(props);
        this.state = { activeContact: 0, activeContactDetails: {}}
    }

    clickContact(contact) {
        this.setState({activeContact: contact})
    }

    unClickContact() {
        this.setState({activeContact: 0})
    }

    render() {

        return(

            <div>
                <Link to="/experts/superuser/contact"><button className="btn btn-green">Add local contact</button></Link>
                <table cellSpacing="0" className="superuser-table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Language</td>
                            <td>Pilotarea</td>
                        </tr>
                    </thead>

                    {this.props.contacts.map((contact, index) =>
                    <tbody key={contact.id}>
                        <tr className={(index % 2 === 0 ? 'even' : 'odd')}>
                            <td>{contact.id}</td>
                            <td><Link to={"/experts/superuser/contact/"+contact.id}>{contact.language}</Link></td>
                            <td>{contact.pilotarea}</td>
                        </tr>
                        {contact.id === this.state.activeContact &&
                        <tr>
                            <td colSpan="6">
                                <ContactDetailContainer contact={contact} />
                            </td>
                        </tr>
                        }
                        </tbody>
                    )}
                </table>
            </div>
        )
    }
}

export default ContactsList
