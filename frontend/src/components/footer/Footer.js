import React, { Component } from 'react'
import './Footer.css'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'

/**
 * The footer of the web-portal containing links to the imprint etc.
 */
class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = { buttonVisible: false }
    }

    /**
     * Scroll to the top of the page
     */
    toTop() {
        window.scrollTo(0,0);
    }

    /**
     * Show or hide the "Scroll to top" button, depending on the window position
     */
    toggleButton() {
        let buttonVisible = this.state.buttonVisible

        window.scrollY > 500?
        !buttonVisible && this.setState({buttonVisible:true})
        :
        buttonVisible && this.setState({buttonVisible:false})
    }

    componentDidMount(){
        window.addEventListener('scroll',() => this.toggleButton());
    }

  render() {
      let pages = this.props.pages.filter(page => page.navigation === 'footer')

      pages.map(page => {
        let localized_title = "title_"+this.props.activeLanguage
        page.title_local = page[localized_title]
    })
    return(
      <div className="footer">
      {this.state.buttonVisible &&
          <div className="jump-to-top">
            <button onClick={() => this.toTop()} className="btn btn-blue btn-transparent"><i className="fa fa-arrow-up" aria-hidden="true"></i> {getTranslation("jump.to.top")}</button>
          </div>
      }
        <ul>
            {pages.map(page =>
                <li key={page.id}><Link to={("/content/"+page.url)}>{(this.props.activeLanguage === "en" ? page.title : page.title_local ? page.title_local : page.title)}</Link></li>
            )}
        </ul>
      </div>
    )
  }

}

export default Footer
