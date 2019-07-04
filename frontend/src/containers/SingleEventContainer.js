import { connect } from 'react-redux'
import SingleEvent from '../components/events/SingleEvent'
import getTranslation from '../i18n/'

const mapStateToProps = (state, ownProps) => {

    let event = state.events.filter(event => event.id === Number(ownProps.match.params.id));
    const notfound = ((event.length > 0) ? false : true)

    if(!notfound) {
        event = event[0]
        let country;
        let temp_country = state.countries.filter(country => country.id ===  Number(event.country))
        if(temp_country.length > 0) {
            country = temp_country[0].label;
        }
        event.countryname = getTranslation(country);
    }
    
  return {
    user: state.user,
    event: event,
    id: ownProps.match.params.id,
    pages: state.pages,
    countries: state.countries,
    language: state.language,
    fetching: state.fetching
  }
}

const SingleEventContainer = connect(
  mapStateToProps,
)(SingleEvent)

export default SingleEventContainer
