import { connect } from 'react-redux'
import Superuser from '../components/admin/Superuser'
import { updateLinks, uploadAreas, updateFieldmeasurements, saveNote, addLayers, updatePilotarea, readExcelFile, getLayers, loadSuperuserData, removeSiteContent, removePage, savePage, saveSiteContent, removeEventSuperuser, removeContentSuperuser, changeUserDetailsSuperuser, signOut } from '../actions'

const mapStateToProps = (state) => {
  return {
    categories: state.language,
    user: state.user,
    events: state.events,
    superuser: state.superuser,
    fetching: state.fetching,
    glossary: state.glossary.entries,
    contents: state.content,
    pages: state.pages,
    sitecontent: state.sitecontent,
    language: state.language,
    pilotareas: state.pilotareas,
    layers: state.webgis,
    explanatorynotes: state.explanatorynotes.notes,
    localcontacts: state.localcontacts,
    units: state.units,
    examples: state.examples
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
            dispatch(removePage(id, token))
        },
        saveSiteContent: (id, activated, page_id, title, title_de, title_cz, title_pl, title_sk, title_sl, text, text_de, text_cz, text_pl, text_sk, text_sl, position, token) => {
            dispatch(saveSiteContent(id, activated, page_id, title, title_de, title_cz, title_pl, title_sk, title_sl, text, text_de, text_cz, text_pl, text_sk, text_sl, position, token))
        },
        removeSiteContent: (id, token) => {
            dispatch(removeSiteContent(id, token))
        },
        getLayers: (area) => {
            dispatch(getLayers(area))
        },
        readExcelFile: (area, token, layers) => {
            dispatch(readExcelFile(area, token, layers))
        },
        saveNote: (id, key, explanatory_note, layer_description, token) => {
            dispatch(saveNote(id, key, explanatory_note, layer_description, token))
        },
        addLayers: (area, token, layers) => {
            dispatch(addLayers(area, token, layers))
        },
        updatePilotarea: (id, contact_details, excel_identifier, uri, ne_corner, sw_corner, description_en, description_de, description_cs, description_pl, description_sk, description_sl, token) => {
            dispatch(updatePilotarea(id, contact_details, excel_identifier, uri, ne_corner, sw_corner,  description_en, description_de, description_cs, description_pl, description_sk, description_sl, token))
        },
        signOut: () => {
            dispatch(signOut())
        },
        uploadAreas: (token) => {
            dispatch(uploadAreas(token))
        },
        updateLinks: (token) => {
            dispatch(updateLinks(token))
        },
        updateFieldmeasurements: (area, token) => {
            dispatch(updateFieldmeasurements(area, token))
        },
    }
}

const SuperuserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Superuser)

export default SuperuserContainer
