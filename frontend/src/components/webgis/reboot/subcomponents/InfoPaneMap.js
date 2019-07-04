import React from 'react';
import leaflet from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import markershadow from 'leaflet/dist/images/marker-shadow.png';
import GrayTile from '../../GrayTile'
import { ScaleControl, Map, WMSTileLayer } from 'react-leaflet';
import config from '../../../../config'

/**
 * Map that is displayed in the pilot area info pane
 */
class InfoPaneMap extends React.Component {

    render() {
        return(
            <div className="report-map">
                <Map zoomControl={false} ref='map_0' bounds={this.props.bounds} zoom={10}>
                    <ScaleControl position="bottomleft"></ScaleControl>
                    <GrayTile
                        url='http://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <WMSTileLayer url={config.geoServerUrl+"/geoserver/general/wms"} format="image/png" layers="general:Pilot_Areas" transparent={true} opacity={1} />
                </Map>
            </div>
        )
    }
}

export default InfoPaneMap