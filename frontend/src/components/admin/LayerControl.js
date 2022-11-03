import React, { Component } from 'react'
import getTranslation from '../../i18n/'
import './LayerControl.css'

/**
* Via this component, the GeoServer is mainly controlled.
* Layers can be added to the web GIS after selecting a pilotarea
*/
class LayerControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            area: '',
            rejected: []
        }
    }

    /**
    * This function fetches the layers from the geoserver that area online
    * for the given pilotarea. It fetches via the getLayers action (SuperuserContainer -> Superuser -> LayerControl)
    *@param {string} area - the uri string of the pilotarea
    */
    getLayers(area) {
        this.props.getLayers(area);
        this.setState({ fetched: true, area: area })
    }

    /**
    * This function parses the Excel files for the specified pilotarea
    * The pilotarea was specified in the getLayers function
    * Parsing via the readExcelFile action (SuperuserContainer -> Superuser -> LayerControl)
    *@param {object} layers - the response object from the getLayers function
    * Function can only be called after the getLayers function (UI is hidden before)
    */
    checkExcelFile(layers) {
        /** Get the authorization token from the cookies */
        const token = this.props.cookies.token;
        this.props.readExcelFile(this.props.pilotareas.filter(area => area.uri === this.state.area)[0].excel_identifier, token, layers)
    }

    rejectLayer(index) {
      let rejected = this.state.rejected;
      rejected.push(this.props.fetching.dataFetching.message.compared.layers[index].filename)
      this.setState({ rejected: rejected})
    }

    /**
    * This function starts the proccess of copying the layers from the "Inbox" to our server
    * and adding them to the GeoServer for serving them to the web GIS
    * This happens via the addLayers action (SuperuserContainer -> Superuser -> LayerControl)
    * Function can only be called after checkExcelFile function (UI is hidden before)
    */
    addLayers() {
        /** Get the authorization token from the cookies */
        const token = this.props.cookies.token;
        let layers = this.props.fetching.dataFetching.message.compared.layers
        if(this.state.rejected.length > 0) {
          let accepted = [];
          layers.map(layer => {
            if(this.state.rejected.filter(rejected => rejected === layer.filename).length === 0) {
              accepted.push(layer);
            }

          })
          layers = accepted
        }

        this.props.addLayers(this.state.area, token, layers)
    }

    render() {
        let layers = [];
        if(this.props.layers.length > 0) {
            this.props.layers.map(layer => {
                if(layer.children.length === 0) {
                    layers.push(layer)
                } else {
                    layer.children.map(child => {
                        layers.push(child)
                    })
                }
            })
        } else {
            layers = this.props.layers;
        }
        return(

            <div className="layercontrol">
                <h3>Choose a pilot area</h3>
                <div className="btn-list">
                    {this.props.pilotareas.map(area =>
                        <button className="btn btn-green" onClick={() => this.getLayers(area.uri)}>{getTranslation(area.name)}</button>
                    )}
                </div>
                {this.state.fetched &&
                    <div className="layeradmin-panel">

                    {((this.props.fetching.dataFetching.data === 'getlayers') && (this.props.fetching.dataFetching.isFetching)) &&
                        <div className="layer-control-panel">
                        <div className="loader"></div>
                        </div>
                    }

                        {((this.props.fetching.dataFetching.data === 'getlayers') && (!this.props.fetching.dataFetching.isFetching) && (this.props.fetching.dataFetching.status)) &&
                            <div className="layer-control-panel">
                                <span>There are {layers.layers.length} layers online for the pilotarea {getTranslation(this.state.area)}</span>
                                <button className="btn btn-green" onClick={() => this.checkExcelFile(layers)}>Check the Excel file for the pilot area {getTranslation(this.state.area)}</button>
                            </div>
                        }

                        {((this.props.fetching.dataFetching.data === 'metadataquery') && (this.props.fetching.dataFetching.isFetching)) &&
                            <div className="layer-control-panel">
                            <div className="loader"></div>
                            </div>
                        }

                        {((this.props.fetching.dataFetching.data === "metadataquery") && (!this.props.fetching.dataFetching.isFetching) && (this.props.fetching.dataFetching.status)) &&
                            <div className="layer-control-panel">
                                {this.props.fetching.dataFetching.message.errors.length > 0 &&
                                    <div className="layer-control-errors">
                                    {this.props.fetching.dataFetching.message.errors.map(error =>
                                        <h2>{error}</h2>
                                    )}
                                    </div>
                                }
                                {this.props.fetching.dataFetching.message.errors.length === 0 &&
                                    <div className="layer-control-success">
                                        <h2>The excel file was loaded successfully</h2>

                                        {this.props.fetching.dataFetching.message.compared.messages.length > 0 &&
                                            <div>
                                                <ul>
                                                {this.props.fetching.dataFetching.message.compared.messages.map((message, index) =>
                                                    <li>{message} <button className="btn btn-red" onClick={() => this.rejectLayer(index)}>Reject</button></li>
                                                )}
                                                </ul>
                                                <button onClick={() => this.addLayers()} className="btn btn-green">Update webgis for {getTranslation(this.state.area)}</button>
                                            </div>
                                        }

                                    </div>
                                }
                            </div>
                        }
                    </div>

                   

                  
                }
                {((this.props.fetching.dataFetching.data === 'copylayer') && (this.props.fetching.dataFetching.isFetching)) &&
                    <div className="layer-control-panel">
                    <div className="loader"></div>
                    </div>
                }

                    {((this.props.fetching.dataFetching.data === 'copylayer') && (!this.props.fetching.dataFetching.isFetching) && (this.props.fetching.dataFetching.status)) &&
                        <div className="layer-control-panel">
                            <h2>Everything worked, the web GIS was updated for the pilot area of {getTranslation(this.state.area)}</h2>
                        </div>
                    }

                    {((this.props.fetching.dataFetching.data === 'copylayer') && (!this.props.fetching.dataFetching.isFetching) && (!this.props.fetching.dataFetching.status)) &&
                        <div className="layer-control-panel">
                            <h2>Oh no, an error occured!</h2>
                        </div>
                    }
            </div>
        )
    }
}

export default LayerControl
