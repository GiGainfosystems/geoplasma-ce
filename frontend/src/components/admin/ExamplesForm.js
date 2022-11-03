import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import Select from 'react-select';
import './Superuser.css'
import getTranslation from '../../i18n/'
import Rte from './Rte'

/**
 * The form to add or edit case studies
 */
class ExamplesForm extends Component {

    constructor(props) {
        super(props);
        // Form state
        this.state = {
            redirect: false,
            id :0,
            pilotarea_id: 1,
            title: '',
            address_of_project: '',
            gps_coordinates: '',
            usage_form: '',
            heating_capacity: '',
            heating_production: '',
            cooling_capacity: '',
            cooling_production: '',
            seasonal_performance: '',
            number_of_tubes_wells: '',
            depth_of_tubes_wells: '',
            geothermal_coverage_rate: '',
            supply_temperature_borehole: '',
            supply_temperature_heating: '', 
            supply_temperature_cooling: '',
            planning_company: '',
            specialties_of_project: '',
            drilling_company: '',
            heating_installer: '',
            thermal_response_test: '',
            year_of_installation: '',
            web_link: '',
            description: '',
            introduction: '',
            deleteButton: false,
            deleteButtonExpanded: false
        }
    }

    componentDidMount() {
        if(Number(this.props.id) !== 0) {
          this.updateProps(this.props);
        }

        if(!this.props.user.superuser) {
            this.setState({redirect: true})
        }
    }

    /**
     * Update the field state on input
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value; 
        this.setState({ [name] : value });
    }

    /**
     * Submit the form by calling the saveExample action with the form state + token
     */
    submitForm() {
        const token = this.props.cookie.token;
        let redirect = true;

        this.props.saveExample(this.state.id, this.state.pilotarea_id, this.state.title, this.state.address_of_project, this.state.gps_coordinates, this.state.usage_form, this.state.heating_capacity, this.state.heating_production, this.state.cooling_capacity, this.state.cooling_production, this.state.seasonal_performance, this.state.number_of_tubes_wells, this.state.depth_of_tubes_wells, this.state.geothermal_coverage_rate, this.state.supply_temperature_borehole, this.state.supply_temperature_heating, this.state.supply_temperature_cooling, this.state.planning_company, this.state.specialties_of_project, this.state.drilling_company, this.state.heating_installer, this.state.thermal_response_test, this.state.year_of_installation, this.state.web_link, this.state.description, this.state.introduction,token)
        this.setState({redirect: redirect })
    }

    updateProps(nextProps) {
        let filter = nextProps.examples.filter(example => example.id === Number(nextProps.id));
        
        if(filter.length > 0) {
            filter = filter[0];
            this.setState({
                id : filter.id,
                pilotarea_id: filter.pilotarea_id,
                title: filter.title,
                address_of_project: filter.address_of_project,
                gps_coordinates: filter.gps_coordinates,
                usage_form: filter.usage_form,
                heating_capacity: filter.heating_capacity,
                heating_production: filter.heating_production,
                cooling_capacity: filter.cooling_capacity,
                cooling_production: filter.cooling_production,
                seasonal_performance: filter.seasonal_performance,
                number_of_tubes_wells: filter.number_of_tubes_wells,
                depth_of_tubes_wells: filter.depth_of_tubes_wells,
                geothermal_coverage_rate: filter.geothermal_coverage_rate,
                supply_temperature_borehole: filter.supply_temperature_borehole,
                supply_temperature_heating: filter.supply_temperature_heating, 
                supply_temperature_cooling: filter.supply_temperature_cooling,
                planning_company: filter.planning_company,
                specialties_of_project: filter.specialties_of_project,
                drilling_company: filter.drilling_company,
                heating_installer: filter.heating_installer,
                thermal_response_test: filter.thermal_response_test,
                year_of_installation: filter.year_of_installation,
                web_link: filter.web_link,
                description: filter.description,
                introduction: filter.introduction,
                deleteButton: true
            })
        }

    }

    componentWillReceiveProps(nextProps) {
        if(Number(nextProps.id) !== 0) {
            this.updateProps(nextProps);
        }
    }

    /**
     * Toggle the delete buttons
     */
    toggleDelete() {
        this.setState({deleteButtonExpanded: !this.state.deleteButtonExpanded})
    }

    /**
     * Change the selected pilot area (custom select field)
     * @param  {} value
     */
    changePilotArea(value) {
        this.setState({pilotarea_id: value.value})
    }

    /**
     * Update the description state (rich text editor)
     * @param  {} input
     */
    updateText(input) {
        this.setState({description: input});
    }

    render() {
        let pilotareas = [];
        this.props.pilotareas.map(area =>
            pilotareas.push({
                value: area.id,
                label: getTranslation(area.name)
            })
        )

        return(
            <div>
            {this.state.redirect &&
                <Redirect to="/experts/superuser" />
            }
               <Header />
              <div className="container container-small">
                <Subheader title="expert.subheader.title.contribute" />
                <div className="default-element">

                  <div className="default-element-content">
                  <h4><i className="fa fa-calendar" aria-hidden="true"></i> Example</h4>

                  <div className="user-profile form-container">

                      <div className="form-item">
                        <label className="centered">Title:</label>
                        <input name="title" type="text" value={this.state.title} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Pilotarea:</label>
                        <Select
                            name="pilotarea_id"
                            value={Number(this.state.pilotarea_id)}
                            options={pilotareas}
                            clearable={false}
                            onChange={(value) => this.changePilotArea(value)}
                        />
                      </div>
                      <div className="form-item">
                        <label className="centered">Address of Project:</label>
                        <input name="address_of_project" type="text" value={this.state.address_of_project} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">GPS:</label>
                        <input name="gps_coordinates" type="text" value={this.state.gps_coordinates} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Usage form:</label>
                        <input name="usage_form" type="text" value={this.state.usage_form} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Heating capacity:</label>
                        <input name="heating_capacity" type="text" value={this.state.heating_capacity} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Heating production:</label>
                        <input name="heating_production" type="text" value={this.state.heating_production} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Cooling capacity:</label>
                        <input name="cooling_capacity" type="text" value={this.state.cooling_capacity} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Cooling production:</label>
                        <input name="cooling_production" type="text" value={this.state.cooling_production} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Seasonal performance:</label>
                        <input name="seasonal_performance" type="text" value={this.state.seasonal_performance} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Number of tubes / wells:</label>
                        <input name="number_of_tubes_wells" type="text" value={this.state.number_of_tubes_wells} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Depth of tubes / wells:</label>
                        <input name="depth_of_tubes_wells" type="text" value={this.state.depth_of_tubes_wells} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Geothermal coverage rate:</label>
                        <input name="geothermal_coverage_rate" type="text" value={this.state.geothermal_coverage_rate} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Supply temperature borehole:</label>
                        <input name="supply_temperature_borehole" type="text" value={this.state.supply_temperature_borehole} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Supply temperature heating:</label>
                        <input name="supply_temperature_heating" type="text" value={this.state.supply_temperature_heating} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Supply temperature cooling:</label>
                        <input name="supply_temperature_cooling" type="text" value={this.state.supply_temperature_cooling} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Thermal response test:</label>
                        <input name="thermal_response_test" type="text" value={this.state.thermal_response_test} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Year of installation:</label>
                        <input name="year_of_installation" type="text" value={this.state.year_of_installation} onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Web link:</label>
                        <input name="web_link" type="text" value={this.state.web_link} onChange={(event) => this.updateField(event)} />
                      </div>
                     

                    
                      <div className="form-item">
                        <label className="centered">Planning company:</label>
                        <textarea name="planning_company" rows="8" value={this.state.planning_company} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Specialties of project:</label>
                        <textarea name="specialties_of_project" rows="8" value={this.state.specialties_of_project} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Drilling company:</label>
                        <textarea name="drilling_company" rows="8" value={this.state.drilling_company} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Heating installer:</label>
                        <textarea name="heating_installer" rows="8" value={this.state.heating_installer} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Description:</label>
                        <Rte content={this.state.description} updateText={(input) => this.updateText(input)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Introduction:</label>
                        <textarea name="introduction" rows="8" value={this.state.introduction} onChange={(event) => this.updateField(event)}></textarea>
                      </div>

                     


                      <div className="user-profile-item">
                      <button className="btn btn-green btn-icon btn-save" onClick={() => this.submitForm()}>Save unit</button>
                      <Link to="/experts/superuser"><button className="btn btn-gray btn-icon btn-cancel">{getTranslation("forms.general.button.cancel")}</button></Link>
                      {((!this.state.deleteButtonExpanded) && (this.state.deleteButton)) &&
                          <button className="btn btn-red btn-icon btn-delete" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.delete")}</button>
                      }
                      {this.state.deleteButtonExpanded &&
                          <span>
                              <button className="btn btn-red btn-icon btn-delete" onClick={() => this.removeUnit()}>{getTranslation("forms.general.button.confirm_delete")}</button>
                              <button className="btn btn-gray btn-icon btn-cancel" onClick={() => this.toggleDelete()}>{getTranslation("forms.general.button.cancel_delete")}</button>
                          </span>
                      }
                      </div>


                  </div>
                  </div>
              </div>
            </div>
            </div>
        )
    }
}

export default ExamplesForm
