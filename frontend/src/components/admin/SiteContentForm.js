import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import './Superuser.css'
import getTranslation from '../../i18n/'
import Rte from './Rte'

/**
 * Form to add content to a page on the landing pages
 */
class SiteContentForm extends Component {

    constructor(props) {
        super(props);
        let id = 0;
        let title = '';
        let title_de = '';
        let title_cz = '';
        let title_sl = '';
        let title_sk = '';
        let title_pl = '';

        let text = '';
        let text_de = '';
        let text_cz = '';
        let text_pl = '';
        let text_sk = '';
        let text_sl = '';
        let position = 1;
        let activated = 1;
        if(Number(props.id) !== 0) {

            let filter = props.sitecontent.filter(content => content.id === Number(props.id));
            if(filter.length > 0) {
                filter = filter[0];
                id = filter.id;
                title = filter.title;
                title_de = filter.title_de;
                title_cz = filter.title_cz;
                title_pl = filter.title_pl;
                title_sk = filter.title_sk;
                title_sl = filter.title_sl;
                text = filter.text;
                text_de = filter.text_de;
                text_cz = filter.text_cz;
                text_pl = filter.text_pl;
                text_sk = filter.text_sk;
                text_sl = filter.text_sl;
                position = filter.position;
                activated = filter.activated;
            }
        }

        this.state = {
            redirect: false,
            activated: activated,
            id: id,
            title: title,
            title_de: title_de,
            title_cz: title_cz,
            title_pl: title_pl,
            title_sk: title_sk,
            title_sl: title_sl,
            text: text,
            text_de: text_de,
            text_cz: text_cz,
            text_pl: text_pl,
            text_sk: text_sk,
            text_sl: text_sl,
            position: position,
            errors: [],
            required: [
                "title", "text", "position"
            ],
            deleteButton: false,
            deleteButtonExpanded: false
        }


    }

    componentDidMount() {
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
     * Submit the form by dispatching the saveSiteContent action with the form state + JWT token
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

            this.props.saveSiteContent(
              this.state.id,
              this.state.activated,
              this.props.page,
              this.state.title,
              this.state.title_de,
              this.state.title_cz,
              this.state.title_pl,
              this.state.title_sk,
              this.state.title_sl,
              this.state.text,
              this.state.text_de,
              this.state.text_cz,
              this.state.text_pl,
              this.state.text_sk,
              this.state.text_sl,
              this.state.position,
              token)
            this.setState({redirect: redirect, errors: errors, errorMessages: errorMessages })
        }

    }

    /**
     * Update the description field (RTE)
     * @param  {} input
     * @param  {} language
     */
    updateText(input, language) {
        if(language)
         {
           this.setState({[language]: input});
         } else {
           this.setState({text: input});
         }
    }

    /**
     * Toggle the delete buttons
     */
    toggleDelete() {
        this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
    }

    removeGlossary() {
        const token = this.props.cookies.token;
        this.props.removePage(this.props.id, token);
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
                  <h4><i className="fa fa-calendar" aria-hidden="true"></i> Web-portal Page</h4>

                  <div className="user-profile form-container">

                      <div className="form-item">
                        <label className="centered">Title:{this.state.errors.title && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.title ? 'v-error' : 'v-check')} name="title" type="text" value={this.state.title} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title DE:</label>
                        <input name="title_de" type="text" value={this.state.title_de} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title CZ:</label>
                        <input name="title_cz" type="text" value={this.state.title_cz} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title PL:</label>
                        <input name="title_pl" type="text" value={this.state.title_pl} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title SK:</label>
                        <input name="title_sk" type="text" value={this.state.title_sk} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title SL:</label>
                        <input name="title_sl" type="text" value={this.state.title_sl} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Position on page:{this.state.errors.position && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.position ? 'v-error' : 'v-check')} name="position" type="text" value={this.state.position} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />

                      </div>

                      <div className="form-item">
                        <label className="centered">Text:{this.state.errors.text && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <Rte content={this.state.text} updateText={(input) => this.updateText(input)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Text: DE</label>
                        <Rte content={this.state.text_de} updateText={(input) => this.updateText(input, "text_de")} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Text: CZ</label>
                        <Rte content={this.state.text_cz} updateText={(input) => this.updateText(input, "text_cz")} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Text: PL</label>
                        <Rte content={this.state.text_pl} updateText={(input) => this.updateText(input, "text_pl")} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Text: SK</label>
                        <Rte content={this.state.text_sk} updateText={(input) => this.updateText(input, "text_sk")} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Text: SL</label>
                        <Rte content={this.state.text_sl} updateText={(input) => this.updateText(input, "text_sl")} />
                      </div>

                      <div className="user-profile-item">
                      <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>Save text</button>
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

export default SiteContentForm
