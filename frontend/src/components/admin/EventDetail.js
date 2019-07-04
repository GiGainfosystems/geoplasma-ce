import React, { Component } from 'react'
import Cookies from 'universal-cookie';

/* Initialize cookies to get access to token for authorization */
const cookies = new Cookies();

/**
 * This component gives the superuser the possibility to remove
 * events from the website
 */
class EventDetail extends Component {
    constructor(props) {
        super(props);
        /* Get the event from the props and save it in the local state */
        let new_object = Object.assign({}, props.event)
        this.state = {
          /* Event that can be removed */
          event: new_object
        }
    }

    /**
    * Hides the remove button for this event
    * calls the unClickEvent function of the parent via props
    */
    closeDetails() {
        this.props.unClickEvent();
    }

    /**
    * The event that is selected gets removed in the backend
    * via the removeEventSuperuser action (Superuser -> EventList -> EventDetail)
    */
    removeContent() {
        /* Get the token from the cookie for superuser authorization */
        let token = cookies.get('token');
        /* Call the removeEventSuperuser action via props */
        this.props.removeEventSuperuser(this.state.event.id, token)
    }

    render() {
        return(
            <div className="superuser-userdetail">
                <div className="btn-group">
                    <button onClick={() => this.removeContent()} className="btn btn-red">Remove event</button>
                    <button onClick={() => this.closeDetails()} className="btn btn-green">Close Details</button>
                </div>
            </div>
        )
    }
}

export default EventDetail
