import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import './Superuser.css'
import getTranslation from '../../i18n/'
import Select from 'react-select';

/**
 * The form to create / edit contacts (local contacts on the landing page)
 */
class ContactForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            active: 'notes',
            id: 0,
            contactinfo: '',
            pilotarea: '',
            language: '',
        }
    }

    componentDidMount() {

        if(Number(this.props.id) !== 0) {
          this.updateProps(this.props);
        }
        if(!this.props.user.superuser) {
            this.setState({redirect: true})
        }
    }

    /**
     * Update the field state on input
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({ [name] : value });
    }

    /**
     * Submit the form by calling the saveLocalContact action with the form state + token
     */
    submitForm() {
        const token = this.props.cookies.token;
        this.props.saveLocalContact(this.state.id, this.state.language, this.state.pilotarea, this.state.contactinfo, token)
        this.setState({redirect: true })
    }

    updateProps(nextProps) {

        let filter = nextProps.localcontacts.filter(contact => contact.id === Number(nextProps.id));
        if(filter.length > 0) {
            filter = filter[0];
            this.setState({
                id: filter.id,
                language: filter.language,
                pilotarea: filter.pilotarea,
                contactinfo: filter.contactinfo
            })
        }

    }

    /**
     * Change the selected pilot area (custom select field)
     * @param  {} value
     */
    changePilotArea(value) {
        this.setState({pilotarea: value.value})
    }

    componentWillReceiveProps(nextProps) {

        if(Number(nextProps.id) !== 0) {
            this.updateProps(nextProps);
        }
    }

    render() {
        let pilotareas = [];

        this.props.pilotareas.map(area =>
            pilotareas.push({
                value: area.id,
                label: getTranslation(area.name)
            })
        )
        return(

            <div>
            {this.state.redirect &&
                <Redirect to="/experts/superuser" />
            }
              <Header />
              <div className="container container-small">
                <Subheader title="expert.subheader.title.contribute" />
                <div className="default-element">

                  <div className="default-element-content">
                  <h4><i className="fa fa-calendar" aria-hidden="true"></i> Glossary entry</h4>

                  <div className="user-profile form-container">

                      <div className="form-item">
                        <label className="centered">Language:</label>
                        <input name="language" type="text" value={this.state.language} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Pilotarea:</label>
                        <Select
                    name="pilot_area"
                    value={Number(this.state.pilotarea)}
                    options={pilotareas}
                    clearable={false}
                    onChange={(value) => this.changePilotArea(value)}
                  />
                      </div>


                      <div className="form-item">
                        <label className="centered">Contactinfo:</label>
                        <textarea name="contactinfo" rows="8" value={this.state.contactinfo} onChange={(event) => this.updateField(event)}></textarea>
                      </div>


                      <div className="user-profile-item">
                      <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>Save contact info</button>
                     

                      </div>


                  </div>
                  </div>
              </div>
            </div>
            </div>
        )
    }
}

export default ContactForm
