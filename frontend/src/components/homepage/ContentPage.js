import React, { Component } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import getTranslation from '../../i18n/'
// Import child components
import Header from '../header/Header'
import StageContainer from "../../containers/StageContainer";
import 'react-accessible-accordion/dist/fancy-example.css';
import './HomePage.css'
import Footer from '../footer/Footer'
// Why to use icons
import twentyfour from './icons/twentyfour.svg';
import heatingcooling from './icons/heatingcooling.svg'
import emissions from './icons/emissions.svg'
import savespace from './icons/savespace.svg'
import normalpower from './icons/normalpower.svg'
import smartgrids from './icons/smartgrids.svg'
import highinvest from './icons/highinvest.svg'
import lowcost from './icons/lowcost.svg'
import searchinfos from './icons/searchinfos.svg'
import permission_timeconsuming from './icons/permission_timeconsuming.svg'
import decisionmaker from './icons/decisionmaker.svg'
import web_tool from './icons/web_tool.svg'
import permission_easier from './icons/permission_easier.svg'
import Sidebar from './Sidebar'

/**
 * Content page from the web portal (why to use shallow geothermal, disclaimer etc., case studies, international projects)
 */
class ContentPage extends Component {
    language;
    
    render() {

        const iconset = {
            twentyfour,
            heatingcooling,
            emissions,
            savespace,
            normalpower,
            smartgrids,
            highinvest,
            lowcost,
            searchinfos,
            permission_timeconsuming,
            decisionmaker,
            web_tool,
            permission_easier
        }

        // Localize the content
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
        let sitecontent = [];
        // Check if special navigation with icons is needed
        let page = this.props.pages.filter(page => page.url === this.props.url);
        if(page.length > 0) {
            page = page[0];
            this.props.sitecontent.map(content => {       
                let icons = [];
                if(content.page_id === page.id) {
                    
                    const findIcons = content.text.split("##");
                    for(let i = 1; i < findIcons.indexOf("--"); i++) {
                        icons.push(findIcons[i]);
                    }
                    if(this.props.match.params.url === 'whytouse') {
                        content.text = findIcons[0]+findIcons[findIcons.indexOf("--")+1];
                    }
                    if(!content.icons) {
                        content.icons = icons;
                    }
                    
                    sitecontent.push(content)
                }
            })
        }
        
        // In case it is the international links page
        let orderedLinks = {};
        if(this.props.links.length > 0) {
            this.props.links.map(link => {
                if(!orderedLinks[link.type]) {
                    orderedLinks[link.type] = { name: link.type, links: []}
                }
                link.identifier = link.title_of_project_initiative ? link.title_of_project_initiative : link.acronym;
                orderedLinks[link.type].links.push(link);
                orderedLinks[link.type].links.sort(function(a, b) {
                    if(a.identifier < b.identifier) { return -1; }
                    if(a.identifier > b.identifier) { return 1; }
                    return 0;
                })
                return link;
            })
        }

        // In case it is the case studies page
        let orderedExamples = {};
        if(this.props.examples.length > 0) {
            this.props.examples.map(example => {
                if(!orderedExamples[example.pilotarea_id]) {
                    orderedExamples[example.pilotarea_id] = { name: getTranslation(this.props.pilotareas.filter(area => area.id == example.pilotarea_id)[0].name), examples: []}
                }
                Object.keys(example).map(key => {
                    if(example[key] === '') {
                        delete example[key];
                    }
                    delete example.id
                    delete example.created_at
                    delete example.updated_at
                })
                orderedExamples[example.pilotarea_id].examples.push(example);

                return example;
            })
        }
        const { setCookie, deleteCookie, cookies } = this.props;
        const localExperts = this.props.localcontacts.filter(expert => expert.language === this.props.language.locale)
        return (
        <div className="App">
        
            <Header title="GeoPLASMA-CE web-portal" />


            <div className="container container-content">
                <StageContainer pilotareas={this.props.pilotareas} />
                <div className="container-flex">
                    <div className="two-third">

                    {this.props.match.params.url === 'whytouse' &&
                        <div className="whytouse-navi">
                            {sitecontent.map(content =>
                                <a key={content.id} className="whytouse-navibox" href={"#"+content.title}>                            
                                    <h3>{(this.props.language.locale === "en" ? content.title : (content.title_local !== '') ? content.title_local : content.title)}</h3>
                                    <div className="navibox-icons">
                                    {content.icons.map(icon =>
                                        <img key={icon} src={iconset[icon]} />    
                                    )}
                                    </div>
                                </a>
                            )}
                        </div>
                    }

                    {sitecontent.map(content =>
                        <div key={content.id} className="default-element">
                            <div className="default-element-content text-container">
                                <a name={content.title}></a>
                                <h2 className={this.props.match.params.url === 'whytouse' ? 'whytouse' : 'not-whytouse'}>
                                    <span>{(this.props.language.locale === "en" ? content.title : (content.title_local !== '') ? content.title_local : content.title)}</span>
                                    <div>
                                    {content.icons.map(icon =>
                                        <img src={iconset[icon]} />
                                    )}
                                    </div>
                                </h2>

                                <span dangerouslySetInnerHTML={{__html: (this.props.language.locale === "en" ? content.text : (content.text_local !== '') ? content.text_local :content.text)}}></span>
                                {content.title === 'Cookies' && <div>
                                    <div>
                                        <fieldset onChange={(e) => setCookie('consent', e.target.value)}>
                                            <legend>{getTranslation("cookies.radio.legend")}</legend>

                                            <label htmlFor="all">
                                                <input type="radio" id="all" name="cookies-disclaimer" value="all" checked={cookies.consent === 'all'} />
                                                {getTranslation("cookies.radio.all")}
                                            </label>

                                            <label htmlFor="essential">
                                                <input type="radio" id="essential" name="cookies-disclaimer" value="essential" checked={cookies.consent === 'essential'} />
                                                {getTranslation("cookies.radio.essential")}
                                            </label>

                                            <label htmlFor="none">
                                                <input type="radio" id="none" name="cookies-disclaimer" value="none" checked={cookies.consent === 'none' || cookies.consent === null} />
                                                {getTranslation("cookies.radio.none")}
                                            </label>
                                        </fieldset>
                                        {Object.keys(cookies).length > 0 &&
                                            <div className="btn-group">
                                                <button onClick={() => {
                                                    Object.keys(cookies).forEach(deleteCookie)
                                                }} className="btn btn-gray">{getTranslation('cookies.buttons.deleteAll')}</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    )}

                    {this.props.match.params.url === 'links' &&
                        <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>
                            {Object.keys(orderedLinks).map((key) =>
                                <AccordionItem key={key}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            {orderedLinks[key].name}
                                        
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        {orderedLinks[key].links.map(link =>
                                            <div className="accordion-item">
                                                <h2>{link.title_of_project_initiative ? link.title_of_project_initiative : link.acronym}</h2>
                                                <ul>
                                                    {link.acronym && <li>{getTranslation("links.acronym")} <strong>{link.acronym}</strong></li>}
                                                    {link.financing_program_source && <li>{getTranslation("links.financing")} <strong>{link.financing_program_source}</strong></li>}
                                                    {link.summary && <li><p>{link.summary}</p></li>}
                                                    {link.website && <li>{getTranslation("links.link")} <a href={link.website}><strong>{link.website}</strong></a></li>}
                                                </ul>
                                            </div>
                                        )}
                                    </AccordionItemPanel>
                                </AccordionItem>  
                            )}
                        </Accordion>
                    }

                    {this.props.match.params.url === 'practice-examples' &&
                        <Accordion allowZeroExpanded={true} allowMultipleExpanded={true}>
                            {Object.keys(orderedExamples).map((key) =>
                                <AccordionItem key={key}>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            {orderedExamples[key].name}
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        {orderedExamples[key].examples.map(example =>
                                            <div className="accordion-item">
                                                <h2>{example.title}</h2>
                                                <table className="example-data" cellSpacing="0">
                                                    <tbody>
                                                        {Object.keys(example).map(ex =>
                                                            <React.Fragment>
                                                            {ex !== 'pilotarea_id' &&
                                                            <tr>
                                                                <td>{getTranslation("example."+ex)}</td>
                                                                <td dangerouslySetInnerHTML={{__html : example[ex]}}></td>
                                                            </tr>
                                                            } 
                                                            </React.Fragment>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </AccordionItemPanel>
                                </AccordionItem>  
                            )}
                        </Accordion>
                    }



                    </div>
                    <div className="third padding20">

                    <Sidebar pages={this.props.pages} glossary={this.props.glossary} language={this.props.language} />

                    </div>

                </div>
                <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
            </div>



        </div>
        );
    }
}

export default ContentPage;
