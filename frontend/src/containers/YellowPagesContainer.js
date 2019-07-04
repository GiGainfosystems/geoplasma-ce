import { connect } from 'react-redux'
import YellowPages from '../components/yellowpages/YellowPages'
import { sendMessage, updateYellowPagesFilter } from '../actions'
import { filterCategories, buildFilterbox } from '../components/filterbox/filterhelper'
import getTranslation from '../i18n/'

const mapStateToProps = (state, ownProps) => {

    let profiles = state.userprofiles.profiles

    if(profiles.length > 0) {

        let active = profiles.filter(profile => profile.activated === true);

        profiles = filterCategories(active, state.filter.profiles)

        profiles.map(profile => {
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
              profile.groups = occupations;
              profile.area = pilot_area;
              profile.countryname = country;
          })
        })
    }

  return {
    user: state.user,
    userprofiles: profiles,
    professionalgroups: state.professionalgroups,
    pilotareas: state.pilotareas,
    countries: state.countries,
    pages: state.pages,
    language: state.language,
    fetching: state.fetching,
    filter: state.filter.profiles,
    page: Number(ownProps.match.params.page-1)
  }
}


const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (contactemail, name, email, topic, message) => {
            dispatch(sendMessage(contactemail, name, email, topic, message))
        },
        updateYellowPagesFilter: (filter) => {
            dispatch(updateYellowPagesFilter(filter))
        },
    }
}


const YellowPagesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(YellowPages)

export default YellowPagesContainer
