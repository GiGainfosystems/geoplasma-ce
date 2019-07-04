import React from 'react'
import getTranslation from '../../../../i18n/'
import InfoPaneMap from './InfoPaneMap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

/**
 * The pilot area info pane that appears when getting to a local web gis
 * or can be toggled via the menu
 */
class PilotAreaInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Hide the info pane
     */
    hidePane() {
        cookies.set(this.props.activeArea.uri, false);
        this.props.hidePane();
    }

    render() {
        const description = 'description_'+this.props.activeLanguage
        return(
            <div className={"info-pane report-pane "+(this.props.show? 'show-pane' : 'hide-pane')}>
            <button className="close-pane" onClick={() => this.hidePane()}><i className="far fa-times-circle"></i></button>
                <h3>{getTranslation(this.props.activeArea.name)}</h3>
                {this.props.bounds.length > 0 &&
                    <InfoPaneMap bounds={this.props.bounds} />
                }
                <div className="info-pane-padding" dangerouslySetInnerHTML={{__html: (this.props.activeArea[description] ? this.props.activeArea[description] : this.props.activeArea.description_en)}}>

                </div>
            </div>
        )
    }
}

export default PilotAreaInfo;