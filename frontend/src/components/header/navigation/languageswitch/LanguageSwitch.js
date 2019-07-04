import React, { Component } from 'react'
import './LanguageSwitch.css'

/**
 * Language selection menu in the header
 */
class LanguageSwitch extends Component {

  constructor(props) {
    super(props);
    this.state = { locale: this.props.language.locale, submenu: false}

  }

  /**
   * Show the available languages
   */
  toggleSubmenu() {
    this.setState({submenu: !this.state.submenu})
  }

  /**
   * Change the active language by dispatching the changeLanguage action with the selected language
   * @param {} language 
   */
  setLanguage(language) {
    this.props.changeLanguage(language.locale);
    this.setState({locale: language.locale, submenu: false})
  }

  render() {
    const activeLanguage = this.props.language.availableLanguages.filter(language => language.locale === this.state.locale)[0]
    const selectableLanguages = this.props.language.availableLanguages.filter(language => language.locale !== this.state.locale)

    return(
      <li className="language-switch">
        <div className="language-switch-toggle" onClick={() => this.toggleSubmenu()}>
          <img src={activeLanguage.language} alt={activeLanguage.title}/>
          <span className={(this.state.submenu ? 'turned' : 'not-turned')}></span>
        </div>

          <ul className={"language-switch-menu " + (this.state.submenu ? 'visible' : 'not-visible')}>
            {
              selectableLanguages.map((language) =>
                  <li className="select-language" key={language.title} onClick={() => this.setLanguage(language)}><img src={language.language} alt={language.title} />{language.title}</li>
              )
            }
          </ul>

      </li>
    )
  }

}

export default LanguageSwitch
