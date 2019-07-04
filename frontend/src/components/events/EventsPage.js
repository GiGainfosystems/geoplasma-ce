import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import FilterBox from '../filterbox/FilterBox'
import getTranslation from '../../i18n/'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Footer from '../footer/Footer'
import EventBox from './EventBox'
import { filterCategories, buildFilterbox } from '../filterbox/filterhelper'

/**
 * The events page of the web portal, displaying a list of upcoming events
 */
class EventsPage extends Component {

  constructor(props) {
    super(props);
  }
  
  /**
   * Toggle the event filter
   * @param  {} filter - Filter object
   * @param  {} id 
   */
  toggleFilter(filter, id) {

      let temp = this.state.filters;
      let removed = false;
      temp[filter].filter.map((singleton, index) => {

          if(singleton === id) {
              temp[filter].filter.splice(index, 1);
              removed = true;
          }

      })
      if(temp[filter].single) {
          temp[filter].filter = [];
      }
      if(!removed) {
          if(id !== 0) {
              temp[filter].filter.push(id);
          }
      }
      this.props.updateEventsFilter(temp)
  }

  render() {

      let events = this.props.events;
      let filters = buildFilterbox(this.props.filter, this.props)

    return(
      <div>
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.events" />

          <FilterBox toggleFilter={(filter,id) => this.toggleFilter(filter, id)} title={getTranslation("filterbox.title")} filters={filters} filteroptions={this.props.filters} />

            {((this.props.events.length === 0) && (!this.props.fetching.dataFetching.isFetching)) &&
                <h2 className="no-result" dangerouslySetInnerHTML={{__html: getTranslation("eventview.no_event_existing")}}></h2>
            }


          {((this.props.fetching.dataFetching.isFetching) && (this.props.events.length === 0)) &&
              <div className="default-element default-element-dark profile-teaser">
                <div className="loader"></div>
              </div>
          }

            {events.map(event =>
                <EventBox key={event.id} event={event} />
            )}
            <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default EventsPage
