import React from 'react';
import getTranslation from '../../../../i18n/'
import AddressSearch from '../../AddressSearch';

/**
 * The menu of the web gis. Users can select the active layer that is displayed here
 */
class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeExperts: null,
            showMenuItems: false,
            switchDialog: false
        }

        this.get3DLink = this.get3DLink.bind(this);
    }

    /**
     * Change the active layer
     * @param  {} id - ID of the new active layer
     */
    toggleLayer(id) {
        let layers = this.props.layers;
        layers.map(layer => {
            if(layer.id === id) {
                if(id < 100) {
                    layer.active = !layer.active;
                } else {
                    layer.active = !layer.active;
                    if(layer.children.length > 0) {
                        layer.children.map(child => {
                            if(child.id === id) {
                                child.active = !child.active
                            }
                        })
                    }
                }
            } else {
                if(id < 100) {
                    layer.children.map(child => {
                        if(child.id === id) {
                             child.active = true;
                             layer.active = true;
                             
                        } else {
                            if(child.children.length > 0) {
                                child.children.map(chi => {
                                    if(chi.id === id) {
                                        chi.active = true;
                                    } else {
                                        chi.active = false
                                    }
                                    
                                })
                            } else {
                                child.active = false;
                            }
                            
                        }
                    })
                } else {
                    if(layer.children.length > 0) {

                        layer.children.map(child => {
                            if(child.id === id) {
                                child.active = !child.active
                            }
                        })
                    }
                }
            }
        })
        this.props.toggleLayer(layers);
    }

    /**
     * Get the proper link to the 3d Model
     */
    get3DLink() {
        if ( this.props.activeArea.id && this.props.activeArea.id && this.props.activeArea.id) {
            switch(this.props.activeArea.id) {
                case 3: // "vogtland-w-bohemia"
                    return (<h2><a class="model_link_3d" target="_blank" href="https://geo-vi.giga-infosystems.com/webgui/?viewHash=1573c7dff57f1ab4472f110ed2c3efae">3D Model</a></h2>);
                // case 5: // "walbrzych-broumov"
                //    return (<h2><a class="model_link_3d" target="_blank" href="https://geo-vi.giga-infosystems.com/">3D Model</a></h2>);
                case 1: // "vienna"
                    return (<h2><a class="model_link_3d" target="_blank" href="https://geo-vi.giga-infosystems.com/webgui/?viewHash=914cbaa1c67338b33b1fb87d156f369a">3D Model</a></h2>);
                case 2: // "bratislava"
                    return (<h2><a class="model_link_3d" target="_blank" href="https://geo-vi.giga-infosystems.com/webgui/?viewHash=771a06886b64569d07c2c9cd2ad3fa2c">3D Model</a></h2>);
                case 4: // "ljubljana"
                    return (<h2><a class="model_link_3d" target="_blank" href="https://geo-vi.giga-infosystems.com/webgui/?viewHash=03be4a2c72b3dc2149ffd11b53e7037d">3D Model</a></h2>);
                case 6: // "krakow"
                    return (<h2><a class="model_link_3d" target="_blank" href="https://geo-vi.giga-infosystems.com/webgui/?viewHash=d5c7b161199e7e301d36218553ef641e">3D Model</a></h2>);
                case 5:
                default:
                    return "";
            }
        } else {
            return "";
        }
    }

    /**
     * Toggle full menu display (mobile only)
     */
    toggleMenuItems() {
        this.setState({ showMenuItems: !this.state.showMenuItems })
    }

    /**
     * Show local experts of a selected occupation on the map
     * @param {*} group - Selected group of experts
     */
    showExperts(group) {
        if(group !== this.state.activeExperts) {
          if(group === 0) {
            this.setState({ experts : this.props.localExperts, activeExperts: 0 })
          } else {
            this.setState({ experts : this.props.localExperts.filter(expert => expert.occupation.indexOf(group) !== -1), activeExperts: group})
          }
        }
      }

    /**
     * Zoom the map to a local expert
     * @param {} id - ID of the expert
     */
    zoomToExpert(id) {
        this.props.zoomToExpert(id)
    }

    render() {
        const order = ["general_information", "open-loop_potential", "closed-loop_potential", "conflict_map"];

        let layers = [];
        order.map(item => {
            let layerItem = this.props.layers.find(layer => layer.group_key === item);
            if(layerItem) layers.push(layerItem);
        })
        
        return(
            <div className="webgis-menu">
            
                <div className="webgis-menu-header">
                <h2 className="area-name">
                    <span className="area-title" onClick={this.props.showInfoPane}><i className="fas fa-info-circle" aria-hidden="true"></i>
                    {this.props.activeArea.uri ? getTranslation(this.props.activeArea.name) : 'Pilotarea'}</span><span className="show-menu-items" onClick={() => this.toggleMenuItems()}><i className="fas fa-caret-down"></i></span><span className="switch-dialog" onClick={this.props.switchDialog}><i className="fa fa-bars" aria-hidden="true"></i></span>
                </h2>
                </div>
                <div className={"menu-items "+(this.state.showMenuItems ? "show-menu" : "hide-menu")}>
                    <AddressSearch addressSearchSuccess={this.props.addressSearchSuccess} boundary={this.props.bounds} fetching={this.props.fetching} geocodeAddress={this.props.geocodeAddress} />
                    <h2>{getTranslation("webgis.layers")}:</h2>
                    <ul className="layer-list">
                        {layers.map(layer =>
                            <React.Fragment key={layer.id}>
                            {layer.webgis &&
                                <li className={((layer.children.length > 0) && (layer.active) ? "submenu-active " : "webgis-sub-not-open ") + (((layer.active) && (layer.children.length === 0)) ? "active-layer" : "not-active-layer")} key={layer.id}>
                                <span onClick={() => this.toggleLayer(layer.id)}>{(layer.children.length > 0 ? getTranslation(layer.group_key+".label") : getTranslation(layer.key+".label"))}</span>
                                {((layer.children.length !== 0) && (layer.active)) &&
                                    <ul className="webgis-submenu">
                                        {layer.children.map(sublayer =>
                                            <React.Fragment key={sublayer.id}>
                                            {sublayer.webgis &&
                                                <li className={((sublayer.active && sublayer.children.length === 0) ? "active-layer " : "not-active-layer " + (sublayer.children.length > 0 ? "sublayer-children" : "no-sublayer-children"))} key={sublayer.id}>
                                                <span onClick={() => this.toggleLayer(sublayer.id)}>{getTranslation(sublayer.key+".label")}</span>
                                                {((sublayer.children.length !== 0) && (sublayer.active)) &&
                                                    <ul className="webgis-submenu">
                                                        {sublayer.children.map(subsublayer =>
                                                            <React.Fragment key={subsublayer.id}>
                                                            {subsublayer.webgis &&
                                                                <li className={(subsublayer.active ? "active-layer" : "not-active-layer")} key={subsublayer.id}><span onClick={() => this.toggleLayer(subsublayer.id)}>{subsublayer.short_description[this.props.activeLanguage] ? subsublayer.short_description[this.props.activeLanguage] : subsublayer.short_description.English}</span></li>
                                                            }
                                                            </React.Fragment>
                                                        )}
                                                    </ul>
                                                }
                                                </li>
                                            }
                                            </React.Fragment>
                                        )}
                                    </ul>
                                }
                                </li>
                            }
                            </React.Fragment>
                        )}
                        {this.props.measurements.length > 0 &&
                            <li onClick={() => this.props.toggleMeasurements()} className={(this.props.showMeasurements ? 'active-layer' : 'not-active-layer')}><span className="field-measurement"><i className="fas fa-map-marked"></i> {getTranslation("webgis.field_measurements")}</span></li>
                        }
                    </ul>
                    {this.get3DLink()}
                    <h2>{getTranslation("local_experts.label")}:</h2>
                    <ul className="experts-local">
                    {this.props.expertGroups.map(group =>
                        <li className={(this.state.activeExperts === group.id ? "active-layer submenu-active" : "not-active-layer")} onClick={() => this.showExperts(group.id)} key={"group-"+group.id}>{getTranslation(group.label)} <span className="expert-count">{group.count}</span>
                        {this.state.activeExperts === group.id &&
                            <ul className="webgis-submenu">
                                {this.state.experts.map(expert =>
                                <li key={expert.id} className="not-active-layer" onClick={() => this.zoomToExpert(expert.id)}>{expert.name}, <strong>{expert.city}</strong></li>
                                )}
                            </ul>
                        }
                        </li>
                    )}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Menu;