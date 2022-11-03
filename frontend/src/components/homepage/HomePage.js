import React, { Component } from 'react';

// Import child components
import Header from '../header/Header'
import './HomePage.css'
import Footer from '../footer/Footer'

import Sidebar from './Sidebar'
import StageContainer from "../../containers/StageContainer";

/**
 * The homepage of the web portal
 */
class HomePage extends Component {

  render() {

      let sitecontent = [];
      let page = this.props.pages.filter(page => page.url === '/');
      if(page.length > 0) {
          page = page[0];
          this.props.sitecontent.map(content => {
              if(content.page_id === page.id) {
                  sitecontent.push(content)
              }
          })
      }
      // Localize the content on the homepage
      if(this.props.language.locale !== "en") {
        let localized_text;
        let localized_title;
        this.props.sitecontent.map(content => {
            if(this.props.language.locale == 'cs') {
                localized_title = "title_cz"
                localized_text = "text_cz"
            } else {
                localized_title = "title_"+this.props.language.locale
                localized_text = "text_"+this.props.language.locale
            }
            content.title_local = content[localized_title]
            content.text_local = content[localized_text]
        })
    }
    const localExperts = this.props.localcontacts.filter(expert => expert.language === this.props.language.locale)

    return (
      <div className="App">
        <Header title="GeoPLASMA-CE web-portal" />


        <div className="container container-content">
            <StageContainer pilotareas={this.props.pilotareas} />
            <div className="container-flex">
                <div className="two-third">


                {((this.props.fetching.dataFetching.isFetching) && (sitecontent.length === 0)) &&
                    <div className="default-element default-element-dark profile-teaser">
                      <div className="loader"></div>
                    </div>
                }

                {sitecontent.map(content =>
                    <div key={content.id} className="default-element">
                        <div className="default-element-content text-container">
                            <h2>{(this.props.language.locale === "en" ? content.title : (content.title_local !== '') ? content.title_local : content.title)}</h2>

                            <span dangerouslySetInnerHTML={{__html: (this.props.language.locale === "en" ? content.text : (content.text_local !== '') ? content.text_local :content.text)}}></span>

                        </div>
                    </div>
                )}


                </div>
                <div className="third padding20">

                <Sidebar pages={this.props.pages} glossary={this.props.glossary} language={this.props.language} />

                </div>

            </div>
            <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} localExperts={localExperts} />
        </div>



      </div>
    );
  }
}

export default HomePage;
