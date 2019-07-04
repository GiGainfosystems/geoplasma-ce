import 'core-js/fn/string/starts-with'
import "babel-polyfill"
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppContainer from './containers/AppContainer';
import ContributeContainer from './containers/ContributeContainer';
import ContributeOverviewContainer from './containers/ContributeOverviewContainer';
import AddEventFormContainer from './containers/AddEventFormContainer';
import AddContentContainer from './containers/AddContentContainer';
import EditContentContainer from './containers/EditContentContainer';
import ProfileFormContainer from './containers/ProfileFormContainer';
import YellowPagesContainer from './containers/YellowPagesContainer';
import KnowledgeRepositoryContainer from './containers/KnowledgeRepositoryContainer';
import SingleKnowledgeContainer from './containers/SingleKnowledgeContainer';
import ConfirmAccountContainer from './containers/ConfirmAccountContainer';
import ForgotPasswordContainer from './containers/ForgotPasswordContainer';
import ResetPasswordContainer from './containers/ResetPasswordContainer';
import SuperuserContainer from './containers/SuperuserContainer';
import EventsContainer from './containers/EventsContainer';
import SingleEventContainer from './containers/SingleEventContainer';
import HomepageContainer from './containers/HomepageContainer';
import SingleProfileContainer from './containers/SingleprofileContainer';
import GlossaryFormContainer from './containers/GlossaryFormContainer';
import PageFormContainer from './containers/PageFormContainer';
import SiteContentFormContainer from './containers/SiteContentContainer';
import ContentPageContainer from './containers/ContentPageContainer';
import GlossaryPageContainer from './containers/GlossaryPageContainer';
import MyDataContainer from './containers/MyDataContainer';
import WebGisContainer from './containers/WebGisContainer';
import NotesFormContainer from './containers/NotesFormContainer';
import ContactFormContainer from './containers/ContactFormContainer'
import UnitFormContainer from './containers/UnitFormContainer'
import ExamplesFormContainer from './containers/ExamplesFormContainer'
//import registerServiceWorker from './registerServiceWorker';
import Cookies from 'universal-cookie';

import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'

import { Provider } from 'react-redux'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'

import { language } from './reducers/language'
import { categories } from './reducers/categories'
import { user } from './reducers/user'
import { events } from './reducers/events'
import { fetching } from './reducers/fetching'
import { superuser } from './reducers/superuser'
import { content } from './reducers/content'
import { userprofiles } from './reducers/userprofiles'
import { pilotareas } from './reducers/pilotareas'
import { topics } from './reducers/topics'
import { countries } from './reducers/countries'
import { tags } from './reducers/tags'
import { glossary } from './reducers/glossary'
import { pages } from './reducers/pages'
import { contacts } from './reducers/contacts'
import { filter } from './reducers/filter'
import { sitecontent } from './reducers/sitecontent'
import { webgis } from './reducers/webgis'
import { report } from './reducers/report'
import { localcontacts } from './reducers/localcontacts'
import { query } from './reducers/query'
import { links } from './reducers/links'
import { measurements } from './reducers/measurements'
import { units } from './reducers/units'
import { examples } from './reducers/examples'
import { explanatorynotes } from './reducers/explanatory_notes'
import { professionalgroups } from './reducers/professionalgroups'
import { getAllData, getLayers, changeLanguage, getTags, getSiteContent, getPages, getGlossary, checkIfLoggedIn, getEvents, getContent, getUserprofiles, getPilotareas, getProfessionalgroups, getThematicCoverages } from './actions'
import ReactGA from 'react-ga'

var disableStr = 'ga-disable-' + 'UA-108798631-1';
if (document.cookie.indexOf(disableStr + '=true') > -1) {
  window[disableStr] = true;
}

ReactGA.initialize('UA-108798631-1');
ReactGA.set({ anonymizeIp: true });
function logPageView() {

    window.scrollTo(0,0);
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);

  return null;
}

const cookies = new Cookies();
const history = createHistory();
const middleware = routerMiddleware(history)

// Check if local language was set already
let locale = cookies.get('locale');
// If Locale setting cannot be found in cookie, set english as default language and save in cookie
if(!locale) {
    let browser_language = navigator.language || navigator.userLanguage;

    let acceptedLanguages = ["cs", "de", "en", "pl", "sk", "sl"];
    let checkForAcceptedLanguage = acceptedLanguages.filter(language => language === browser_language);
    if(checkForAcceptedLanguage.length === 0) {
      locale = 'en';
    }
    else {
       locale = browser_language;
    }
    cookies.set('locale', locale, { path: '/'});
}

let store = createStore(combineReducers({
      language,
      categories,
      user,
      events,
      fetching,
      superuser,
      content,
      userprofiles,
      pilotareas,
      professionalgroups,
      topics,
      countries,
      tags,
      glossary,
      pages,
      sitecontent,
      webgis,
      report,
      filter,
      explanatorynotes,
      contacts,
      query,
      localcontacts,
      measurements,
      units,
      links,
      examples,
    router: routerReducer
}),
    applyMiddleware(middleware, ReduxThunk)
);
window.store = store;
store.dispatch(getAllData())
store.dispatch(changeLanguage(locale))

let token = cookies.get('token');
if(token) {
    store.dispatch(checkIfLoggedIn(token))
} 

store.dispatch(getThematicCoverages())

ReactDOM.render(
  <Provider store={store}>
      <ConnectedRouter history={history}>

        <div>
            <Route path="/" component={logPageView} />
            <Route exact path="/" component={HomepageContainer} />
          <Route exact path="/content/:url" component={ContentPageContainer} />
          <Route exact path="/glossary" component={GlossaryPageContainer} />
          <Route exact path="/experts" component={AppContainer} />
          <Route exact path="/experts/contribute/overview" component={ContributeOverviewContainer} />
          <Route exact path="/experts/contribute/mydata" component={MyDataContainer} />
          <Route exact path="/experts/contribute/event" component={AddEventFormContainer} />
          <Route exact path="/experts/contribute/event/:id" component={AddEventFormContainer} />
          <Route exact path="/experts/contribute/content" component={AddContentContainer} />
          <Route exact path="/experts/contribute/content/:id" component={EditContentContainer} />
          <Route exact path="/experts/contribute/profile" component={ProfileFormContainer} />
          <Route exact path="/experts/contribute" component={ContributeContainer} />
          <Route path="/experts/confirm-account/:confirmationCode?/:email?" component={ConfirmAccountContainer} />
          <Route path="/experts/forgot-password" component={ForgotPasswordContainer} />
          <Route path="/experts/reset-password/:token?/:email?" component={ResetPasswordContainer} />
          <Route exact path="/experts/yellow-pages" component={YellowPagesContainer} />
          <Route exact path="/experts/yellow-pages/:id" component={SingleProfileContainer} />
          <Route exact path="/experts/yellow-pages/page/:page" component={YellowPagesContainer} />
          <Route exact path="/experts/events" component={EventsContainer} />
          <Route exact path="/experts/events/:id" component={SingleEventContainer} />
          <Route exact path="/experts/knowledge-repository" component={KnowledgeRepositoryContainer} />
          <Route exact path="/experts/knowledge-repository/:id" component={SingleKnowledgeContainer} />
          <Route exact path="/experts/knowledge-repository/page/:page" component={KnowledgeRepositoryContainer} />
          <Route exact path="/experts/superuser" component={SuperuserContainer} />
          <Route exact path="/experts/superuser/page" component={PageFormContainer} />
          <Route exact path="/experts/superuser/page/:id" component={PageFormContainer} />
          <Route exact path="/experts/superuser/pagecontent/:page" component={SiteContentFormContainer} />
          <Route exact path="/experts/superuser/pagecontent/:page/:id" component={SiteContentFormContainer} />
          <Route exact path="/experts/superuser/glossary" component={GlossaryFormContainer} />
          <Route exact path="/experts/superuser/glossary/:id" component={GlossaryFormContainer} />
          <Route exact path="/experts/superuser/notes/:id" component={NotesFormContainer} />
          <Route exact path="/experts/superuser/notes" component={NotesFormContainer} />
          <Route exact path="/experts/superuser/unit" component={UnitFormContainer} />
          <Route exact path="/experts/superuser/unit/:id" component={UnitFormContainer} />
          <Route exact path="/experts/superuser/examples" component={ExamplesFormContainer} />
          <Route exact path="/experts/superuser/examples/:id" component={ExamplesFormContainer} />
          <Route exact path="/experts/superuser/contact" component={ContactFormContainer} />
          <Route exact path="/experts/superuser/contact/:id" component={ContactFormContainer} />

          <Route exact path="/webgis/:area" component={WebGisContainer} />
          <Route exact path="/webgis/:area/report/:lat/:lng" component={WebGisContainer} />
        </div>
      </ConnectedRouter>
  </Provider>, document.getElementById('root'));
//registerServiceWorker();
