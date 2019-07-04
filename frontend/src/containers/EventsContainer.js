import { connect } from 'react-redux'
import EventsPage from '../components/events/EventsPage'
import { filterCategories } from '../components/filterbox/filterhelper'
import moment from 'moment'
import { updateEventsFilter } from '../actions'
import getTranslation from '../i18n/'

const mapStateToProps = (state) => {
    let events = [];
    if(state.events.length > 0) {
        
        events = state.events.filter(event => ((moment(event.date1, "YYYY-MM-DD") >= moment().subtract(1, 'day')) || (moment(event.date2, "YYYY-MM-DD") >= moment().subtract(1, 'day'))))

        events = filterCategories(events, state.filter.events)

        events.map(event => {
            let country;
            let temp_country = state.countries.filter(country => country.id ===  Number(event.country))
            if(temp_country.length > 0) {
                country = temp_country[0].label;
            }
            event.countryname = getTranslation(country);
        })
    }

  return {
    user: state.user,
    userprofiles: state.userprofiles,
    professionalgroups: state.professionalgroups,
    pilotareas: state.pilotareas,
    countries: state.countries,
    events: events,
    pages: state.pages,
    language: state.language,
    fetching: state.fetching,
    filter: state.filter.events
  }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updateEventsFilter: (filter) => {
            dispatch(updateEventsFilter(filter))
        },
    }
}


const EventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsPage)

export default EventsContainer
