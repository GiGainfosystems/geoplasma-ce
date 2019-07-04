import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import geoplasma from './geoplasmamap.png'
import mapimage2 from './map.svg'
import SVG from 'react-inlinesvg';
import getTranslation from '../../i18n'

/**
 * The stage of the web-portal (the map with the pilotareas with links to the local web GIS')
 */
class Stage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false
        }
    }

    /**
     * Get the pilotarea that was clicked on in the map
     * @param {} id - element id of the map svg
     */
    getPilotarea(id) {
        let pilotarea;
        let area = id.id.split("circle");
        if (area.length > 1) {
            pilotarea = area[1];
        } else {
            area = id.id.split("textbox");
            if (area.length > 1) {
                pilotarea = area[1];
            } else {
                area = id.id.split("text");
                if (area.length > 1) {
                    pilotarea = area[1];
                } else {
                    pilotarea = id.id;
                }
            }
        }
        return pilotarea;
    }

    /**
     * Hover effect on the pilot areas in the map svg
     * @param {*} id - element id of the map svg
     */
    hoverOn(id) {

        let pilotarea = this.getPilotarea(id);
        document.getElementById(pilotarea).style.fill = "#00153e";
        if(pilotarea.slice(-1) == 2) {
            document.getElementById(pilotarea.slice(0, -1)).style.fill = "#00153e";
            document.getElementById("text" + pilotarea.slice(0, -1)).style.fill = "#f3f3f3";
            document.getElementById("text" + pilotarea.slice(0, -1)).style.transform = "scale(1.05)";
        } else {
            if(document.getElementById(pilotarea+"2")) {
                document.getElementById(pilotarea+"2").style.fill = "#00153e";
            }
            document.getElementById("text" + pilotarea).style.fill = "#f3f3f3";
            document.getElementById("text" + pilotarea).style.transform = "scale(1.05)";
        }
    }

    /**
     * Hover effect on the pilot areas in the map svg
     * @param {*} id - element id of the map svg
     */
    hoverOff(id) {
        
        let pilotarea = this.getPilotarea(id);
        document.getElementById(pilotarea).style.fill = "#484848";

        if(pilotarea.slice(-1) == 2) {
            document.getElementById(pilotarea.slice(0, -1)).style.fill = "#484848";
            document.getElementById("text" + pilotarea.slice(0, -1)).style.fill = "#fff";
            document.getElementById("text" + pilotarea.slice(0, -1)).style.transform = "scale(1)";
        } else {
            if(document.getElementById(pilotarea+"2")) {
                document.getElementById(pilotarea+"2").style.fill = "#484848";
            }
            document.getElementById("text" + pilotarea).style.fill = "#fff";
            document.getElementById("text" + pilotarea).style.transform = "scale(1)";
        }
    }

    /**
     * Click on a pilot area in the map -> go to local web GIS
     * @param {} area - element ID of the element that was clicked on in the map svg
     */
    goToWebgis(area) {
        let pilotarea = this.getPilotarea(area)
        if(pilotarea.slice(-1) == 2) {
            pilotarea = pilotarea.slice(0,-1);
        }        
        window.location.href = '/webgis/' + pilotarea;
    }

    /**
     * Needed for event handlers etc.
     */
    onLoad() {
        this.setState({refresh: true});
    }

    render() {
        let pilotareas = [];
        let id = document.getElementById("vienna");
        if (id) {
            this.props.pilotareas.map(area => {
                pilotareas.push(document.getElementById(area.uri));
                pilotareas.push(document.getElementById("text" + area.uri))
                pilotareas.push(document.getElementById("textbox" + area.uri))
                pilotareas.push(document.getElementById("circle" + area.uri))
                if(document.getElementById(area.uri+"2")) {
                    pilotareas.push(document.getElementById(area.uri+"2"));
                }
            })
                        
            pilotareas.map(area => {
                area.addEventListener("mouseover", () => this.hoverOn(area));
                area.addEventListener("click", () => this.goToWebgis(area));
                area.addEventListener("mouseleave", () => this.hoverOff(area));
            })

        } 
        return (
            <div className="full-width">
                <div className="top-navigation">
                    <ul>
                        <li><Link to="/">{getTranslation("navigation.home")}</Link></li>
                        <li><Link to="/glossary">{getTranslation("navigation.glossary")}</Link></li>
                        <li className="dropdown">Web GIS
                            <ul>
                                {this.props.pilotareas.map(area =>
                                    <li key={area.id}><Link to={"/webgis/"+area.uri}>{getTranslation(area.name)}</Link></li>    
                                )}
                            </ul>    
                        </li>
                        <li><Link to="/experts">{getTranslation("navigation.knowledge_platform")}</Link></li>
                        <li><a href="http://www.geoplasma-ce.eu">{getTranslation("navigation.project_website")}</a></li>
                        <li><a href="https://de-de.facebook.com/geoplasmace/"><i className="fab fa-facebook-square" aria-hidden="true"></i></a></li>
                        <li><a href="https://twitter.com/geoplasma_ce"><i className="fab fa-twitter-square" aria-hidden="true"></i></a></li>
                    </ul>
                </div>
                <div className="default-element no-top-margin">
                    <div className="stage-container">

                        <SVG src={mapimage2} uniquifyIDs={false} onLoad={() => this.onLoad()}>
                            <img src={geoplasma} />
                        </SVG>
                        <h2>GeoPLASMA-CE</h2>
                        <h3>{getTranslation("stage.subheadline")}</h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default Stage
