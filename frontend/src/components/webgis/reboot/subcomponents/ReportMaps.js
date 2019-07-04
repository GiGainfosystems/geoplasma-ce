import React from 'react';
import leaflet from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import markershadow from 'leaflet/dist/images/marker-shadow.png';
import GrayTile from '../../GrayTile'
import { ScaleControl, Map, Marker } from 'react-leaflet';

/**
 * The map that is displayed in the report pane
 */
class ReportMaps extends React.Component {

    render() {
        
        const icon = leaflet.icon({
            iconUrl: marker,
            shadowUrl: markershadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41]
        });
        
        const coords = this.props.params.lat ? [parseFloat(this.props.params.lat), parseFloat(this.props.params.lng)] : this.props.query.lat ? [this.props.query.lat, this.props.query.lng] : [0,0]
        return(
            <div className="report-map">
                <Map ref={this.props.mapRef} zoomControl={false} center={coords} zoom={14}>
                    <ScaleControl position="bottomleft"></ScaleControl>
                    <GrayTile
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker icon={icon} position={coords} />
                </Map>
            </div>
        )
    }
}

export default ReportMaps