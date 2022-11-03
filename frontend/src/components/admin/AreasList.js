import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'
const Fragment = React.Fragment;

/**
 * List the pilot areas that are available and make it possible to edit them
 */
class AreasList extends Component {

    constructor(props) {
        super(props);
        this.state= {
            activeArea: 0,
            excel_identifier: '',
            uri: '',
            ne_corner: '',
            sw_corner: '',
            contact_details: '',
            description_en: '',
            description_de: '',
            description_cs: '',
            description_pl: '',
            description_sk: '',
            description_sl: ''
        }

    }

    /**
     * Change the active pilotarea (showing the edit form for the active area)
     * @param  {} area
     */
    changeActiveArea(area) {
        let selectedArea = this.props.pilotareas.filter(pilotarea => pilotarea.id === area)[0];
        this.setState({
            activeArea: area,
            excel_identifier: selectedArea.excel_identifier,
            uri: selectedArea.uri,
            ne_corner: selectedArea.ne_corner,
            sw_corner: selectedArea.sw_corner,
            contact_details: selectedArea.contact_details,
            description_en: selectedArea.description_en,
            description_de: selectedArea.description_de,
            description_cs: selectedArea.description_cs,
            description_pl: selectedArea.description_pl,
            description_sk: selectedArea.description_sk,
            description_sl: selectedArea.description_sl
        })
    }

    /**
    * Updates the form state on change
    *@param {event} event - The change event for the active input
    */
    changeField(event) {
      this.setState({ [event.target.name] : event.target.value})
    }

    /**
     * Saves a changed pilotarea to the database by calling
     * the updateArea action which connects with the backend
     */
    saveArea() {
        /* Get the token of the Superuser from the cookie for authorization */
        const token = this.props.cookies.token;
        this.props.updateArea(this.state.activeArea, this.state.contact_details,this.state.excel_identifier, this.state.uri, this.state.ne_corner, this.state.sw_corner, this.state.description_en, this.state.description_de, this.state.description_cs, this.state.description_pl, this.state.description_sk, this.state.description_sl, token)
    }

    /**
     * Uploads the pilotarea outlines to the geoserver
     * to display them in the web GIS via the uploadAreas action
     */
    uploadAreas() {
      /* Get token for authorization of Superuser */
      const token = this.props.cookies.token;
      /* Call uploadAreas action via props (SuperuserContainer > Superuser > AreasList) */
      this.props.uploadAreas(token);
    }

    render() {

        let areas = this.props.pilotareas;

        return(
            <div>
                <Link to="/experts/superuser/area"><button className="btn btn-green">Add a area</button></Link><br /><br />
                <button onClick={() => this.uploadAreas()} className="btn btn-green">Update pilot area outlines</button>

                    <table cellSpacing="0" className="superuser-table">
                        <tbody>
                            {areas.map((area, index) =>
                                <Fragment key={area.id}>
                                <tr className={(area.id === this.state.activeArea ? 'highlighted-row' : 'not-highlighted')} key={area.id}>
                                    <td onClick={() => this.changeActiveArea(area.id)}>{getTranslation(area.name)}</td>

                                </tr>
                                {area.id === this.state.activeArea &&
                                <tr className="highlighted-row">
                                    <td>
                                        <div className="form-group">
                                            <label>Area ID:</label>
                                            <input onChange={(event) => this.changeField(event)} type="text" name="excel_identifier" value={this.state.excel_identifier} />
                                        </div>
                                        <div className="form-group">
                                            <label>URI string:</label>
                                            <input onChange={(event) => this.changeField(event)} type="text" name="uri" value={this.state.uri} />
                                        </div>
                                        <div className="form-group">
                                            <label>NE corner:</label>
                                            <input onChange={(event) => this.changeField(event)} type="text" name="ne_corner" value={this.state.ne_corner} />
                                        </div>
                                        <div className="form-group">
                                            <label>SW corner:</label>
                                            <input onChange={(event) => this.changeField(event)} type="text" name="sw_corner" value={this.state.sw_corner} />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact details:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="contact_details" value={this.state.contact_details}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Description EN:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="description_en" value={this.state.description_en}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Description DE:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="description_de" value={this.state.description_de}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Description CZ:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="description_cs" value={this.state.description_cs}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Description PL:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="description_pl" value={this.state.description_pl}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Description SK:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="description_sk" value={this.state.description_sk}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Description SL:</label>
                                            <textarea rows="5" onChange={(event) => this.changeField(event)} type="text" name="description_sl" value={this.state.description_sl}>
                                            </textarea>
                                        </div>
                                        <div className="form-group">
                                            <button onClick={() => this.saveArea()} className="btn btn-green" type="submit">Save</button>
                                        </div>
                                    </td>
                                </tr>
                                }
                                </Fragment>
                            )}
                        </tbody>

                    </table>   
                </div>
      )
    }
}


export default AreasList
