import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import './Superuser.css'
import getTranslation from '../../i18n/'

/**
 * This component gives the superuser the possibility to create,
 * edit and delete entries for the glossary
 */
class GlossaryForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /** Redirect to the glossary overview after entry is deleted */
            redirect: false,
            /** ID of the selected entry, 0 = no entry selected */
            id: 0,
            /** Form state */
            keyword: '',
            keyword_de: '',
            keyword_pl: '',
            keyword_cz: '',
            keyword_sk: '',
            keyword_sl: '',
            synonyms: '',
            synonyms_de: '',
            synonyms_pl: '',
            synonyms_cz: '',
            synonyms_sk: '',
            synonyms_sl: '',
            definition: '',
            definition_de: '',
            definition_pl: '',
            definition_cz: '',
            definition_sl: '',
            definition_sk: '',
            link: '',
            basic: '',
            errors: [],
            /** List the required fields which are needed to create a new entry */
            required: [
                "keyword", "definition"
            ],
            /** Will a delete button be shown - set to true if a glossary entry is given with the props */
            deleteButton: false,
            /** Toggle for the confirm delete buttons */
            deleteButtonExpanded: false
        }
    }

    /**
    * Function will fire when the component was mounted, it checks if an ID was given via props
    * and if a superuser is identified / authorized
    */
    componentDidMount() {
        /* If an ID is given to the component, update the state via updateProps */
        if(Number(this.props.id) !== 0) {
          this.updateProps(this.props);
        }
        /** If a superuser is not authorized, activate redirect to contribute page */
        if(!this.props.user.superuser) {
            this.setState({redirect: true})
        }
    }

    /**
     * Update the form state based on the change in the inputs
     *@param {integer} event - the change event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        let errors = this.state.errors;
        /* Check if the field that was changed is a required one */
        if(this.state.required.indexOf(name) !== -1) {
            /* If it is required set the error for this field */
            if(value === '') {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }
        this.setState({ [name] : value, errors: errors });
    }

    /**
     * Sub mit the form to edit an existing or create a new entry for the glossary
     * It uses the addGlossary action via props (GlossaryFormContainer)
     */
    submitForm() {
        let errorMessages = [];
        let errors = this.state.errors;
        let required = [];
        /** Check if all required fields are filled */
        this.state.required.map(field => {
            if(this.state[field] === '') {
                required.push(field);
                errors[field] = true;
            } else if ((field === 'topics') && (this.state.topics.filter(topic => topic === 0).length > 2)) {
                required.push(field);
                 errors[field] = true;
            }

        })
        /** Push error message when not all required fields are filled */
        if(required.length > 0) {
            errorMessages.push("forms.general.error.message.fields_required");
        }

        let redirect = false;
        /** If no error was found, save entry */
        if(errorMessages.length === 0) {
            /** Get token for authorization from cookies */
            const token = this.props.cookies.token;
            /** User will be redirect to the glossary list after saving the entry */
            redirect = true;

            this.props.addGlossary(this.state.id, this.state.keyword, this.state.keyword_de, this.state.keyword_pl, this.state.keyword_cz, this.state.keyword_sk, this.state.keyword_sl, this.state.synonyms, this.state.synonyms_de, this.state.synonyms_pl, this.state.synonyms_cz, this.state.synonyms_sk, this.state.synonyms_sl, this.state.link, this.state.definition, this.state.definition_de, this.state.definition_cz, this.state.definition_pl, this.state.definition_sl, this.state.definition_sk, this.state.basic, token)
            this.setState({redirect: redirect, errors: errors, errorMessages: errorMessages })
        }
    }

    /**
    * Maps new props to the local state of the component
    *@param {object} nextProps - the object containing the new props that will be mapped
    */
    updateProps(nextProps) {
        /** Checks if the given ID can be found in a glossary entry */
        let filter = nextProps.glossary.filter(entry => entry.id === Number(nextProps.id));
        /** If a glossary for the ID was found, map the other props
            containing the glossary entry to the local state */
        if(filter.length > 0) {
            filter = filter[0];
            this.setState({
                id: filter.id,
                keyword: filter.keyword,
                keyword_de: filter.keyword_de,
                keyword_pl: filter.keyword_pl,
                keyword_cz: filter.keyword_cz,
                keyword_sk: filter.keyword_sk,
                keyword_sl: filter.keyword_sl,
                synonyms: filter.synonyms,
                synonyms_de: filter.synonyms_de,
                synonyms_pl: filter.synonyms_pl,
                synonyms_cz: filter.synonyms_cz,
                synonyms_sk: filter.synonyms_sk,
                synonyms_sl: filter.synonyms_sl,
                link: filter.link,
                definition: filter.definition,
                definition_de: filter.definition_de,
                definition_pl: filter.definition_pl,
                definition_cz: filter.definition_cz,
                definition_sl: filter.definition_sl,
                definition_sk: filter.definition_sk,
                basic: filter.basic,
                deleteButton: true
            })
        }

    }

    /**
    * This function fires if the props are updated
    * (e.g. neccessary for delayed ajax request response)
    */
    componentWillReceiveProps(nextProps) {
        /** If an ID was found in the new props, call the updateProps function to
            map the new props to the local state */
        if(Number(nextProps.id) !== 0) {
            this.updateProps(nextProps);
        }
    }

    /**
    * Toggle the delete confirm button via the according state value
    */
    toggleDelete() {
        this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
    }

    /**
    * Actually remove the glossary entry that is identified via its ID
    */
    removeGlossary() {
        const token = this.props.cookies.token;
        this.props.removeGlossary(this.props.id, token);
        this.setState({redirect: true})
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
                        <label className="centered">Keyword:{this.state.errors.keyword && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.keyword ? 'v-error' : 'v-check')} name="keyword" type="text" value={this.state.keyword} placeholder="Enter the keyword here.." onChange={(event) => this.updateField(event)} />

                      </div>

                      <div className="form-item">
                        <label className="centered">Keyword DE:</label>
                        <input name="keyword_de" type="text" value={this.state.keyword_de} placeholder="Enter the keyword here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Keyword PL:</label>
                        <input name="keyword_pl" type="text" value={this.state.keyword_pl} placeholder="Enter the keyword here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Keyword CZ:</label>
                        <input name="keyword_cz" type="text" value={this.state.keyword_cz} placeholder="Enter the keyword here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Keyword SK:</label>
                        <input name="keyword_sk" type="text" value={this.state.keyword_sk} placeholder="Enter the keyword here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Keyword SL:</label>
                        <input name="keyword_sl" type="text" value={this.state.keyword_sl} placeholder="Enter the keyword here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Synonyms:{this.state.errors.synonyms && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.synonyms ? 'v-error' : 'v-check')} name="synonyms" type="text" value={this.state.synonyms} placeholder="Enter some synonyms here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Synonyms DE:</label>
                        <input name="synonyms_de" type="text" value={this.state.synonyms_de} placeholder="Enter some synonyms here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Synonyms CZ:</label>
                        <input name="synonyms_cz" type="text" value={this.state.synonyms_cz} placeholder="Enter some synonyms here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Synonyms PL:</label>
                        <input name="synonyms_pl" type="text" value={this.state.synonyms_pl} placeholder="Enter some synonyms here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Synonyms SK:</label>
                        <input name="synonyms_sk" type="text" value={this.state.synonyms_sk} placeholder="Enter some synonyms here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Synonyms SL:</label>
                        <input name="synonyms_sl" type="text" value={this.state.synonyms_sl} placeholder="Enter some synonyms here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Link:{this.state.errors.link && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.link ? 'v-error' : 'v-check')} name="link" type="text" value={this.state.link} placeholder="Enter a link here.." onChange={(event) => this.updateField(event)} />

                      </div>

                      <div className="form-item">
                        <label className="centered">Definition:{this.state.errors.definition && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <textarea className={(this.state.errors.definition ? 'v-error' : 'v-check')} name="definition" rows="8" value={this.state.definition} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Definition DE:</label>
                        <textarea name="definition_de" rows="8" value={this.state.definition_de} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Definition CZ:</label>
                        <textarea name="definition_cz" rows="8" value={this.state.definition_cz} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Definition PL:</label>
                        <textarea name="definition_pl" rows="8" value={this.state.definition_pl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Definition SK:</label>
                        <textarea name="definition_sk" rows="8" value={this.state.definition_sk} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                        <label className="centered">Definition SL:</label>
                        <textarea name="definition_sl" rows="8" value={this.state.definition_sl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                      <div className="form-item">
                      Show in basic glossary:<br />
                      <input id="basic" name="basic" type="checkbox" checked={this.state.basic} onChange={(event) => this.updateField(event)} />
                      <label htmlFor="basic" className="checkbox-label top"></label>
                      </div>


                      <div className="user-profile-item">
                      <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>Save keyword</button>
                      <Link to="/experts/superuser"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>
                      {((!this.state.deleteButtonExpanded) && (this.state.deleteButton)) &&
                          <button className="btn btn-red btn-icon btn-delete" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.delete")}</button>
                      }
                      {this.state.deleteButtonExpanded &&
                          <span>
                              <button className="btn btn-red btn-icon btn-delete" onClick={() => this.removeGlossary()}>{getTranslation("forms.general.button.confirm_delete")}</button>
                              <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.cancel_delete")}</button>
                          </span>
                      }
                      </div>


                  </div>
                  </div>
              </div>
            </div>
            </div>
        )
    }
}

export default GlossaryForm
