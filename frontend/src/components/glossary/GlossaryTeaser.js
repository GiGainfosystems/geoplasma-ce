import React, { Component } from 'react';

// Import child components
import { Link } from 'react-router-dom'
import '../homepage/HomePage.css'
import getTranslation from '../../i18n/'

/**
 * Glossary teaser for the sidebar of the landingpage of the web portal
 * Displays the first two glossary entries
 */
class GlossaryTeaser extends Component {

  render() {

    let glossary = this.props.glossary.slice(0,2);

    let keyword = "keyword_"+this.props.language.locale
    let localized = "definition_"+this.props.language.locale
    glossary.map(content => {

        if(this.props.language.locale === 'cs') {
            localized = "definition_cz"
            keyword = "keyword_cz"
          } 
          if(this.props.language.locale === 'en' || !content[localized]) {
            localized = 'definition'
          }

        content.desc = content[localized].split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>
        })
    })

    return (
        <div className="default-element default-element-dark">
            <div className="default-element-content text-container">
                <h2>{getTranslation("glossary.title")}</h2>
                {glossary.map(entry =>
                    <div key={entry.id}>
                        <h3>{entry[keyword] ? entry[keyword] : entry.keyword}</h3>
                        <p>
                        {entry.desc}
                        </p>
                    </div>
                )}

                <Link to="/glossary"><button className="btn btn-blue">{getTranslation("glossary.link")}</button></Link>
            </div>
        </div>
    );
  }
}

export default GlossaryTeaser;
