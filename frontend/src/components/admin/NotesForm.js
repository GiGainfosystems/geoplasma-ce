import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import './Superuser.css'
import getTranslation from '../../i18n/'

/**
 * The form to add / edit explanatory notes for the web GIS layers
 */
class NotesForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            active: 'notes',
            id: 0,
            key: '',
            explanatory_note: '',
            explanatory_note_de: '',
            explanatory_note_cz: '',
            explanatory_note_pl: '',
            explanatory_note_sk: '',
            explanatory_note_sl: '',
            layer_description: '',
            layer_description_de: '',
            layer_description_cz: '',
            layer_description_pl: '',
            layer_description_sk: '',
            layer_description_sl: '',
            errors: [],
            required: [
                "keyword"
            ],
            deleteButton: false,
            deleteButtonExpanded: false
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

        let errors = this.state.errors;

        if(this.state.required.indexOf(name) !== -1) {
            if(value === '') {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }

        this.setState({ [name] : value, errors: errors });
    }

    /**
     * Submit the form and save the explanatory note
     * by dispatching the saveNote action with the form state and the JWT token
     */
    submitForm() {
        let errorMessages = [];
        let errors = this.state.errors;
        let required = [];
        this.state.required.map(field => {
            if(this.state[field] === '') {
                required.push(field);
                errors[field] = true;
            }

        })

        if(required.length > 0) {
            errorMessages.push("forms.general.error.message.fields_required");
        }

        let redirect = false;
         if(errorMessages.length === 0) {
             const token = this.props.cookies.token;
             redirect = true;

            this.props.saveNote(this.state.id, this.state.key, this.state.explanatory_note, this.state.explanatory_note_de, this.state.explanatory_note_cz, this.state.explanatory_note_pl, this.state.explanatory_note_sk, this.state.explanatory_note_sl, this.state.layer_description, this.state.layer_description_de, this.state.layer_description_cz, this.state.layer_description_pl, this.state.layer_description_sk, this.state.layer_description_sl, token)
            this.setState({redirect: redirect, errors: errors, errorMessages: errorMessages })
        }

    }

    updateProps(nextProps) {

        let filter = nextProps.explanatorynotes.filter(entry => entry.id === Number(nextProps.id));
        if(filter.length > 0) {
            filter = filter[0];
            this.setState({
                id: filter.id,
                key: filter.key,
                layer_description: filter.layer_description,
                layer_description_de: filter.layer_description_de,
                layer_description_cz: filter.layer_description_cz,
                layer_description_pl: filter.layer_description_pl,
                layer_description_sk: filter.layer_description_sk,
                layer_description_sl: filter.layer_description_sl,
                explanatory_note: filter.explanatory_note,
                explanatory_note_de: filter.explanatory_note_de,
                explanatory_note_cz: filter.explanatory_note_cz,
                explanatory_note_pl: filter.explanatory_note_pl,
                explanatory_note_sk: filter.explanatory_note_sk,
                explanatory_note_sl: filter.explanatory_note_sl,
            })
        }

    }

    componentWillReceiveProps(nextProps) {

        if(Number(nextProps.id) !== 0) {
            this.updateProps(nextProps);
        }
    }
    
    /**
     * Toggle the delete buttons
     */
    toggleDelete() {
        this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
    }

    render() {

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
                        <label className="centered">Key:{this.state.errors.key && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.key ? 'v-error' : 'v-check')} name="key" type="text" value={this.state.key} placeholder="Enter the key here.." onChange={(event) => this.updateField(event)} />

                      </div>


                      <div className="form-item">
                        <label className="centered">Explanatory note:</label>
                        <textarea name="explanatory_note" rows="8" value={this.state.explanatory_note} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Explanatory note DE:</label>
                        <textarea name="explanatory_note_de" rows="8" value={this.state.explanatory_note_de} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Explanatory note CZ:</label>
                        <textarea name="explanatory_note_cz" rows="8" value={this.state.explanatory_note_cz} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Explanatory note PL:</label>
                        <textarea name="explanatory_note_pl" rows="8" value={this.state.explanatory_note_pl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Explanatory note SK:</label>
                        <textarea name="explanatory_note_sk" rows="8" value={this.state.explanatory_note_sk} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Explanatory note SL:</label>
                        <textarea name="explanatory_note_sl" rows="8" value={this.state.explanatory_note_sl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Layer description:</label>
                        <textarea name="layer_description" rows="8" value={this.state.layer_description} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Layer description DE:</label>
                        <textarea name="layer_description_de" rows="8" value={this.state.layer_description_de} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Layer description CZ:</label>
                        <textarea name="layer_description_cz" rows="8" value={this.state.layer_description_cz} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Layer description PL:</label>
                        <textarea name="layer_description_pl" rows="8" value={this.state.layer_description_pl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Layer description SK:</label>
                        <textarea name="layer_description_sk" rows="8" value={this.state.layer_description_sk} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Layer description SL:</label>
                        <textarea name="layer_description_sl" rows="8" value={this.state.layer_description_sl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>


                      <div className="user-profile-item">
                      <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>Save note</button>
                      <Link to="/experts/contribute/overview"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>

                      </div>


                  </div>
                  </div>
              </div>
            </div>
            </div>
        )
    }
}

export default NotesForm
