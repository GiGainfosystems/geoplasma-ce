import React, { Component } from 'react'
import Keywords from './Keywords'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import getTranslation from '../../i18n/'
import './select.css'

/**
 * Filter for the knowledge platform and yellow pages + events section
 */
class Filter extends Component {

  constructor(props) {
    super(props);
    this.state = {
        tags: []
    }
  }

  /**
   * Toggle a filter
   * @param {} id 
   */
  toggleFilter(id) {
    this.props.toggleFilter(this.props.filter.id, id)
  }

  /**
   * Update the active tags
   * @param {} tags 
   */
  updateTags(tags) {
      this.props.keywordFilter(tags)
      this.setState({tags: tags})
  }


  render() {

         let options = this.props.filter.filter;

         options.sort(function(a, b) {
         var textA = a.label.toUpperCase();
         var textB = b.label.toUpperCase();
         return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
         });

         let value = 0;

        value = {id: 0, label: getTranslation("filterbox.filter.all"), active: false};
        this.props.filter.filter.map(single => {
            if(single.active) {
                value = single
            }
        })

        if(options.filter(option => option.id === 0).length !== 0) {
            let index = options.indexOf(options.filter(option => option.id === 0)[0]);
            options.splice(index, 1);
        }
        options.unshift({id: 0, label: getTranslation("filterbox.filter.all"), active: false})

     options = options.filter(function(item, pos) {
         return options.indexOf(item) == pos;
     })

    return(
      <div>

      {!this.props.filter.fullLayout &&
        <div>
        <label>{this.props.title}:</label>

        <div className="filterbox-content">
        {this.props.filter.filter.length > 12 &&
            <div>
            <Select
                searchable={false}
                name={"select-filter-"+this.props.filter.id}
                value={value}
                options={this.props.filter.filter}
                clearable={false}
                onChange={(value) => this.toggleFilter(value.id)}
              />
            </div>
        }
        {this.props.filter.filter.length <= 12 &&
            <div>
                <div>
                {this.props.filter.filter.map((filter, index) =>
                  <button key={index} className={"btn " + (filter.active ? "btn-green" : "btn-gray")} onClick={() => this.toggleFilter(filter.id)}>{getTranslation(filter.label)}</button>
                )}
                </div>
                <div>
                {this.props.filter.additionalFilter &&
                    <div>
                        <div className="form-group">
                            <label>{getTranslation("filter.tags")}:</label>
                            <Keywords tags={this.props.tags} activeTags={this.state.tags} updateTags={(tags) => this.updateTags(tags)} />
                        </div>

                    </div>
                }
                </div>
            </div>
        }

        </div>
        </div>
    }
    </div>
    )
  }
}




export default Filter
