import React from 'react'
import Metadata from '../../Metadata';
import getTranslation from '../../../../i18n/'

/**
 * Legend for the layer that is displayed in the web GIS
 */
class Legend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLegend: false,
            metadata: false
        }
    }

    /**
     * Toggle the visibility of the legend (mobile only)
     */
    toggleLegend() {
        this.setState({ showLegend: !this.state.showLegend })
    }
    
    /**
     * Toggle the metadata overlay
     */
    toggleMetadata() {
        this.setState({ metadata: !this.state.metadata })
    }

    render() {
        return (
            <div className="webgis-legend">
                {this.state.metadata &&
                    <Metadata toggleMetadata={() => this.toggleMetadata()} selected_layer={this.props.activeLayer} activeLanguage={this.props.activeLanguage} />
                }
                <div className="legend">
                    <p>
                        {(this.props.activeLayer.key !== undefined ? getTranslation(this.props.activeLayer.key+".label") : getTranslation("webgis.legend"))} 
                        {this.props.activeLayer.unit_of_cell_related_parameter !== 'none' &&
                            <React.Fragment> [{this.props.activeLayer.unit_of_cell_related_parameter}]</React.Fragment>
                        }
                        <span className="show-legend-items" onClick={() => this.toggleLegend()}><i className="fas fa-caret-down"></i></span><span className="metadata-button"><button className="btn btn-blue" onClick={() => this.toggleMetadata()}>{getTranslation("webgis.metadata")}</button></span>
                    </p>
                    {(this.props.activeLayer.legend !== undefined) &&
                        <ul className={"legend-list "+(this.state.showLegend ? "show-list" : "hide-list")}>
                            <li><span className="pilot-area-outline"></span> {getTranslation("pilot_area_outline.label")}</li>
                          
                            <React.Fragment>
                            {this.props.activeLayer.legend.map(entry =>
                                <li key={entry.quantity}><span style={{backgroundColor : entry.color}}></span> {(!entry.labels ? (((this.props.activeLayer.traffic_light_map_open_loop) || (this.props.activeLayer.traffic_light_map_closed_loop)) ? getTranslation(entry.label) : entry.quantity) : (entry.labels[this.props.activeLanguage] ? entry.labels[this.props.activeLanguage] : entry.labels.English))}</li>
                            )}
                            </React.Fragment>
                               
                        </ul>
                    }
                </div>
            </div>
        )
    }
}

export default Legend
