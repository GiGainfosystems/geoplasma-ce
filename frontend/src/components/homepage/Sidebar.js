import React from 'react';
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'
import GlossaryTeaser from '../glossary/GlossaryTeaser'
import twentyfour from './icons/twentyfour.svg';
import heatingcooling from './icons/heatingcooling.svg'
import emissions from './icons/emissions.svg'
import savespace from './icons/savespace.svg'
import BigTileBlue from '../bigtile/BigTileBlue'

function Sidebar(props) {
    return (
        <div>
            <div className="default-element default-element-dark">
            <Link to="/content/whytouse">
            <div className="default-element-content text-container why-teaser hover-effect">
                <h3> {getTranslation("whytouse.why")}</h3>
                <img src={twentyfour} />
                <img src={heatingcooling} />
                <img src={emissions} />
                <img src={savespace} />
            </div>
            </Link>
            </div>

            {props.pages.filter(page => page.url === 'outputs').length > 0  &&
            <div className="default-element default-element-dark inversed">
                <Link to="/content/outputs">
                <div className="default-element-content text-container why-teaser hover-effect">
                    <h3><i className="fas fa-file"></i> GeoPLASMA-CE outputs</h3>
                </div>
                </Link>
            </div>
            }

            {props.pages.filter(page => page.url === 'pilot-areas').length > 0  &&
            <div className="default-element default-element-dark inversed">
                <Link to="/content/pilot-areas">
                <div className="default-element-content text-container why-teaser hover-effect">
                    <h3><i className="fas fa-map-marked"></i> GeoPLASMA-CE pilot areas</h3>
                </div>
                </Link>
            </div>
            }

            {props.pages.filter(page => page.url === 'practice-examples').length > 0  &&
            <div className="default-element default-element-dark inversed">
                <Link to="/content/practice-examples">
                <div className="default-element-content text-container why-teaser hover-effect">
                    <h3><i className="fas fa-info-circle"></i> {getTranslation("example.teaser")}</h3>
                </div>
                </Link>
            </div>
            }
            
            {props.pages.filter(page => page.url === 'links').length > 0  &&
            <div className="default-element default-element-dark inversed">
                <Link to="/content/links">
                <div className="default-element-content text-container why-teaser hover-effect">
                    <h3><i className="fas fa-globe"></i> {getTranslation("links.teaser")}</h3>
                </div>
                </Link>
            </div>
            }


            <BigTileBlue
            title="portal.teaser.expert.title"
            icon="book"
            description="portal.teaser.expert.description"
            link="/experts"
            linktitle="portal.teaser.expert.gotolink"
            />

            <GlossaryTeaser language={props.language} glossary={props.glossary} />

            <div className="default-element default-element-dark">
            <div className="default-element-content text-container">
                <h2>{getTranslation("contact.button")}</h2>
                <h3>{getTranslation("homepage.project_manager")}:</h3>
                <p>
                Gregor Goetzl<br />
                Geological Survey of Austria
                <br />
                gregor.goetzl@geologie.ac.at
                <br />
                +43 1 7125674 336</p>
                <h3>{getTranslation("homepage.communication")}:</h3>
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
                {props.localExperts &&
                    <React.Fragment>
                    {props.language.locale !== 'en' &&
                        <React.Fragment>
                            <h3>{getTranslation("homepage.local_contacts")}</h3>
                            {props.localExperts.map(expert =>
                                <p dangerouslySetInnerHTML={{__html : expert.contactinfo}}></p>
                            )}
                        </React.Fragment>
                    }
                    </React.Fragment>
                }
                </div>
            </div>
    </div>
    )
    
}

export default Sidebar
