import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import getTranslation from '../../i18n/'

/**
 * List of events that were submitted by the logged in user
 */
class EventsContributed extends Component {
  render() {

    let myEvents = this.props.events.filter(event => event.user_id === this.props.user.id);
    return(
      <div className="contribute-section">
        <h4><i className="fa fa-calendar" aria-hidden="true"></i> {getTranslation("eventview.title")}: <Link to="/experts/contribute/event"><button className="btn btn-icon btn-green btn-new">{getTranslation("eventview.add_event_button")}</button></Link></h4>
        {myEvents.length === 0 &&
          <p>{getTranslation("eventview.no_event_added")}</p>
        }
        {myEvents.length > 0 &&
        <div className="default-element-gray-content">
          <table cellSpacing="0">
            <thead>
              <tr>
                <th className="table-50">{getTranslation("eventview.table.title")}</th>
                <th className="table-25">{getTranslation("eventview.table.location")}</th>
                <th className="table-25">{getTranslation("eventview.table.date")}</th>
              </tr>
            </thead>
            <tbody>
          {myEvents.length > 0 &&
            myEvents.map((event, index) =>
              <tr className={(index % 2 === 0 ? 'white' : 'table-gray')} key={event.id}>
                <td><Link to={"/experts/contribute/event/"+event.id}>{event.name}</Link></td>
                <td>{event.location}</td>
                <td>
                {event.date1 === event.date2 &&
                    <span>{moment(event.date1, "YYYY-MM-DD").format("DD.MM.YYYY")}</span>
                }
                {event.date1 !== event.date2 &&
                    <span>{moment(event.date1, "YYYY-MM-DD").format("DD.MM.YYYY")} - {moment(event.date2, "YYYY-MM-DD").format("DD.MM.YYYY")}</span>
                }
                </td>
              </tr>
            )
          }
          </tbody>
          </table>
        </div>
        }
      </div>
    )
  }
}

export default EventsContributed
