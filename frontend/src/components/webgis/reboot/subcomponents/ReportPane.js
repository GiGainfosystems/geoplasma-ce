import React from 'react'
import getTranslation from '../../../../i18n/'
import AttributeTable from './AttributeTable'
import ReportMaps from './ReportMaps'
import UnitTable from './UnitTable'
import InfoText from './InfoText'
import ReportLegend from './ReportLegend'
import { featureRequest } from '../../helper'
import leafletImage from 'leaflet-image'
import proj4 from 'proj4';


const INPROGRESS = 'INPROGRESS';
const NOTSTARTED = 'NOTSTARTED';
const FINISHED = 'FINISHED';

/**
 * The report pane. A location based report is shown here
 */
class ReportPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pdfloader: false,
            map: undefined,
            reportQuery: false,
            createBorehole: false,
            borehole: NOTSTARTED,
        }
    }

    /**
     * Hide the report pane
     */
    hidePane() {
        this.props.hidePane();
    }

    /**
     * Fetch the report data from the backend via the reportQuery action
     * @param {*} map - Reference of the map object
     */
    fetchReport(map) {
        if((this.props.layers.length > 0) && (this.props.activeArea.uri)){
            let bounds = [ map.getBounds().getNorth() , map.getBounds().getEast(), map.getBounds().getSouth(), map.getBounds().getWest() ];
            let params = featureRequest(this.props.activeArea.uri, this.props.layers, bounds, [map.getSize().x, map.getSize().y], [map.latLngToContainerPoint([this.props.params.lat, this.props.params.lng]).x, map.latLngToContainerPoint([this.props.params.lat, this.props.params.lng]).y]);
            let queryParams = featureRequest(this.props.activeArea.uri, [ this.props.activeLayer ], bounds, [map.getSize().x, map.getSize().y], [map.latLngToContainerPoint([this.props.params.lat, this.props.params.lng]).x, map.latLngToContainerPoint([this.props.params.lat, this.props.params.lng]).y]);
           
            this.props.locationQuery(queryParams, params, this.props.layers, [this.props.params.lat, this.props.params.lng])
            this.props.reportQuery(params, this.props.layers, [this.props.params.lat, this.props.params.lng])
            this.props.zoomToQuery([this.props.params.lat, this.props.params.lng])
            this.setState({reportQuery: true})
        }
        if(!this.state.map) {
            this.setState({ map: map})
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.reportQuery) {
            if((nextProps.layers.length > 0) && (nextProps.activeArea.uri)) {
                if(this.props.params.lat) {
                    this.fetchReport(this.state.map)
                }
            }
        }
        if((nextProps.fetching.dataFetching.data === 'pdf') && (nextProps.fetching.dataFetching.status)) {
            this.setState({ pdfloader: false })
        }
        
    }

    /**
     * Create a PDF report in the backend via the dispatched action
     * To create the PDF, the map in the report pane needs to be transitioned to a base64 string
     */
    getPDF() {
        const html = this.refs.pdf_html.innerHTML;
        this.setState({ pdfloader: true })
        
        let activeConflicts = this.props.report.conflicts;
        let nonConflicts = this.props.report.non_conflict;

        let notes = []
        activeConflicts.map(conflict => {
            this.props.explanatorynotes.notes.map(note => {
                if(note.key === conflict.key) {
                    notes.push(note)
                }
            })
        })

        nonConflicts.map(layer => {            
            this.props.explanatorynotes.notes.map(note => {
                if(note.key === layer.key) {
                    if(notes.indexOf(note) === -1) {
                        notes.push(note)
                    }
                }
            })
            if(layer.children && layer.children.length > 0) {
                layer.children.map(child => {
                    this.props.explanatorynotes.notes.map(note => {
                        if(note.key === child.key) {
                            if(notes.indexOf(note) === -1) {
                                notes.push(note)
                            }
                        }
                    })
                })
            }
        })
        // Get the explanatory ynotes
        notes.map(note => {
            note.name = getTranslation(note.key+".label")
            note.description = note['explanatory_note_'+this.props.language.locale] ? note['explanatory_note_'+this.props.language.locale] : note.explanatory_note
        })

        let mapImage
        const mapElement = this.mapRef.leafletElement
        // Map to base64 string
        leafletImage(mapElement, (err, canvas) => {
            mapImage = canvas.toDataURL('image/png');       
            const headline = this.refs.reporttitle.textContent
            const exNotesHeadline = getTranslation("webgis.explanatory_notes")
            this.props.generatePDF(headline, html, mapImage, notes, exNotesHeadline);        
        })
        
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.report.borehole) {
            this.loadedBorehole();
        }
        if ( this.props.report.borehole !== '' && prevState.borehole === INPROGRESS ) {
            this.setState({borehole: FINISHED});
        }
    }

    /**
     * Create a virtual borehole in the backend
     */
    createBorehole() {
        const epsg83x = (this.props.activeLayer.reference_system === "ETRS-1989, TM 33-N" ? '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs' : '+proj=utm +zone=34 +ellps=GRS80 +units=m +no_defs');
        const srs = (this.props.activeLayer.reference_system ==="ETRS-1989, TM 33-N" ? 25833 : 25834);
        const convert = proj4(epsg83x, [parseFloat(this.props.report.coords[1]), parseFloat(this.props.report.coords[0])])
        const coordinates = 'multipoint z (('+Math.trunc(convert[0])+' '+Math.trunc(convert[1])+' 0))'
        this.setState({ createdBorehole: true, borehole: INPROGRESS})
        this.props.virtualBorehole(this.props.activeArea.uri, coordinates, srs);
    }

    /**
     * If a borehole is loaded we need to do some stuff do display it properly.
     * Texts in the borehole SVG get translated
     * The borehole gets filled manually with rectangles between the lines that represent a unit in the borehole
     */
    loadedBorehole() {
        if(this.props.report.borehole !== false) {
            // Need to select some stuff for SVG manipulation
            const lines = [].slice.call(document.getElementsByTagName("line"));
            const svgElement = [].slice.call(document.getElementsByTagName("svg"))[0];
            const units = lines.filter(fil => fil.getAttribute('stroke') != 'rgb(0,0,0)')
            const texts = [].slice.call(document.getElementsByTagName("text"));
            const names = texts.filter(fil => fil.getAttribute('text-anchor') == 'start')
            const meta = texts.filter(fil => fil.getAttribute('text-anchor') == 'middle')

            // Needs to be sorted now..
            units.sort(function(a,b) {
                return b.getAttribute('y1')-a.getAttribute('y1');
            })
            // Replace the name of the layers in the svg
            names.map(name => {
                const currentName = name.innerHTML
                let titlefield = 'title_'+this.props.language.locale
                name.innerHTML = this.props.units.filter(unit => unit.identifier === currentName).length > 0 ? this.props.units.filter(unit => unit.identifier === currentName)[0][titlefield] ? this.props.units.filter(unit => unit.identifier === currentName)[0][titlefield] : this.props.units.filter(unit => unit.identifier === currentName)[0].title_en : currentName;
            })
            
            meta.map(me => {
                if(me.innerHTML.indexOf("length") !== -1) {
                    me.innerHTML = me.innerHTML.replace("length", getTranslation("webgis.borehole.length"))
                }
                if(me.innerHTML.indexOf("bore point") !== -1) {
                    me.innerHTML = me.innerHTML.replace("bore point", getTranslation("webgis.borehole.point"))
                }
            })


            // Fill the model with color..
            var svgNS = "http://www.w3.org/2000/svg";  
            for(let i = 0; i<units.length; i++) {
                if(i+1 < units.length) {
                    const points = 
                        units[i].getAttribute('x1')+","+units[i].getAttribute('y1')+" "+
                        units[i+1].getAttribute('x1')+","+units[i+1].getAttribute('y1')+" "+
                        units[i+1].getAttribute('x2')+","+units[i+1].getAttribute('y2')+" "+
                        units[i].getAttribute('x2')+","+units[i].getAttribute('y2');
                    let polygon = document.createElementNS(svgNS,"polygon");
                    polygon.setAttributeNS(null,"points", points);
                    polygon.setAttributeNS(null,"fill",units[i+1].getAttribute('stroke'));
                    polygon.setAttributeNS(null,"stroke","none");
                    svgElement.appendChild(polygon);
                }
            }
            if (this.props.activeArea.uri == "vienna" || this.props.activeArea.uri == "vogtland-w-bohemia" ) {
                const points = 
                    units[0].getAttribute('x1')+","+units[0].getAttribute('y1')+" "+
                    units[0].getAttribute('x1')+","+lines[0].getAttribute('y2')+" "+
                    units[0].getAttribute('x2')+","+lines[0].getAttribute('y2')+" "+
                    units[0].getAttribute('x2')+","+units[0].getAttribute('y1');
                let polygon = document.createElementNS(svgNS,"polygon");
                polygon.setAttributeNS(null,"points", points);
                polygon.setAttributeNS(null,"fill",units[0].getAttribute('stroke'));
                polygon.setAttributeNS(null,"stroke","none");
                svgElement.appendChild(polygon);
            }

            // SVG to PNG for the report because the PDF lib does not support svg..
            var stringobJ = new XMLSerializer();
            var svg = svgElement;
            var svgString = stringobJ .serializeToString(svg );

            svg = '<?xml version="1.0"?>\n' + svgString ; 
    
            // Creating an Image Element
            var image = new Image();
            image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            // Width and height = width and height from the borehole
            image.width = 1000; 
            image.height = 1950;
    
            // Creating Canvas Element 
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            
            // Create 
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                
                context.drawImage(image, 0, 0);
                const imgstring = canvas.toDataURL('image/png');
                if(document.getElementById("borehole_picture")) {
                    document.getElementById("borehole_picture").src=imgstring;
                }
            }
        }
    }
    
    render() {

        const units = this.props.units.filter(unit => unit.pilotarea_id === this.props.activeArea.id)

        return(
            <div className={"report-pane "+(this.props.show? 'show-pane' : 'hide-pane')}>
                <button className="close-pane" onClick={() => this.hidePane()}><i className="far fa-times-circle"></i></button>
                <h3 className="text-left flexbox-headline">
                    <span ref="reporttitle"><i className="fas fa-map-marker-alt"></i> {getTranslation("report.title")}</span>
                    <div className="headline-buttons">
                    <button onClick={() => this.getPDF()} className="btn btn-red btn-icon btn-pdf">{!this.state.pdfloader ? getTranslation("report.pdf.button") : getTranslation("pdf.generate")}</button>
                    </div>
                </h3>
                <div className="width-100">
                    <ReportMaps mapRef={el => this.mapRef = el} fetchReport={(map) => this.fetchReport(map)} params={this.props.params} query={this.props.query} report={this.props.report} />
                </div>
                <div ref="pdf_html">
                    <p className="text-centered">{this.props.report.address}</p>
                    <div className="width-100 pdf-table">
                        <div className="width-100 report-flexbox">
                            <ReportLegend report={this.props.report} />
                            <div ref="coordinates" className="coordinates text-right">
                                {this.props.report.coords &&
                                    <React.Fragment>
                                        <p><strong><i className="fas fa-location-arrow"></i> {getTranslation("webgis.coordinates")}:</strong></p>
                                        <p>{Math.round(this.props.report.coords[0] * 10000) / 10000}</p>
                                        <p>{Math.round(this.props.report.coords[1] * 10000) / 10000}</p>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="width-100">
                        <InfoText maps={this.props.report.traffic_light_maps} />
                    </div>
                    <div className="width-100">
                        <div className="attributes-table">
                            <AttributeTable language={this.props.language}  activeLanguage={this.props.activeLanguage} explanatorynotes={this.props.explanatorynotes} report={this.props.report} />
                        </div>
                    </div>

                    {units.length > 0 && 
                        <React.Fragment>
                        {(this.props.report.borehole !== '' && this.props.report.borehole !== false) &&
                            <div className="width-100 contact-details borehole-section">
                                <h3 className="text-left"><i className="fas fa-pen" aria-hidden="true"></i> <span ref="contact_title">{getTranslation("virtual_borehole.title")}:</span></h3>
                                <React.Fragment>
                                    <div id="borehole" dangerouslySetInnerHTML={{__html : this.props.report.borehole}}>
                                    </div>
                                    <img id="borehole_picture" src="" />
                                    <UnitTable units={units} language={this.props.language.locale} />
                                </React.Fragment>
                            </div>
                        }

                        {(this.props.report.borehole === '' || this.props.report.borehole === false) &&
                        <div className="width-100 contact-details borehole-info">
                            <h3 className="text-left"><i className="fas fa-pen" aria-hidden="true"></i> <span ref="contact_title">{getTranslation("virtual_borehole.title")}:</span></h3>
                            <div className="borehole-and-legend">
                            {this.props.report.borehole === '' && this.state.borehole !== INPROGRESS &&
                                <button className="btn btn-green borehole-button" onClick={() => this.createBorehole()}>{getTranslation("webgis.virtual_borehole")}</button>
                            }
                            {this.state.borehole === INPROGRESS &&
                                <div>
                                    <div style={{textAlign: 'center'}}>{getTranslation("webgis.loading")}</div>
                                    <div className="loader"></div>
                                </div>
                            }
                            {this.props.report.borehole === false &&
                                <p>An error occured while creating the virtual borehole.</p>
                            }     
                            </div>
                        </div>
                        }
                        </React.Fragment>
                    }

                    
                    


                    <div className="width-100 contact-details">
                        <h3 className="text-left"><i className="fa fa-envelope" aria-hidden="true"></i> <span ref="contact_title">{getTranslation("contact.button")}:</span></h3>
                        {this.props.activeArea.contact_details &&
                            <span ref="contact_text">
                                <p dangerouslySetInnerHTML={{__html : this.props.activeArea.contact_details}}></p>
                            </span>
                        }
                    </div>
                    <div className="width-100 contact-details">
                        <h3 className="text-left">{getTranslation("report.disclaimer.title")}:</h3>
                        <p>{getTranslation("report.disclaimer")}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportPane;