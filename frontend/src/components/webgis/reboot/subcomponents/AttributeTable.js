import React, { Component } from 'react'
import '../../reports/AttributeTable.css'
import getTranslation from '../../../../i18n/'

const Fragment = React.Fragment;

/**
 * The table that displays the conflict- and non-conflict layer value in the report pane
 */
class AttributeTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            key: '',
            id: 0
        }
        let layers = this.props.layers;
    }
    
    /**
     * Show an explanatory note
     * @param  {} key - layer key
     * @param  {} id - id (some layers appear twice in reports, so id is needed to show only one note)
     */
    showNote(key, id) {
      this.setState({showNote: key, id })
    }

    /**
     * Hide explanatory note
     */
    hideNote() {
        this.setState({ showNote: '', id: 0 })
    }

    render() {

        let conflictlayers = this.props.report.conflicts.filter(conflict => conflict.value !== 0);
        conflictlayers = conflictlayers.filter(layer => layer.hide === false);
        const activeLanguage = this.props.activeLanguage
        return(
            <div>
                {this.props.report.conflicts !== undefined &&
                    <div>

                {conflictlayers.length > 0 &&
                    <div className="attribute-table">
                      <div className="table-layer">
                        <h3 className="text-left"><i className="fas fa-exclamation-circle"></i> <span ref={this.props.conflictsRef}>{getTranslation("report.conflict_layer")}</span></h3>
                        <table cellSpacing="0" ref={this.props.tableRef}>
                        <tbody>
                        <tr className="thead">
                        <td className="text-left" colSpan={((this.props.report.traffic_light_maps.filter(map => map.is_open_loop_tlm === true).length === 0) || (this.props.report.traffic_light_maps.filter(map => map.is_closed_loop_tlm === true).length === 0)) ? 2 : 1}>{getTranslation("report.table.attribute")}</td>
                        {(this.props.report.traffic_light_maps.filter(map => map.is_open_loop_tlm === true).length > 0) &&
                            <td>{getTranslation("report.table.open_loop")}</td>
                        }
                        {(this.props.report.traffic_light_maps.filter(map => map.is_closed_loop_tlm === true).length > 0) &&
                            <td>{getTranslation("report.table.closed_loop")}</td>
                        }
                        </tr>
                        {conflictlayers[0].legend &&
                        <Fragment>
                        {conflictlayers.map((layer, index) =>
                            <Fragment key={index}>
                                <tr key={index} className="conflict-attribute">
                                    <td colSpan={((this.props.report.traffic_light_maps.filter(map => map.is_open_loop_tlm === true).length === 0) || (this.props.report.traffic_light_maps.filter(map => map.is_closed_loop_tlm === true).length === 0)) ? 2 : 1} className="font-small text-left flex-td">
                                        {((this.props.explanatorynotes.notes.length > 0) && (this.props.explanatorynotes.notes.filter(note => note.key == layer.key).length > 0)) &&
                                            <div className="explanatory">
                                                <button className="btn btn-blue" onClick={() => this.showNote(layer.key, index)}><i className="fas fa-info"></i></button>
                                                <div className={"explanatory-note " + ((this.state.showNote === layer.key && this.state.id === index) ? 'explanatory-note-show' : 'dont-show')}>
                                                    <div className="ex-note-close" onClick={() => this.hideNote()}><i className="fas fa-times"></i></div>     
                                                    <p>{(this.props.explanatorynotes.notes.filter(note => note.key == layer.key)[0]['explanatory_note_'+this.props.language.locale] ? this.props.explanatorynotes.notes.filter(note => note.key == layer.key)[0]['explanatory_note_'+this.props.language.locale] : this.props.explanatorynotes.notes.filter(note => note.key == layer.key)[0].explanatory_note)}</p>
                                                </div>
                                            </div>
                                        }
                                        <strong>{getTranslation(layer.key+".label")}<br />{(layer.legend.label[activeLanguage] ? layer.legend.label[activeLanguage] : (layer.legend.label.English ? layer.legend.label.English :'-'))}</strong>
                                       
                                        <p className="margin-top">{(layer.explanatory_text[activeLanguage] ? layer.explanatory_text[activeLanguage] : (layer.explanatory_text.English ? layer.explanatory_text.English :''))}</p>
                                    </td>
                                    {(this.props.report.traffic_light_maps.filter(map => map.is_open_loop_tlm === true).length > 0) &&
                                        <td className={"cell-with-border-bottom border-right "+(this.props.report.traffic_light_maps.length > 1 ? "text-center" : "text-right")}>
                                            {layer.traffic_light_map_open_loop !== 1 &&
                                            <span style={{backgroundColor : layer.traffic_light_map_open_loop}}></span>
                                            }
                                        </td>
                                    }
                                    {(this.props.report.traffic_light_maps.filter(map => map.is_closed_loop_tlm === true).length > 0) &&
                                        <td className={"cell-with-border-bottom border-right "+(this.props.report.traffic_light_maps.length > 1 ? "text-center" : "text-right")}>
                                            {layer.traffic_light_map_closed_loop !== 1 &&
                                            <span style={{backgroundColor : layer.traffic_light_map_closed_loop}}></span>
                                            }
                                        </td>
                                    }

                                </tr>
                            </Fragment>
                        )}
                        </Fragment>
                        }
                        </tbody>
                        </table>

                        </div>
                        </div>
                    }
                    {conflictlayers.length === 0 &&
                      <div className="reports-box">
                        <div className="reports-box-head">
                            <h3 className="text-left"><i className="fas fa-exclamation-circle"></i> <span ref={this.props.conflictsRef}>{getTranslation("report.conflict_layer")}:</span></h3>
                        </div>
                        <div className="reports-box-content" ref={this.props.tableRef}>
                            {!this.props.report.hasLoaded &&
                                <div className="loader"></div>
                            }
                            {this.props.report.hasLoaded &&
                                <p>{getTranslation("no.conflict.found")}</p>
                            }
                          
                        </div>
                      </div>
                    }

                        {this.props.report.non_conflict.length > 0 &&
                            <div className="attribute-table">


                            <div className="table-layer">
                            <h3 className="text-left"><i className="fas fa-plus-circle"></i> {getTranslation("report.non_conflict_layer")}</h3>
                            <table cellSpacing="0">
                            <tbody>
                            {this.props.report.non_conflict.map((layer, index) =>
                                <Fragment key={index}>
                                {layer.children.length === 0 &&
                                <tr>
                                    <td className="text-left">
                                    {((this.props.explanatorynotes.notes.length > 0) && (this.props.explanatorynotes.notes.filter(note => note.key == layer.key).length > 0)) &&
                                        <div className="explanatory">
                                            <button className="btn btn-blue" onClick={() => this.showNote(layer.key, index)}><i className="fas fa-info"></i></button>
                                            <div className={"explanatory-note " + ((this.state.showNote === layer.key && this.state.id === index) ? 'explanatory-note-show' : 'dont-show')}>
                                                <div className="ex-note-close" onClick={() => this.hideNote()}><i className="fas fa-times"></i></div>     
                                                <p>{(this.props.explanatorynotes.notes.filter(note => note.key == layer.key)[0]['explanatory_note_'+this.props.language.locale] ? this.props.explanatorynotes.notes.filter(note => note.key == layer.key)[0]['explanatory_note_'+this.props.language.locale] : this.props.explanatorynotes.notes.filter(note => note.key == layer.key)[0].explanatory_note)}</p>
                                            </div>
                                        </div>
                                    }
                                    {getTranslation(layer.key+".label")}
                                    </td>
                                    <td>{layer.value}</td>
                                </tr>
                                }

                                {layer.children.length > 0 &&
                                    <Fragment>
                                    <tr className="row-no-border">
                                    <td colSpan="3" className="text-left text-headline">{getTranslation(layer.name+".label")}</td>
                                    </tr>
                                    {layer.children.map((child, index) =>
                                        <tr key={index} className="child-attribute conflict-attribute">
                                            <td className="text-left flex-td">
                                            {((this.props.explanatorynotes.notes.length > 0) && (this.props.explanatorynotes.notes.filter(note => note.key == child.key).length > 0)) &&
                                                <div className="explanatory">
                                                    <button className="btn btn-blue" onClick={() => this.showNote(child.key, index)}><i className="fas fa-info"></i></button>
                                                    <div className={"explanatory-note " + ((this.state.showNote === child.key && this.state.id === index) ? 'explanatory-note-show' : 'dont-show')}>
                                                        <div className="ex-note-close" onClick={() => this.hideNote()}><i className="fas fa-times"></i></div>     
                                                        <p>{(this.props.explanatorynotes.notes.filter(note => note.key == child.key)[0]['explanatory_note_'+this.props.language.locale] ? this.props.explanatorynotes.notes.filter(note => note.key == child.key)[0]['explanatory_note_'+this.props.language.locale] : this.props.explanatorynotes.notes.filter(note => note.key == child.key)[0].explanatory_note)}</p>
                                                    </div>
                                                </div>
                                            }
                                            {child.short_description[this.props.activeLanguage] ? child.short_description[this.props.activeLanguage] : child.short_description.English}:<br/>
                                            {(child.legend ? (child.legend.label[activeLanguage] ? child.legend.label[activeLanguage] : (child.legend.label.English ? child.legend.label.English :'-')) : '')}
                                            </td>
                                            <td className="cell-with-border-bottom text-center">
                                                {child.category === "binary" &&
                                                    <i className={'fas '+(child.value == 1 ? 'fa-check' : 'fa-times')}></i>
                                                }
                                                {child.category !== "binary" && (child.value != '-9999' ? child.value : '-')} 
                                                {child.unit_of_cell_related_parameter !== 'none' && 
                                                    <React.Fragment>{" "+(child.value != '-9999' ? child.unit_of_cell_related_parameter : '')}</React.Fragment>
                                                }    
                                            </td>
                                        </tr>
                                    )}

                                    </Fragment>
                                }
                                </Fragment>
                            )}
                                </tbody>
                            </table>
                            </div>
                            </div>
                    }


                    </div>
                }




            </div>
        )
    }

}

export default AttributeTable
