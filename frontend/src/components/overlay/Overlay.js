import React, { Component } from 'react'
import './Overlay.css'

/**
 * The overlay containing e.g. the contactform
 */
class Overlay extends Component {

    render() {
        return(
            <div className="overlay">

                <div className="overlay-content">
                    {this.props.children}
                </div>

            </div>
        )
    }
}

export default Overlay;
