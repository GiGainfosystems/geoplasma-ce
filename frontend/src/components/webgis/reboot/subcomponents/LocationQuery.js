import React from 'react';
import { Popup } from 'react-leaflet';
import ExtendedMarker from '../../ExtendedMarker';
import createContextProvider from '../../ContextProvider';
import PropTypes from 'prop-types'
import getTranslation from '../../../../i18n/'
import { extractValueFromQuery } from '../helper/extractValueFromQuery'
import leaflet from 'leaflet'
import marker from 'leaflet/dist/images/marker-icon.png';

/**
 * Location query popup window
 */
class LocationQuery extends React.Component {

    static contextTypes = {
        router: PropTypes.object,
    };

    /**
     * Show the report pane with a full report for the queried location
     */
    showReport() {
        this.props.showReport();
    }
    
    render() {
        const ContextProvider = createContextProvider(this.context);
        const value = (this.props.query.value !== undefined ? extractValueFromQuery(this.props.activeLayer, this.props.query.value, this.props.language) : '');
        let noicon = leaflet.icon({
            iconUrl: marker,
            iconSize: [0,0], // size of the icon
            iconAnchor: [0,0], // point of the icon which will correspond to marker's location
            popupAnchor: [0,0]
        });
        return(
            <ExtendedMarker icon={noicon} position={[this.props.query.lat, this.props.query.lng]}>
                <Popup onClose={this.props.resetLocationQuery}>
                <ContextProvider>
                    <div>
                        <h3>{getTranslation("webgis.location_query")}</h3>
                        <div className="geoplasma-popup-content">
                            <p><strong>{getTranslation("webgis.coordinates")}:</strong> <i className="fa fa-location-arrow" aria-hidden="true"></i> {Math.round(this.props.query.lat * 10000) / 10000+ " - "+ Math.round(this.props.query.lng * 10000) / 10000}</p>
                            {this.props.report.address &&
                                <p><strong>{getTranslation("webgis.address")}</strong><br />{this.props.report.address}</p>
                            }
                            {value !== false &&
                                <p><strong>{getTranslation(this.props.activeLayer.key+".label")}:</strong>
                                    {this.props.query.isFetching &&
                                        <span><br />{getTranslation("webgis.loading")}...</span>
                                    }
                                    {!this.props.query.isFetching &&
                                        <span><br />
                                            {(value != '-9999' ? value : '-')} 
                                            {this.props.activeLayer.unit_of_cell_related_parameter !== 'none' &&
                                                <React.Fragment> {value != '-9999' ? this.props.activeLayer.unit_of_cell_related_parameter : ''}</React.Fragment>
                                            }
                                        </span>
                                    }
                                </p>
                            }
                            {value === false &&
                                <p>{getTranslation("webgis.outside")}</p>
                            }
                            {(value !== false && this.props.query.value !== undefined ) &&
                            <React.Fragment>
                                <p>{getTranslation("webgis.locationquery_text")}</p>
                                <div className="popup-buttons">
                                    <button className="btn btn-green" onClick={() => this.showReport()}>{getTranslation("webgis.standard_report")}</button>
                                </div>
                            </React.Fragment>
                            }
                            
                        </div>
                    </div>
                    </ContextProvider>
                </Popup>
            </ExtendedMarker>
        )
    }
}

export default LocationQuery