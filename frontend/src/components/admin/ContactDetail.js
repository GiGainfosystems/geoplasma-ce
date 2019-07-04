import React, { Component } from 'react'
import Cookies from 'universal-cookie';

/* Initialize cookies to get access to token for authorization */
const cookies = new Cookies();

/**
 * This component gives the superuser the possibility to remove
 * content from the website (landingpage)
 */
class ContactDetail extends Component {
    constructor(props) {
        super(props);
        /* Get the content from the props and save it in the local state */
        let new_object = Object.assign({}, props.contact)
        this.state = {
          // Content that can be removed in this component
          contact: new_object
        }
    }

    /**
     * Hide the details of the selected contact
     */
    closeDetails() {
        this.props.unClickContact();
    }
   /**
    * Remove the contact that is selected
    */
   removeContact() {
        let token = cookies.get('token');
        this.props.removeContact(this.state.contact.id, token)
    }

    render() {
        return(
            <div className="superuser-userdetail">
                <div className="btn-group">
                    <button onClick={() => this.removeContact()} className="btn btn-red">Remove contact</button>
                    <button onClick={() => this.closeDetails()} className="btn btn-green">Close Details</button>
                </div>
            </div>
        )
    }
}

export default ContactDetail
