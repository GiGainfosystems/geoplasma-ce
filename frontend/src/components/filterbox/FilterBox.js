import React, { Component } from 'react'
import './FilterBox.css'
import Filter from './Filter'
import getTranslation from '../../i18n/'

/**
 * Display the available filters
 */
class FilterBox extends Component {

  constructor(props) {
    super(props);
    this.state = { expanded: false, height: 0 };

  }

  /**
   * Show full filter box
   */
  expand() {
    let height;
    if(this.state.expanded) {
      height = 0;
    }
    else {
      height = document.getElementById('expandable').scrollHeight;
    }
    this.setState({ expanded: !this.state.expanded, height: height })

  }

  /**
   * On window resize, resize the filter box
   */
  updateDimensions() {
    if(this.state.expanded) {
        this.setState({ height: document.getElementById('expandable').scrollHeight});
    }
  }

  render() {

    window.addEventListener("resize", () => this.updateDimensions());
    return(
      <div>
        <div className="default-element default-element-dark filterbox">
          <h3 onClick={() => this.expand()}>{this.props.title}<span className={(this.state.expanded ? 'expanded-arrow' : 'not-expanded-arrow')}>{getTranslation("filterbox.button")}</span></h3>
          <div id="expandable" className={"default-element-cont ent container-flex filter-list " + (this.state.expanded ? "expanded" : "not-expanded")} style={{height: this.state.height+"px"}}>
            {this.props.filters.map((filter, index) =>
              <div style={{padding: '15px'}} key={index} className={(filter.fullLayout ? "full" : "half")}>
                <Filter keywordFilter={this.props.keywordFilter} tags={this.props.tags} title={filter.title} single={filter.single} filter={filter} toggleFilter={this.props.toggleFilter} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default FilterBox
