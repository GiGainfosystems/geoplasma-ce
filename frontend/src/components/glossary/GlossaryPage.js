import React, { Component } from 'react';

// Import child components
import Header from '../header/Header'
import getTranslation from '../../i18n/'
import BigTileBlue from '../bigtile/BigTileBlue'
import { Link } from 'react-router-dom'
import Stage from '../homepage/Stage'
import '../homepage/HomePage.css'
import Footer from '../footer/Footer'
import GlossaryTeaser from './GlossaryTeaser'
import StageContainer from "../../containers/StageContainer";

/**
 * The glossary page of the web-portal containing the full glossary
 * of the GeoPLASMA-CE project
 */
class GlossaryPage extends Component {

  render() {

    let glossary = this.props.glossary
    if(this.props.basic) {
      glossary = this.props.glossary.filter(entry => entry.basic === true);
    }

    // Localize the glossary
    let keyword = "keyword_"+this.props.language.locale
    let synonyms = "synonyms_"+this.props.language.locale
    glossary.map(content => {
        let localized = "definition_"+this.props.language.locale

        if(this.props.language.locale === 'cs') {
          localized = "definition_cz"
          synonyms = "synonyms_cz"
          keyword = "keyword_cz"
        } 
        if(this.props.language.locale === 'en' || !content[localized]) {
          localized = 'definition'
        }
        content.desc = content[localized].split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>
        })
    })

    // sort the glossary alphabetically ascending
    glossary.sort(function(a, b) {
      var textA = a.keyword.toUpperCase();
      var textB = b.keyword.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    const headline = getTranslation("glossary.title")
    const localExperts = this.props.localcontacts.filter(expert => expert.language === this.props.language.locale)
    return (
      <div className="App">
        <Header title="GeoPLASMA-CE web-portal" />


        <div className="container container-content">
          <StageContainer pilotareas={this.props.pilotareas} />
            <div className="container-flex">
                <div className="two-third">


                    <div className="default-element">
                        <div className="default-element-content text-container">
                        <h1>{headline}</h1>

                        {((this.props.fetching.dataFetching.isFetching) && (glossary.length === 0)) &&
                              <div className="loader"></div>
                        }

                        {glossary.map(content =>
                            <div key={content.id}>
                            <h2>{content[keyword] ? content[keyword] : content.keyword}</h2>
                            
                            <span className="small"><strong>Synonyms:</strong> {content[synonyms] ? content[synonyms] : content.synonyms}</span>
                            

                            <p>{content.desc}</p>
                            {content.link !== '' &&
                            <a className="margin-bottom" href={content.link}>External link with more information</a>
                            }

                            </div>
                        )}
                        </div>
                    </div>



                </div>
                <div className="third padding20">
                <BigTileBlue
                    title="portal.teaser.expert.title"
                    icon="book"
                    description="portal.teaser.expert.description"
                    link="/experts"
                    linktitle="portal.teaser.expert.gotolink"
                />

                <GlossaryTeaser language={this.props.language} glossary={this.props.glossary} />


                <div className="default-element default-element-dark">
                    <div className="default-element-content text-container">
                        <h2>Contact us</h2>
                        <h3>Project manager:</h3>
                        <p>
                        Gregor Goetzl<br />
                        Geological Survey of Austria
                        <br />
                        gregor.goetzl@geologie.ac.at
                        <br />
                        +43 1 7125674 336</p>
                        <h3>Communication:</h3>
                        <p>
                        Urša Šolc<br />
                        Geological Survey of Slovenia
                        <br />
                        urska.solc@geo-zs.si
                        <br />
                        +386 1 2809 774</p>

                        <p>
                        Ruediger Grimm<br />
                        geoENERGIE Konzept GmbH
                        <br />
                        grimm@geoenergie-konzept.de
                        <br />
                        +49 3731 79878 11
                        </p>

                        {this.props.language.locale !== 'en' &&
                            <React.Fragment>
                                <h3>{getTranslation("homepage.local_contacts")}</h3>
                                {localExperts.map(expert =>
                                    <p dangerouslySetInnerHTML={{__html : expert.contactinfo}}></p>
                                )}
                            </React.Fragment>
                        }
                        </div>
                </div>

                </div>

            </div>
            <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>



      </div>
    );
  }
}

export default GlossaryPage;
