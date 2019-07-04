import React, { Component } from 'react';
import './App.css';

// Import child components
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Subheader from './components/subheader/Subheader'
import CategorieTileContainer from './containers/CategorieTileContainer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container container-small">
          <Subheader language={this.props.language} title="subheader.home" />
          <CategorieTileContainer language={this.props.language} />
          <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>

      </div>
    );
  }
}

export default App;
