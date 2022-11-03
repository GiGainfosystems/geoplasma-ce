import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Link, Redirect } from 'react-router-dom'
import Select from 'react-select';
import Keywords from '../filterbox/Keywords'
import 'react-select/dist/react-select.css';
import './AddContent.css'
import getTranslation from '../../i18n/'
import 'react-tagsinput/react-tagsinput.css'
import Footer from '../footer/Footer'
import config from '../../config';

/**
 * The form to add content to the knowledge platform for registered users
 */
class AddContent extends Component {

  constructor(props) {
    super(props);
        this.state = {
            id: 0,
            internal_id: 0,
            title: '',
            year: '',
            author: '',
            publisher_place: '',
            territorial_coverage: '',
            language: 2,
            synopsis: '',
            topics: [0,0,0],
            tags: [],
            link: '',
            external_link: '',
            terms: false,
            redirect: false,
            required: [
                "title", "year", "author", "topics", "synopsis"
            ],
            errorMessages: [],
            errors: [],
            deleteButton: false,
            deleteButtonExpanded: false
        }

  }

  /**
   * Update field state
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
   * Change the language of the content
   * @param {*} value 
   */
  changeLanguage(value) {
      let language = this.state.language;
      language = value.value;
      this.setState({language: language})
  }

  /**
   * Change the thematic coverage of the content
   * @param {} value 
   * @param {*} index 
   */
  changeTopic(value, index) {
      let already_selected = this.state.topics.filter(topic => topic === value.value);
      if(already_selected.length === 0) {
          let topic = this.state.topics;
          topic[index] = value.value;
          this.setState({topic: topic})
      }

  }

  /**
   * Submit the form to add content to the knowledge repository by dispatching the according action
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

      if(!this.state.terms) {
          errorMessages.push("forms.general.error.message.terms");
      }

      let redirect = false;
       if(errorMessages.length === 0) {

           let website = this.state.link;
           if(this.state.link.substring(0,7) !== 'http://') {
               if(this.state.link.substring(0,8) !== 'https://') {
                   if(this.state.link !== '') {
                       website = 'http://'+website;
                   }
               }
           }

          const token = this.props.cookies.token;
          redirect = true;
          this.props.addContent(this.state.id, this.state.title, this.state.year, this.state.author, this.state.publisher_place, this.state.territorial_coverage, this.state.language, this.state.synopsis, website, this.state.topics, this.state.tags, this.state.internal_id, this.state.external_link, token)

      }
      this.setState({redirect: redirect, errors: errors, errorMessages: errorMessages})
  }

  componentDidMount() {
      if(this.props.id) {
        this.updateProps(this.props);
      }
  }

  updateProps(nextProps) {
      let content;
      let filter = nextProps.contents.filter(content => content.user_id === nextProps.user.id);
      let contentfilter = filter.filter(content => content.id === Number(nextProps.id));
      if(contentfilter.length > 0) {
          content = Object.assign({}, contentfilter[0])
          this.setState({
              id: nextProps.id,
              internal_id: content.internal_id,
              title: content.title,
              tags: content.tags,
              year: content.year,
              author: content.author,
              publisher_place: content.publisher_place,
              territorial_coverage: content.territorial_coverage,
              language: content.language,
              synopsis: content.synopsis,
              topics: content.topics,
              link: content.link,
              external_link: content.external_link,
              terms: false,
              deleteButton: true
          })
      }
  }

  componentWillReceiveProps(nextProps) {

      if(nextProps.id) {
        this.updateProps(nextProps);
      }
  }

  /**
   * Toggle the delete buttons
   */
  toggleDelete() {
      this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
  }

  /**
   * Remove content by dispatching the according action
   */
  removeContent() {
      const token = this.props.cookies.token;
      this.props.removeContent(this.props.id, token);
      this.setState({redirect: true})
  }

  /**
   * Update the tags
   * @param {} tags 
   */
  updateTags(tags) {
      this.setState({tags: tags})
  }

  /**
   * Upload a file to the knowledge platform
   * This is only possible for users that are marked as project partner
   */
  uploadFile() {
      const token = this.props.cookies.token;
      const formData = new FormData();
      formData.append('file', this.refs.file.files[0]);
      fetch(config.apiBaseUrl+'api/superuser/uploadcontent?token='+token, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      }).then((response) => {
        if (response.status === 200) {
          return response.json().then(data => {
            if (data.url) {
             this.setState({link: data.url});
            }
          });
        }
      });
  }

  render() {

      let languages = [];
      this.props.languages.map(language =>
          languages.push({
              value: language.id,
              label: language.title
          })
      )
      languages.sort(function(a, b) {
      var textA = a.label.toUpperCase();
      var textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });

      let topics = [];

      this.props.topics.map(topic =>
          topics.push({
              value: topic.id,
              label: getTranslation(topic.title)
          })
      )

      topics.sort(function(a, b) {
      var textA = a.label.toUpperCase();
      var textB = b.label.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      topics.unshift({value: 0, label: getTranslation("forms.contentform.thematic_coverage.placeholder")})

      let tags = this.props.tags;
    return(
      <div>
        {this.state.redirect &&
            <Redirect to="/experts/contribute/overview" />
        }
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.contribute" />
          <div className="default-element">
            <div className="contribute-section">
              <div className="default-element-content">
                <h4><i className="fa fa-book" aria-hidden="true"></i> {getTranslation("contentform.title")}:</h4>

                <div className="user-profile form-container">
                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.title.label")}:{this.state.errors.title && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <input className={(this.state.errors.title ? 'v-error' : 'v-check')} name="title" type="text" value={this.state.title} placeholder={getTranslation("forms.contentform.title.placeholder")} onChange={(event) => this.updateField(event)} />

                    </div>
                    {this.props.user.projectpartner &&
                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.internal_id.label")}:</label>
                      <input name="internal_id" type="text" value={this.state.internal_id} onChange={(event) => this.updateField(event)} />

                    </div>
                    }
                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.author.label")}:{this.state.errors.author && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <input className={(this.state.errors.author ? 'v-error' : 'v-check')} name="author" type="text" value={this.state.author} placeholder={getTranslation("forms.contentform.author.placeholder")} onChange={(event) => this.updateField(event)} />

                    </div>
                    <div className="container-flex">
                        <div className="form-item half">
                          <label className="centered">{getTranslation("forms.contentform.publisher.label")}:{this.state.errors.publisher_place && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                          <input className={(this.state.errors.publisher_place ? 'v-error' : 'v-check')} name="publisher_place" type="text" value={this.state.publisher_place} onChange={(event) => this.updateField(event)} placeholder={getTranslation("forms.contentform.publisher.placeholder")} />

                        </div>
                        <div className="form-item half">
                          <label className="centered">{getTranslation("forms.contentform.year.label")}:{this.state.errors.year && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                          <input className={(this.state.errors.year ? 'v-error' : 'v-check')} name="year" type="text" value={this.state.year} onChange={(event) => this.updateField(event)} placeholder={getTranslation("forms.contentform.year.placeholder")} />

                        </div>
                    </div>

                    <div className="user-profile-item profile-form-select">
                        <label className="centered">{getTranslation("forms.contentform.thematic_coverage.label")}:{this.state.errors.topics && <span className="validation-error">{getTranslation("forms.contentform.thematic_coverage.error.hint")}</span>}</label>
                        {this.state.topics.map((topic, index) =>
                            <Select key={index}
                                name={"occupation-"+index}
                                value={topic}
                                options={topics}
                                clearable={false}
                                onChange={(value) => this.changeTopic(value, index)}
                              />
                        )}

                    </div>

                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.keywords.label")}:</label>
                      <Keywords tags={tags} activeTags={this.state.tags} updateTags={(tags) => this.updateTags(tags)} />

                    </div>

                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.territorial_coverage.label")}:{this.state.errors.territorial_coverage && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <input className={(this.state.errors.territorial_coverage ? 'v-error' : 'v-check')} name="territorial_coverage" type="text" value={this.state.territorial_coverage} placeholder={getTranslation("forms.contentform.territorial_coverage.placeholder")} onChange={(event) => this.updateField(event)} />

                    </div>

                    <div className="form-item">
                        <label className="centered">{getTranslation("forms.contentform.language.label")}:</label>
                        <Select
                            name="language"
                            value={this.state.language}
                            options={languages}
                            clearable={false}
                            onChange={(value) => this.changeLanguage(value)}
                          />
                  </div>

                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.synopsis.label")}:{this.state.errors.synopsis && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                      <textarea className={(this.state.errors.synopsis ? 'v-error' : 'v-check')} name="synopsis" rows="8" value={this.state.synopsis} onChange={(event) => this.updateField(event)}></textarea>
                    </div>

                    {this.props.user.projectpartner &&
                        <div>
                        <div className="form-item">
                          <label className="centered">File upload:</label>
                          <input type="file" name="file" ref="file" />
                          <button type="button" className="btn btn-green" onClick={() => this.uploadFile()}>Upload file</button>
                        </div>

                        <div className="form-item">
                          <label className="centered">{getTranslation("forms.contentform.link.label")}:</label>
                          <input name="link" type="text" value={this.state.link} onChange={(event) => this.updateField(event)} placeholder={getTranslation("forms.contentform.link.placeholder")} />

                        </div>
                        </div>
                    }

                    <div className="form-item">
                      <label className="centered">{getTranslation("forms.contentform.link.label")} (external):</label>
                      <input name="external_link" type="text" value={this.state.external_link} onChange={(event) => this.updateField(event)} placeholder={getTranslation("forms.contentform.link.placeholder")} />

                    </div>



                    <div className="terms-box">
                      <input name="terms" id="activated" type="checkbox" checked={this.state.terms} onChange={(event) => this.updateField(event)} />
                      <label htmlFor="activated" className="checkbox-label">{getTranslation("forms.contentform.terms.label")}:</label>
                      <p dangerouslySetInnerHTML={{__html: getTranslation("forms.contentform.terms")}}></p>
                    </div>
                    {this.state.errorMessages.length > 0 &&
                        <div className="error-messages">
                            {this.state.errorMessages.map((error, index) =>
                                <p key={index}>{getTranslation(error)}</p>
                            )}
                        </div>
                    }
                    <div className="user-profile-item">
                    <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>{getTranslation("forms.contentform.button.save")}</button>
                    <Link to="/experts/contribute/overview"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>

                    {((!this.state.deleteButtonExpanded) && (this.state.deleteButton)) &&
                        <button className="btn btn-red btn-icon btn-delete" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.delete")}</button>
                    }
                    {this.state.deleteButtonExpanded &&
                        <span>
                            <button className="btn btn-red btn-icon btn-delete" onClick={() => this.removeContent()}>{getTranslation("forms.general.button.confirm_delete")}</button>
                            <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.cancel_delete")}</button>
                        </span>
                    }



                    </div>
                </div>
              </div>
            </div>
          </div>
          <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default AddContent
