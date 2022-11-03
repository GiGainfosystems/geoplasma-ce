import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect } from 'react-router-dom'
import UserList from './UserList'
import ContentList from './ContentList'
import GlossaryList from './GlossaryList'
import NotesList from './NotesList'
import EventList from './EventList'
import PagesListContainer from "../../containers/PagesListContainer";
import LayerControl from './LayerControl'
import AreasList from './AreasList'
import ContactList from './ContactsList'
import UnitList from './UnitList'
import FieldMeasurementsContainer from "../../containers/FieldMeasurementsContainer";
import Links from './Links';
import ExamplesList from './ExamplesList'
import './Superuser.css'

/**
 * Dashboard for the admin of the web-portal
 * From this component, all options that can be changed by the admin can be reached
 */
class Superuser extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, active: 'settings'}
    }

    componentDidMount() {

        const token = this.props.cookies.token;
        if(this.props.user.superuser) {
            this.props.loadSuperuserData(token);
        } else {
            this.setState({redirect: true})
        }
    }

    /**
     * Change the active tab
     * @param  {} tab - New active tab
     */
    changeTab(tab) {
        this.setState({active: tab});
    }
    
    /**
     * Logout from the web portal
     */
    logOut() {
        this.props.deleteCookie('token');
        this.props.signOut();
        this.setState({redirect: true});
    }

    render() {
        return(
            <div>
            {this.state.redirect &&
                <Redirect to="/experts/contribute" />
            }
              <Header />
              <div className="container container-small">
                <Subheader title="expert.subheader.title.contribute" />
                <div className="default-element">

                  <div className="default-element-content">
                    <ul className="superuser-navigation">
                        <li onClick={() => this.changeTab('settings')} className={(this.state.active === 'settings' ? 'active' : 'not-active')}>Settings</li>
                        <li onClick={() => this.changeTab('content')} className={(this.state.active === 'content' ? 'active' : 'not-active')}>Content</li>
                        <li onClick={() => this.changeTab('glossary')} className={(this.state.active === 'glossary' ? 'active' : 'not-active')}>Glossary</li>
                        <li onClick={() => this.changeTab('users')} className={(this.state.active === 'users' ? 'active' : 'not-active')}>Users</li>
                        <li onClick={() => this.changeTab('knowledge')} className={(this.state.active === 'knowledge' ? 'active' : 'not-active')}>Knowl. Repo</li>
                        <li onClick={() => this.changeTab('events')} className={(this.state.active === 'events' ? 'active' : 'not-active')}>Events</li>
                        <li onClick={() => this.changeTab('areas')} className={(this.state.active === 'areas' ? 'active' : 'not-active')}>Areas</li>
                        <li onClick={() => this.changeTab('layers')} className={(this.state.active === 'layers' ? 'active' : 'not-active')}>Layers</li>
                        <li onClick={() => this.changeTab('notes')} className={(this.state.active === 'notes' ? 'active' : 'not-active')}>Notes</li>
                        <li onClick={() => this.changeTab('fieldmeasurements')} className={(this.state.active === 'fieldmeasurements' ? 'active' : 'not-active')}>Field measurements</li>
                        <li onClick={() => this.changeTab('units')} className={(this.state.active === 'units' ? 'active' : 'not-active')}>Units</li>
                        <li onClick={() => this.changeTab('links')} className={(this.state.active === 'links' ? 'active' : 'not-active')}>Links</li>
                        <li onClick={() => this.changeTab('examples')} className={(this.state.active === 'examples' ? 'active' : 'not-active')}>Examples</li>
                        <li onClick={() => this.logOut()}>Logout</li>
                    </ul>

                    {this.state.active === 'users' &&
                        <UserList fetching={this.props.fetching} users={this.props.superuser.users} changeUserDetailsSuperuser={this.props.changeUserDetailsSuperuser} />
                    }

                    {this.state.active === 'knowledge' &&
                        <ContentList fetching={this.props.fetching} contents={this.props.contents} removeContentSuperuser={this.props.removeContentSuperuser} />
                    }

                    {this.state.active === 'glossary' &&
                        <GlossaryList fetching={this.props.fetching} users={this.props.superuser.users} glossary={this.props.glossary} />
                    }

                    {this.state.active === 'events' &&
                        <EventList fetching={this.props.fetching} users={this.props.superuser.users} events={this.props.events} removeEventSuperuser={this.props.removeEventSuperuser} />
                    }

                    {this.state.active === 'content' &&
                        <PagesListContainer removePage={this.props.removePage} fetching={this.props.fetching} users={this.props.superuser.users} pages={this.props.pages} sitecontent ={this.props.sitecontent} removeEventSuperuser={this.props.removeEventSuperuser} />
                    }

                    {this.state.active === 'areas' &&
                        <AreasList uploadAreas={this.props.uploadAreas} updateArea={this.props.updatePilotarea} fetching={this.props.fetching} pilotareas={this.props.pilotareas} />
                    }

                    {this.state.active === 'layers' &&
                        <LayerControl addLayers={this.props.addLayers} fetching={this.props.fetching} readExcelFile={this.props.readExcelFile} getLayers={this.props.getLayers} pilotareas={this.props.pilotareas} layers={this.props.layers} />
                    }
                    {this.state.active === 'notes' &&
                        <NotesList explanatorynotes={this.props.explanatorynotes} fetching={this.props.fetching} saveNote={this.props.saveNote} />
                    }
                    {this.state.active === 'settings' &&
                        <ContactList contacts={this.props.localcontacts} />
                    }
                    {this.state.active === 'fieldmeasurements' &&
                        <FieldMeasurementsContainer updateFieldmeasurements={this.props.updateFieldmeasurements} fetching={this.props.fetching} pilotareas={this.props.pilotareas} />
                    }
                    {this.state.active === 'units' &&
                        <UnitList units={this.props.units} />
                    }
                    {this.state.active === 'links' &&
                        <Links updateLinks={this.props.updateLinks} links={this.props.links} />
                    }
                    {this.state.active === 'examples' &&
                        <ExamplesList examples={this.props.examples} />
                    }
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default Superuser
