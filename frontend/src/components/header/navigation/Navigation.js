import React, { Component } from 'react'
import './Navigation.css'
import { Link } from 'react-router-dom'
import getTranslation from '../../../i18n'

// Import subcomponents
import LanguageSwitchContainer from '../../../containers/LanguageSwitchContainer'

/**
 * The navigation on the left side of the header
 */
class Navigation extends Component {

  render() {
      return(
        <div className="header-navigation">
            {this.props.title &&
                <Link to="/"><h1>{this.props.title}</h1></Link>
            }
            {!this.props.title &&
                <Link to="/experts"><h1><i className="fa fa-book" aria-hidden="true"></i>{getTranslation("navigation.knowledge_platform")}</h1></Link>
            }

          <ul>
            <LanguageSwitchContainer />
            <Link to="/"><li><i className="fa fa-home" aria-hidden="true"></i></li></Link>
            <Link to="/experts"><li><i className="fa fa-book" aria-hidden="true"></i></li></Link>
          </ul>
        </div>
      )
  }

}

export default Navigation
