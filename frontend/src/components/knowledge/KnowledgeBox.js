import React, { Component } from 'react'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'

/**
 * The box that contains the knowledge. The knowledge of the knowledge repository
 */
class KnowledgeBox extends Component {
    render() {
        return(
            <div key={this.props.content.id} className="default-element default-element-dark profile-teaser">
              <Link to={"/experts/knowledge-repository/"+this.props.content.id}><h4><i className="fa fa-file-text-o" aria-hidden="true"></i> {this.props.content.title}</h4></Link>
                <div className="container-flex">
                  <div className="third">
                    <p><label>{getTranslation("forms.contentform.author.label")}:</label>
                    <span>{this.props.content.author}</span>

                    {this.props.content.publisher_place !== '' &&
                    <div>
                    <label>{getTranslation("forms.contentform.publisher.label")}:</label>
                    <span>{this.props.content.publisher_place}</span>
                    </div>
                }
                    <label>{getTranslation("forms.contentform.year.label")}:</label>
                    <span>{this.props.content.year}</span>
                    {this.props.content.territorial_coverage !== '' &&
                    <div>
                    <label>{getTranslation("forms.contentform.territorial_coverage.label")}:</label>
                    <span>{this.props.content.territorial_coverage}</span>
                    </div>
                      }
                    <label>{getTranslation("forms.contentform.thematic_coverage.label")}:</label>
                    {this.props.content.categories.map((category, index) =>
                      <span key={index}>{getTranslation(category)}</span>
                    )}

                    </p>


                  </div>
                  <div className="two-third">
                <p>
                  <label>{getTranslation("forms.contentform.language.label")}:</label>
                  <span><img src={this.props.languages.filter(lang => lang.id === Number(this.props.content.language))[0].language} alt="English" /> {this.props.languages.filter(lang => lang.id === Number(this.props.content.language))[0].title}</span>
                  </p>
                      <label>{getTranslation("contentview.synopsis")}:</label>
                    <p><span>{this.props.content.desc}</span>
                    </p>
                    {this.props.content.link !== ''&&
                    <a href={this.props.content.link}><button className="btn btn-blue btn-icon btn-read">{getTranslation("contentview.full_text")}</button></a>
                      }

                      {this.props.content.external_link !== ''&&
                      <a href={this.props.content.external_link}><button className="btn btn-blue btn-icon btn-read">{getTranslation("userprofile.form.website.label")}</button></a>
                        }
                  </div>
                </div>

            </div>
        )
    }
}

export default KnowledgeBox
