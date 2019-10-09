import React from 'react';
import { ZoomControl, ScaleControl, Map, Marker, Popup, WMSTileLayer } from 'react-leaflet';
import GrayTile from '../../GrayTile'
import config from '../../../../config'
import { featureRequest } from '../../helper'
import LocationQuery from './LocationQuery'
import leaflet from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import markergreen from '../../marker-green.png';
import markershadow from 'leaflet/dist/images/marker-shadow.png';
import createContextProvider from '../../ContextProvider';
import FieldMeasurementPopup from './FieldMeasurementPopup'
import getTranslation from '../../../../i18n/'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

/**
 * The map component that controls what is displayed in the web GIS
 */
class MapView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            center: [0, 0],
            zoom: 6,
            opacity: 0.5,
            markers: [],
            addressMarkers: [],
            expertMarkers: [],
            locationQueryLayer: undefined
        }
    }

    /**
     * Handle the event that a user clicks on the map to create a location query request
     * @param {*} event 
     */
    handleClick(event) {
        let map = this.props.map.leafletElement
        let markers = []
        let marker  = [event.latlng.lat, event.latlng.lng];
        markers.push(marker)
        let bounds = [ map.getBounds().getNorth() , map.getBounds().getEast(), map.getBounds().getSouth(), map.getBounds().getWest() ];
        let params = featureRequest(this.props.activeArea.uri, [ this.props.activeLayer ], bounds, [map.getSize().x, map.getSize().y], [ Math.floor(event.containerPoint.x), Math.floor(event.containerPoint.y)])
        let reportParams = featureRequest(this.props.activeArea.uri, this.props.reportLayers, bounds, [map.getSize().x, map.getSize().y], [ Math.floor(event.containerPoint.x), Math.floor(event.containerPoint.y)])


        this.props.locationQuery(params, reportParams, this.props.reportLayers, [event.latlng.lat, event.latlng.lng]);
        this.props.locationCenter();
        this.setState({ markers: markers, locationQueryLayer: this.props.activeLayer, center: event.latlng, zoom: event.target._zoom })
    }

    /**
     * Reset the location query (report pane is closed)
     */
    resetLocationQuery() {
        this.setState({markers: []})
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.center) {
            let markers = []
            if(nextProps.fetching.dataFetching.data !== 'geocode') {
                let marker  = [nextProps.center[0], nextProps.center[1]];
                markers.push(marker)
            }
            this.setState({center: nextProps.center, zoom: 12, markers: markers})
        }
        if(nextProps.addressCenter) {
            if(nextProps.fetching.dataFetching.data === 'geocode') {
                this.setState({center: nextProps.addressCenter, zoom: 15, addressMarkers: [nextProps.addressCenter]})
            }
        }

        if(nextProps.expertCenter) {
            this.setState({center: nextProps.expertCenter, zoom: 15, expertMarkers: nextProps.expertMarkers})
        }
    }

    static contextTypes = {
        router: PropTypes.object,
      };

    render() {
        const ContextProvider = createContextProvider(this.context);

        // Icon for address markers
        const redicon = leaflet.icon({
            iconUrl: marker,
            shadowUrl: markershadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, 1]
        });

        // Icon for field measurements
        const greenicon = leaflet.icon({
            iconUrl: markergreen,
            shadowUrl: markershadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, 1]
        });    
        
        return (
            <Map ref={this.props.mapRef} onClick={(event) => this.handleClick(event)} zoomControl={false} useFlyTo={false} center={this.state.center} bounds={this.props.bounds} zoom={this.state.zoom}>
                <ZoomControl position="topright"></ZoomControl>
                <ScaleControl position="bottomleft"></ScaleControl>
                <GrayTile
                url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <WMSTileLayer url={config.geoServerUrl+"/geoserver/general/wms"} format="image/png" layers="general:Pilot_Areas" transparent={true} opacity={1} />
                {((this.props.activeArea.uri) && (this.props.activeLayer.uri)) &&
                    <WMSTileLayer url={config.geoServerUrl+"/geoserver/gwc/service/wms?tiled=true"} format="image/png" layers={this.props.activeArea.uri+":"+this.props.activeLayer.uri} transparent={true} opacity={this.state.opacity} />
                }
                {this.state.markers.map((marker, index) =>
                    <LocationQuery key={index} report={this.props.report} showReport={this.props.showReport} resetLocationQuery={() => this.resetLocationQuery()} language={this.props.language} query={this.props.query} activeLayer={this.state.locationQueryLayer} activeArea={this.props.activeArea} />
                )}
                {this.props.showMeasurements &&
                    <React.Fragment>
                    {this.props.measurements.map(measured =>
                        <Marker ref="address-marker" key={measured.object_id} icon={greenicon} position={measured.coordinates}>
                            <Popup maxHeight={300} minWidth={400}>
                            <div className="expert-profile">
                                
                                <FieldMeasurementPopup data={measured} />
                                
                            </div>
                            </Popup>
                        </Marker>
                    )}
                    </React.Fragment>
                }
                {this.state.addressMarkers.map(newmarker =>
                    <Marker ref="address-marker" key={newmarker} icon={redicon} position={newmarker}>
                    <Popup>
                        <ContextProvider>
                            <div className="expert-profile">
                            <p>
                            <strong>{newmarker.address}</strong><br />
                            </p>
                            </div>
                        </ContextProvider>
                    </Popup>
                    </Marker>
                )}
                 {this.state.expertMarkers.map(newmarker =>
                    <Marker ref={"expert-"+newmarker.expert.id} key={newmarker.expert.id} icon={redicon} position={newmarker.position}>
                        <Popup>
                        <ContextProvider>
                            <div className="expert-profile">
                            <p>
                            <strong>{newmarker.expert.name}</strong><br />

                            <div className="expert-list">
                                <ul>
                                {newmarker.expert.professions.map(profession =>
                                <li>{getTranslation(profession)}</li>
                                )}
                                </ul>
                            </div>
                            {getTranslation("userprofile.form.phone.label")}: {newmarker.expert.phone}<br />
                            {getTranslation("forms.general.email.label")}: {newmarker.expert.email}<br />
                            <a href={newmarker.expert.website}><i className="fas fa-angle-right" aria-hidden="true"></i> {getTranslation("userprofile.form.website.label")}</a><br /><br />
                            <Link to={"/experts/yellow-pages/"+newmarker.expert.id}><i className="fa fa-address-book"></i> {getTranslation("webgis.fullprofile")}</Link>
                            </p>
                            </div>
                        </ContextProvider>
                        </Popup>
                    </Marker>
                )}
            </Map>
        )
    }
}

export default MapView;