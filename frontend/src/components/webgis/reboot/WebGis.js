import React from 'react';
import Header from '../../header/Header'
import MapView from './subcomponents/Map';
import Menu from './subcomponents/Menu'
import ReportPane from './subcomponents/ReportPane'
import { getLayers } from './helper/getLayers';
import Legend from './subcomponents/Legend'
import PilotAreaInfo from './subcomponents/PilotAreaInfo'
import InfoOverlay from './subcomponents/InfoOverlay';
import Overlay from '../../overlay/Overlay'
import SwitchDialog from '../SwitchDialog'
import '../WebGis.css';
import 'leaflet/dist/leaflet.css';
import getTranslation from '../../../i18n/'

/**
 * Web GIS main component. Controls the map display and the location queries + report
 */
class WebGis extends React.Component {

    constructor(props) {
        super(props);
        props.getLayers(props.area, true)
        props.getMeasurements(props.area);

        let fullOverlay = false;
        if(props.pilotareas.length > 0) {
            const area = props.pilotareas.filter(area => area.uri === this.props.area)[0];
            
            if(String(area.contact_details).substr(0,4) === 'hide') {
                fullOverlay = true;
            }
        }

        this.state = {
            layers: props.layers,
            reportPane: false,
            infoPane: false,
            reportLink: (props.match.params.lat ? true : false),
            center: undefined,
            addressMarkers: [],
            disabledInfoPane: false,
            addressCenter: undefined,
            expertCenter: undefined,
            expertMarkers: [],
            fullOverlay: fullOverlay,
            switchDialog: false,
            measurements: false,
            infoOverlay: true
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.layers) {
            this.setState({ layers: nextProps.layers});
        }
        const pilotareaInfo = nextProps.cookies[nextProps.activeArea.uri];
        if((nextProps.activeArea.uri) && (!this.state.disabledInfoPane) && (pilotareaInfo != 'false')) {
            this.setState({ infoPane: true })
        }

        if(nextProps.pilotareas.length > 0) {
            const area = nextProps.pilotareas.filter(area => area.uri === this.props.area)[0];
           
            if(String(area.contact_details).substr(0,4) === 'hide') {
                this.setState({ fullOverlay: true })
            }
        }
    }

    /**
     * Show or hide the field measurements on the map
     */
    toggleMeasurements() {
        this.setState({ measurements: !this.state.measurements})
    }

    /**
     * Toggle the dialog where the user can switch to a different pilotarea
     */
    switchDialog() {
        this.setState({switchDialog : !this.state.switchDialog})
    }

    /**
     * Toggle the layers
     * @param {} layers 
     */
    toggleLayer(layers) {
        this.setState({ layers })
    }

    /**
     * Show the report pane
     */
    showReport() {
        this.setState({ reportPane: true })
    }

    /**
     * Hide the report pane
     */
    hidePane() {
        this.mapRef.leafletElement.closePopup();
        this.setState({ reportPane: false, infoPane: false, disabledInfoPane: true })
    }

    /**
     * Show the pilot area info pane
     */
    showInfoPane() {
        this.setState({ infoPane: true })
    }

    /**
     * Move the map so the location query is in the center
     * @param {} coords - Coords of the location query
     */
    zoomToQuery(coords) {
        this.setState({ center: coords })
    }

    /**
     * Make sure the center is based on the correct information
     */
    locationCenter() {
       this.setState({
           addressCenter: undefined,
           expertCenter: undefined
       })
    }

    /**
     * Close the pilot area info pane
     */
    closeOverlay() {
        this.setState({ infoOverlay: false })
    }

    /**
     * The address search was successfull and a marker is set to the searched location
     * @param {*} newCenter - Coords of the searched address
     */
    addressSearchSuccess(newCenter) {
        let markers = [];
        markers.push(newCenter);

        this.setState({expertCenter: undefined, addressCenter: newCenter, addressMarkers: markers, markers: [], zoom: 15})
    }

    /**
     * Zoom the map to a local expert
     * @param {*} id - ID of the expert 
     */
    zoomToExpert(id) {
        let expert = this.props.localExperts.filter(expert => expert.id === id)[0]
        let position = [parseFloat(expert.lat), parseFloat(expert.lon)]
        let markers = [];
        let marker = {};
        marker.position = position
        marker.expert = expert;
        markers.push(marker);
        this.setState({expertCenter: position, expertMarkers: markers, zoom: 15})
    }

    componentDidMount() {
        if(this.props.match.params.lat) {
            this.showReport();
        }
    }

    render() {
        const layers = getLayers(this.state.layers);        
        const activeLanguage = this.props.language.availableLanguages.filter(language => language.locale === this.props.language.locale)[0].title;
        const languageCode = this.props.language.availableLanguages.filter(language => language.locale === this.props.language.locale)[0].locale;

        return(
            <div className="App webgis">
            {this.state.switchDialog && <Overlay><SwitchDialog switchDialog={() => this.switchDialog()} pilotareas={this.props.pilotareas.filter(area => area.uri !== this.props.activeArea.uri)} /></Overlay>}
            {this.state.fullOverlay &&
                <div className="overlay">
                    <div className="overlay-content">
                        <h3>{getTranslation("area.not_finished_title")}</h3>
                        <p>{getTranslation("area.not_finished_text1")}</p>
                        <p>{getTranslation("area.not_finished_text2")}</p>
                        <ul>
                            {this.props.pilotareas.map(area =>
                                <a key={area.id} href={"/webgis/"+area.uri}><li>{getTranslation(area.name)}</li></a>
                            )}
                        </ul>
                    </div>
                </div>
            }
                {((this.state.reportPane) || (this.state.infoPane)) &&
                    <div className="blur-me" onClick={() => this.hidePane()}></div>
                }
                
                <div className="webgis-header">
                    <Header title="Web GIS" />
                </div>

                <div className="webgis-container">
                    <PilotAreaInfo activeLanguage={languageCode} activeArea={this.props.activeArea} show={this.state.infoPane} bounds={this.props.bounds} hidePane={() => this.hidePane()} />
                    <MapView measurements={this.props.measurements} showMeasurements={this.state.measurements} map={this.mapRef} mapRef={el => this.mapRef = el} locationCenter={() => this.locationCenter()} expertCenter={this.state.expertCenter} expertMarkers={this.state.expertMarkers} addressCenter={this.state.addressCenter} fetching={this.props.fetching} center={this.state.center} addressMarkers={this.state.addressMarkers} reportLayers={layers.reportLayers} showReport={() => this.showReport()} query={this.props.query} language={activeLanguage} locationQuery={this.props.locationQuery} activeLayer={layers.activeLayer} activeArea={this.props.activeArea} bounds={this.props.bounds} report={this.props.report} />
                    {this.state.infoOverlay &&
                        <InfoOverlay closeOverlay={() => this.closeOverlay()} />
                    }
                    <Menu showMeasurements={this.state.measurements} toggleMeasurements={() => this.toggleMeasurements()} measurements={this.props.measurements} switchDialog={() => this.switchDialog()} zoomToExpert={(id) => this.zoomToExpert(id)} showInfoPane={() => this.showInfoPane()} localExperts={this.props.localExperts} addressSearchSuccess={(newCenter) => this.addressSearchSuccess(newCenter)} fetching={this.props.fetching} geocodeAddress={this.props.geocodeAddress} toggleLayer={(layers) => this.toggleLayer(layers)} expertGroups={this.props.expertGroups} layers={layers.gisLayers} activeArea={this.props.activeArea} bounds={this.props.bounds} pilotareas={this.props.pilotareas} activeLanguage={activeLanguage} />
                    <ReportPane units={this.props.units} explanatorynotes={this.props.explanatorynotes} virtualBorehole={this.props.virtualBorehole} fetching={this.props.fetching} generatePDF={this.props.generatePDF} zoomToQuery={(coords) => this.zoomToQuery(coords)} locationQuery={this.props.locationQuery} activeLayer={layers.activeLayer} reportQuery={this.props.reportQuery} layers={layers.reportLayers} gisLayers={layers.gisLayers} params={this.props.match.params} query={this.props.query} activeArea={this.props.activeArea} explanatorynotes={this.props.explanatorynotes} activeLanguage={activeLanguage} report={this.props.report} hidePane={() => this.hidePane()} show={this.state.reportPane} language={this.props.language} />
                    {layers.activeLayer &&
                        <Legend activeLanguage={activeLanguage} activeLayer={layers.activeLayer} />
                    }
                    
                </div>
            </div>
        )
    }
}

export default WebGis;