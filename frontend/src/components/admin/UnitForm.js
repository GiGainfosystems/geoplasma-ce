import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Redirect, Link } from 'react-router-dom'
import Select from 'react-select';
import './Superuser.css'
import getTranslation from '../../i18n/'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

/**
 * Form to add or edit a unit for the virtual boreholes
 */
class UnitForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            id: 0,
            pilotarea_id: 1,
            title_en: '',
            title_de: '',
            title_cz: '',
            title_pl: '',
            title_sk: '',
            title_sl: '',
            identifier: '',
            description_de: '',
            description_en: '',
            description_sk: '',
            description_sl: '',
            description_pl: '',
            description_cz: '',
            errors: [],
            color: '',
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
     * Save the unit by dispatching the save
     */
    submitForm() {
    
        let token = cookies.get('token');
        let redirect = true;

        this.props.saveUnit(this.state.id, this.state.color, this.state.pilotarea_id, this.state.identifier, this.state.title_en, this.state.title_de, this.state.title_cz, this.state.title_pl, this.state.title_sk, this.state.title_sl, this.state.description_en, this.state.description_de, this.state.description_cz, this.state.description_pl, this.state.description_sk, this.state.description_sl, token)
        this.setState({redirect: redirect })
    }

    updateProps(nextProps) {
        
        let filter = nextProps.units.filter(unit => unit.id === Number(nextProps.id));
        
        if(filter.length > 0) {
            filter = filter[0];
            this.setState({
                id: filter.id,
                pilotarea_id: filter.pilotarea_id,
                title_en: filter.title_en,
                title_de: filter.title_de,
                title_cz: filter.title_cz,
                title_pl: filter.title_pl,
                title_sk: filter.title_sk,
                title_sl: filter.title_sl,
                identifier: filter.identifier,
                description_de: filter.description_de,
                description_en: filter.description_en,
                description_sk: filter.description_sk,
                description_sl: filter.description_sl,
                description_pl: filter.description_pl,
                description_cz: filter.description_cz,
                color: filter.color,
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
     * Remove the unit by dispatching the removeUnit action
     */
    removeUnit() {
        let token = cookies.get('token');
        this.props.removeUnit(this.props.id, token);
        this.setState({redirect: true})
    }

    changePilotArea(value) {
        this.setState({pilotarea_id: value.value})
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
                  <h4><i className="fa fa-calendar" aria-hidden="true"></i> Unit</h4>

                  <div className="user-profile form-container">

                      <div className="form-item">
                        <label className="centered">Identifier:</label>
                        <input name="identifier" type="text" value={this.state.identifier} placeholder="Enter the identifier here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Color:</label>
                        <input name="color" type="text" value={this.state.color} placeholder="Enter the color hexcode.." onChange={(event) => this.updateField(event)} />
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
                        <label className="centered">Title EN:</label>
                        <input name="title_en" type="text" value={this.state.title_en} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Title DE:</label>
                        <input name="title_de" type="text" value={this.state.title_de} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Title CZ:</label>
                        <input name="title_cz" type="text" value={this.state.title_cz} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Title PL:</label>
                        <input name="title_pl" type="text" value={this.state.title_pl} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Title SK:</label>
                        <input name="title_sk" type="text" value={this.state.title_sk} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>
                      <div className="form-item">
                        <label className="centered">Title SL:</label>
                        <input name="title_sl" type="text" value={this.state.title_sl} placeholder="Enter the title here.." onChange={(event) => this.updateField(event)} />
                      </div>


                      <div className="form-item">
                        <label className="centered">Description EN:</label>
                        <textarea name="description_en" rows="8" value={this.state.description_en} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Description DE:</label>
                        <textarea name="description_de" rows="8" value={this.state.description_de} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Description CZ:</label>
                        <textarea name="description_cz" rows="8" value={this.state.description_cz} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Description PL:</label>
                        <textarea name="description_pl" rows="8" value={this.state.description_pl} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Description SK:</label>
                        <textarea name="description_sk" rows="8" value={this.state.description_sk} onChange={(event) => this.updateField(event)}></textarea>
                      </div>
                      <div className="form-item">
                        <label className="centered">Description SL:</label>
                        <textarea name="description_sl" rows="8" value={this.state.description_sl} onChange={(event) => this.updateField(event)}></textarea>
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

export default UnitForm
