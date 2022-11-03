import { connect } from 'react-redux'
import PageForm from '../components/admin/PageForm'
import {
    loadSuperuserData,
    removeSiteContent,
    savePage,
    saveSiteContent,
    removeEventSuperuser,
    removeContentSuperuser,
    changeUserDetailsSuperuser,
    signOut,
    deleteCookie
} from '../actions'

const mapStateToProps = (state, ownProps) => {

    let page = undefined;
    if(ownProps.match.params.id) {
        page = state.pages.find(page => page.id == ownProps.match.params.id)
    }

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
    language: state.language,
    page,
    cookies: state.cookies.values
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
        savePage: (id, title, title_de, title_cs, title_pl, title_sk, title_sl, navigation, url, token) => {
            dispatch(savePage(id, title, title_de, title_cs, title_pl, title_sk, title_sl, navigation, url, token))
        },
        removePage: (id, token) => {
            dispatch(savePage(id, token))
        },
        saveSiteContent: (id, activated, page_id, title, text, position, token) => {
            dispatch(saveSiteContent(id, activated, page_id, title, text, position, token))
        },
        removeSiteContent: (id, token) => {
            dispatch(removeSiteContent(id, token))
        },
        signOut: () => {
            dispatch(signOut())
            dispatch(deleteCookie('token'))
        }
    }
}

const PageFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageForm)

export default PageFormContainer
