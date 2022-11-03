import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import './Superuser.css'
import getTranslation from '../../i18n/'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

/**
 * Form to add / edit pages on the web portal
 */
class PageForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            active: 'content',
            id: props.page ? props.page.id : 0,
            title: props.page ? props.page.title : '',
            title_de: props.page ? props.page.title_de : '',
            title_sk: props.page ? props.page.title_sk : '',
            title_sl: props.page ? props.page.title_sl : '',
            title_pl: props.page ? props.page.title_pl : '',
            title_cs: props.page ? props.page.title_cs : '',
            url: props.page ? props.page.url : '',
            navigation: props.page ? props.page.navigation : 'none',
            errors: [],
            required: [
                "keyword", "url"
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
     * Submit the form by dispatching the savePage action with the form state + JWT token
     */
    submitForm() {
        let errorMessages = [];
        let errors = this.state.errors;
        let required = [];
        this.state.required.map(field => {
            if(this.state[field] === '') {
                required.push(field);
                errors[field] = true;
            } else if ((field === 'topics') && (this.state.topics.filter(topic => topic === 0).length > 2)) {
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
            this.props.savePage(this.state.id, this.state.title, this.state.title_de, this.state.title_cs, this.state.title_pl, this.state.title_sk, this.state.title_sl, this.state.navigation, this.state.url, token)
            this.setState({redirect: redirect, errors: errors, errorMessages: errorMessages })
        }

    }

    updateProps(nextProps) {

        let filter = nextProps.pages.filter(page => page.id === Number(nextProps.id));
        if(filter.length > 0) {
            filter = filter[0];
            this.setState({
                id: filter.id,
                title: filter.title,
                title_de: filter.title_de,
                title_pl: filter.title_pl,
                title_cs: filter.title_cs,
                title_sk: filter.title_sk,
                title_sl: filter.title_sl,
                url: filter.url,
                navigation: filter.navigation,
                deleteButton: true
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

    removeGlossary() {
        const token = this.props.cookies.token;
        this.props.removePage(this.props.id, token);
        this.setState({redirect: true})
    }

    /**
     * Change the navigation (custom select)
     * @param  {} value
     */
    changeNavigation(value) {
        let navigation = value.value;
        this.setState({navigation: navigation})
    }


    render() {
        let navigations = [];
        navigations.push({value: 'none', label: 'None' })
        navigations.push({value: 'top', label: 'Top' })
        navigations.push({value: 'footer', label: 'Footer' })


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
                        <label className="centered">Title DE:{this.state.errors.title_de && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.title_de ? 'v-error' : 'v-check')} name="title_de" type="text" value={this.state.title_de} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title CS:{this.state.errors.title_cs && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.title_cs ? 'v-error' : 'v-check')} name="title_cs" type="text" value={this.state.title_cs} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title PL:{this.state.errors.title_pl && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.title_pl ? 'v-error' : 'v-check')} name="title_pl" type="text" value={this.state.title_pl} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title SK:{this.state.errors.title_sk && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.title_sk ? 'v-error' : 'v-check')} name="title_sk" type="text" value={this.state.title_sk} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item">
                        <label className="centered">Title SL:{this.state.errors.title_sl && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.title_sl ? 'v-error' : 'v-check')} name="title_sl" type="text" value={this.state.title_sl} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>

                      <div className="form-item profile-form-select">
                          <label className="centered">Navigation:</label>
                              <Select
                                  name="navigation"
                                  value={this.state.navigation}
                                  options={navigations}
                                  clearable={false}
                                  onChange={(value) => this.changeNavigation(value)}
                                />
                      </div>

                      <div className="form-item">
                        <label className="centered">URL:{this.state.errors.url && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                        <input className={(this.state.errors.url ? 'v-error' : 'v-check')} name="url" type="text" value={this.state.url} placeholder="Enter the url here.." onChange={(event) => this.updateField(event)} />

                      </div>

                      <div className="user-profile-item">
                      <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>Save page</button>
                      <Link to="/experts/contribute/overview"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>
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

export default PageForm
