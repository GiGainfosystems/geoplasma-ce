import React, { Component } from 'react'
import getTranslation from '../../i18n/'

/**
 * Address search component in the web GIS
 */
class AddressSearch extends Component {

    constructor(props) {
        super(props)
        this.state = { address: '', doSearch: false, searchError: false, lastSearches: []}
    }

    /**
     * Send the action to create a request to nominatim for geocoding of the user input
     * @param {*} event 
     */
    geocodeAddress(event) {
      event.preventDefault();
        if(this.state.address !== '') {
            this.setState({doSearch: true})
            this.props.geocodeAddress(this.state.address)
        }
    }

    /**
     * Update the search field state
     * @param {} event 
     */
    updateField(event) {
        this.setState({address: event.target.value})
    }

    /**
     * Close the error message popup
     */
    closeInfo() {
        this.setState({searchError: false})
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.doSearch) {
            let lat, lon;
            let notInPilotarea = true;
            let lastSearches = this.state.lastSearches
            if((nextProps.fetching.dataFetching.data === 'geocode') && (nextProps.fetching.dataFetching.status) && (!nextProps.fetching.dataFetching.isFetching)) {
                lat = nextProps.fetching.dataFetching.coordinates[0];
                lon = nextProps.fetching.dataFetching.coordinates[1];
                if((lat <= parseFloat(this.props.boundary[0][0])) && (lat >= parseFloat(this.props.boundary[1][0]))) {
                    if((lon <= parseFloat(this.props.boundary[0][1])) && (lon >= parseFloat(this.props.boundary[1][1]))) {
                        notInPilotarea = false;
                        lastSearches.push(this.state.address);
                    }
                }
                let newCenter = [lat, lon]
                if(!notInPilotarea) {
                    newCenter.address = this.state.address;
                    this.props.addressSearchSuccess(newCenter);
                }
                this.setState({doSearch: false, searchError : notInPilotarea, lastSearches: lastSearches})
            }
        }

    }

    render() {
        return(
            <div className="address-search">
                <form onSubmit={(event) => this.geocodeAddress(event)}>
                  <input type="text" onChange={(event) => this.updateField(event)} value={this.state.address} placeholder={getTranslation("search_address.label")} />
                  <button type="submit" className="btn btn-green"><i className="fa fa-search" aria-hidden="true"></i></button>
                </form>
                {this.state.searchError &&
                    <div className="error-popup">{getTranslation("search_address.notfound")} <i className="fa fa-times" aria-hidden="true" onClick={() => this.closeInfo()}></i></div>
                }

            </div>
        )
    }

}

export default AddressSearch
