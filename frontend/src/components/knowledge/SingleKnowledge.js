import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'
import KnowledgeBox from './KnowledgeBox'

/**
 * Page for single knowledge repository contents
 */
class SingleKnowledge extends Component {
  render() {

    let content = this.props.content;
    if(!this.props.notfound) {
        content.desc = content.synopsis.split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>
        })
    }

    return(

      <div>
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.knowledge_repository" />

          {((this.props.notfound) && (!this.props.fetching.dataFetching.isFetching)) &&
              <h2>Not found</h2>
          }

        {((this.props.fetching.dataFetching.isFetching) && (this.props.notfound)) &&
            <div className="default-element default-element-dark profile-teaser">
              <div className="loader"></div>
            </div>
        }

          {!this.props.notfound &&
              <KnowledgeBox content={content} languages={this.props.languages} />
          }
          <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default SingleKnowledge
