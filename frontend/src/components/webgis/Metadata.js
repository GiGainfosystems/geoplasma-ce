import React, { Component } from 'react'
import getTranslation from '../../i18n/'
const Fragment = React.Fragment;

/**
 * The metadata popup window. The metadata for a layer is displayed here
 */
class Metadata extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullmetadata: false
        }
    }

    /**
     * Toggle the full metadata 
     */
    toggleFullMetadata() {
        this.setState({fullmetadata : !this.state.fullmetadata})
    }

    render() {
        return(
            <Fragment>
            {this.props.selected_layer.key !== undefined &&
                <div className={"webgis-metadata " + (this.state.fullmetadata ? "webgis-metadata-large" : "webgis-metadata-normal")}>
                    <h3>{getTranslation("webgis.metadata")} <button className="btn btn-gray" onClick={this.props.toggleMetadata}>{getTranslation("webgis.close_metadata")}</button></h3>
                    <table cellSpacing={0}>
                        <tr>
                            <td>{getTranslation("metadata.parameter")}:</td>
                            <td>{getTranslation(this.props.selected_layer.key+".label")}</td>
                        </tr>

                        {this.state.fullmetadata &&
                            <Fragment>
                                {this.props.selected_layer.variable_type_of_cell_related_parameter !== "none" &&
                                <tr>
                                    <td>{getTranslation("metadata.variable_type")}:</td>
                                    <td>{this.props.selected_layer.variable_type_of_cell_related_parameter}</td>
                                </tr>
                                }
                                {this.props.selected_layer.unit_of_cell_related_parameter !== "none" &&
                                <tr>
                                    <td>{getTranslation("metadata.cell_related")}:</td>
                                    <td>{this.props.selected_layer.unit_of_cell_related_parameter}</td>
                                </tr>
                                }
                                {this.props.selected_layer.object_related_parameter_1 !== "none" &&
                                    <Fragment>
                                    <tr>
                                        <td>{getTranslation("metadata.object_related")} 1:</td>
                                        <td>{this.props.selected_layer.object_related_parameter_1}</td>
                                    </tr>
                                    <tr>
                                        <td>{getTranslation("metadata.object_related_unit")} 1:</td>
                                        <td>{this.props.selected_layer.unit_of_object_related_parameter_1}</td>
                                    </tr>
                                    <tr>
                                        <td>{getTranslation("metadata.object_related_value")} 1:</td>
                                        <td>{this.props.selected_layer.value_of_object_related_parameter_1}</td>
                                    </tr>
                                    </Fragment>
                                }

                                {this.props.selected_layer.object_related_parameter_2 !== "none" &&
                                    <Fragment>
                                    <tr>
                                        <td>{getTranslation("metadata.object_related")} 2:</td>
                                        <td>{this.props.selected_layer.object_related_parameter_2}</td>
                                    </tr>
                                    <tr>
                                        <td>{getTranslation("metadata.object_related_unit")} 2:</td>
                                        <td>{this.props.selected_layer.unit_of_object_related_parameter_2}</td>
                                    </tr>
                                    <tr>
                                        <td>{getTranslation("metadata.object_related_value")} 2:</td>
                                        <td>{this.props.selected_layer.value_of_object_related_parameter_2}</td>
                                    </tr>
                                    </Fragment>
                                }
                                <tr>
                                    <td>{getTranslation("metadata.data_type")}:</td>
                                    <td>{this.props.selected_layer.data_type}</td>
                                </tr>
                                <tr>
                                    <td>{getTranslation("metadata.resource_format")}:</td>
                                    <td>{this.props.selected_layer.resource_format}</td>
                                </tr>
                                <tr>
                                    <td>{getTranslation("metadata.author")}:</td>
                                    <td>{this.props.selected_layer.author}</td>
                                </tr>
                                <tr>
                                    <td>{getTranslation("metadata.date")}:</td>
                                    <td>{this.props.selected_layer.date}</td>
                                </tr>
                                <tr>
                                    <td>{getTranslation("metadata.maintainer")}:</td>
                                    <td>{this.props.selected_layer.maintainer}</td>
                                </tr>
                                <tr>
                                    <td>{getTranslation("metadata.maintainer_email")}:</td>
                                    <td>{this.props.selected_layer.maintainer_e_mail}</td>
                                </tr>
                                <tr>
                                    <td>{getTranslation("metadata.reference_system")}:</td>
                                    <td>{this.props.selected_layer.reference_system}</td>
                                </tr>

                            </Fragment>
                        }

                        <tr>
                            <td>{getTranslation("metadata.description")}:</td>
                            <td>{(this.props.selected_layer.short_description[this.props.activeLanguage] ? this.props.selected_layer.short_description[this.props.activeLanguage] : this.props.selected_layer.short_description.English)}</td>
                        </tr>
                        <tr>
                            <td>{getTranslation("metadata.inspire")}:</td>
                            <td><a href={this.props.selected_layer.inspire.hyperlink_inspire}>{this.props.selected_layer.inspire.category_inspire}</a></td>
                        </tr>



                    </table>
                    <button className="btn btn-green" onClick={() => this.toggleFullMetadata()}>{getTranslation("metadata.toggle")}</button>
                </div>
            }
            </Fragment>
        )
    }

}

export default Metadata
