import { connect } from 'react-redux'
import SingleProfile from '../components/yellowpages/SingleProfile'
import getTranslation from '../i18n/'
import { sendMessage } from '../actions'

const mapStateToProps = (state, ownProps) => {

    let profile = state.userprofiles.profiles.filter(profile => ((Number(profile.id) === Number(ownProps.match.params.id))) && (profile.activated));
    const notfound = ((profile.length > 0) ? false : true)

    if(!notfound) {
        profile = profile[0];
        let occupations = [];
        let pilot_area
        let country;

        if(Number(profile.pilot_area) === 0) {
            pilot_area = "userprofile.form.pilot_area.not_in_pilotarea"
        } else {
            let temp_area = state.pilotareas.filter(area => area.id ===  Number(profile.pilot_area));
            if(temp_area.length > 0) {
                pilot_area = temp_area[0].name;
            }
        }

        let temp_country = state.countries.filter(country => country.id ===  Number(profile.country))
        if(temp_country.length > 0) {
            country = temp_country[0].label;
        }

        profile.occupation.map((group, index) => {
            if(group !== 0) {
                let temp = state.professionalgroups.filter(pgroup => pgroup.id === group);
                if(temp.length > 0) {
                    occupations.push(getTranslation(temp[0].name));
                }

          }
      })
          profile.groups = occupations;
          profile.area = pilot_area;
          profile.countryname = country;
    }

  return {
    user: state.user,
    profile: profile,
    notfound: notfound,
    id: ownProps.match.params.id,
    pages: state.pages,
    language: state.language,
    fetching: state.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (contactemail, name, email, topic, message) => {
            dispatch(sendMessage(contactemail, name, email, topic, message))
        }
    }
}

const SingleProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleProfile)

export default SingleProfileContainer
