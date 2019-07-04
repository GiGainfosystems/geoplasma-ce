import React, { Component } from 'react'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'
import moment from 'moment'

/**
 * The "event box" which contains all information for a single event that is shown in the events section on the web portal
 */
class EventBox extends Component {
    render() {
        let event = this.props.event

        return(
            <div key={event.id} className="default-element default-element-dark profile-teaser">
              <Link to={("/experts/events/"+event.id)}><h4><i className="fa fa-calendar" aria-hidden="true"></i> {event.name}</h4></Link>
                <div className="container-flex">
                  <div className="half">
                      <p><label>{getTranslation("eventview.table.date")}:</label>
                        {event.date1 === event.date2 &&
                            <span>{moment(event.date1, "YYYY-MM-DD").format("DD.MM.YYYY")}</span>
                        }
                        {event.date1 !== event.date2 &&
                            <span>{moment(event.date1, "YYYY-MM-DD").format("DD.MM.YYYY")} - {moment(event.date2, "YYYY-MM-DD").format("DD.MM.YYYY")}</span>
                        }
                      </p>

                      <p><label>{getTranslation("eventform.organized_by.label")}:</label>
                        <span>{event.organized_by}</span>
                      </p>
                        
                    {event.contact &&
                    <p><label>{getTranslation("eventview.contact_person")}:</label>
                      <span>{event.contact}<br />
                      {event.contact_email}</span>
                    </p>
                    }    
                  </div>
                  <div className="half">
                    <p><label>{getTranslation("eventform.location.label")}:</label><span>{event.location}, {event.countryname}</span>
                    </p>
                    {event.website && 
                        <p><label>{getTranslation("eventform.website.label")}:</label><span><a href={event.website}><button className="btn btn-blue btn-icon btn-external">{getTranslation("eventview.gotowebsite")}</button></a></span>
                        </p>
                    }
                    
                  </div>
                </div>

            </div>
        )
    }
}

export default EventBox
