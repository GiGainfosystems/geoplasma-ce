import React, { Component } from 'react'
import EventDetail from './EventDetail'

/**
* This component gives the superuser a list of all events and
* the possibility to remove events from the website
*/
class EventList extends Component {

    constructor(props) {
        super(props);
        this.state = {
          /* The event that is active (active events can be deleted)
             Event gets active when the user clicks on a listed item */
          activeEvent: 0
        }
    }

    /**
    * Set the active event to the one that is clicked
    *@param {integer} event - the id of the event
    */
    clickEvent(event) {
        this.setState({activeEvent: event})
    }

    /**
    * Set the active event to 0 to not have any event marked as active
    * This function also gets called from the child component <EventDetail>
    */
    unClickEvent() {
        this.setState({activeEvent: 0})
    }

    render() {
        return(
            <div>
                <table cellSpacing="0" className="superuser-table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Title</td>
                            <td>User ID</td>
                        </tr>
                    </thead>

                    {this.props.events.map((event, index) =>
                    <tbody key={event.id}>
                        <tr className={(index % 2 === 0 ? 'even' : 'odd')} onClick={() => this.clickEvent(event.id)}>
                            <td>{event.id}</td>
                            <td>{event.name}</td>
                            <td>{event.date1}</td>
                        </tr>
                        {event.id === this.state.activeEvent &&
                        <tr>
                            <td colSpan="6">
                            <EventDetail event={event} removeEventSuperuser={this.props.removeEventSuperuser} unclickEvent={() => this.unClickEvent()} />
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

export default EventList
