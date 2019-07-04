import { connect } from 'react-redux'
import SiteContentForm from '../components/admin/SiteContentForm'
import { loadSuperuserData, removeSiteContent, removePage, savePage, saveSiteContent, removeEventSuperuser, removeContentSuperuser, changeUserDetailsSuperuser, signOut } from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.language,
    user: state.user,
    events: state.events,
    superuser: state.superuser,
    fetching: state.fetching,
    glossary: state.glossary,
    contents: state.content,
    pages: state.pages,
    sitecontent: state.sitecontent,
    page: ownProps.match.params.page,
    id: ownProps.match.params.id,
    language: state.language,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSuperuserData: (token) => {
            dispatch(loadSuperuserData(token))
        },
        changeUserDetailsSuperuser: (id, username, email, confirmed, projectpartner, deactivated, token) => {
            dispatch(changeUserDetailsSuperuser(id, username, email, confirmed, projectpartner, deactivated, token))
        },
        removeContentSuperuser: (id, token) => {
            dispatch(removeContentSuperuser(id, token))
        },
        removeEventSuperuser: (id, token) => {
            dispatch(removeEventSuperuser(id, token))
        },
        saveSiteContent: (id, activated, page_id, title, title_de, title_cz, title_pl, title_sk, title_sl, text, text_de, text_cz, text_pl, text_sk, text_sl, position, token) => {
            dispatch(saveSiteContent(id, activated, page_id, title, title_de, title_cz, title_pl, title_sk, title_sl, text, text_de, text_cz, text_pl, text_sk, text_sl, position, token))
        },
        removeSiteContent: (id, token) => {
            dispatch(removeSiteContent(id, token))
        },
        signOut: () => {
            dispatch(signOut())
        }
    }
}

const SiteContentFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteContentForm)

export default SiteContentFormContainer
