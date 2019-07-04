import React, { Component } from 'react'
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest';
import 'react-tagsinput/react-tagsinput.css'
import './Keywords.css';

/**
 * The tags input field
 */
class Keywords extends Component {

  constructor(props) {
    super(props)
    this.state = { keywords: this.props.tags, tags: this.props.activeTags }
  }

  /**
   * Update the tags on change
   * @param {*} tags 
   */
  handleChange(tags) {
      let active_tags = this.state.tags;
      if((tags.length < active_tags.length) || (tags.length < 6)) {
          this.setState({tags})
          this.props.updateTags(tags);
      }
  }

  componentWillReceiveProps(nextProps) {

      if(nextProps.tags) {
        this.setState({keywords: nextProps.tags, tags: nextProps.activeTags});
      }
  }

  render() {

    let autocompleteRenderInput = ({addTag, ...props}) => {
      const handleOnChange = (e, {newValue, method}) => {
        if (method === 'enter') {
          e.preventDefault()
        } else {
          props.onChange(e)
        }
      }

      const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
      const inputLength = inputValue.length

      let suggestions = this.state.keywords.filter((keyword) => {
        return keyword.tag.toLowerCase().slice(0, inputLength) === inputValue
      })

      return (
          <Autosuggest
            ref={props.ref}
            suggestions={suggestions}
            shouldRenderSuggestions={(value) => value && value.trim().length > 0}
            getSuggestionValue={(suggestion) => suggestion.tag}
            renderSuggestion={(suggestion) => <span>{suggestion.tag}</span>}
            inputProps={{...props, onChange: handleOnChange}}
            onSuggestionSelected={(e, {suggestion}) => {
              addTag(suggestion.tag)
            }}
            onSuggestionsClearRequested={() => {}}
            onSuggestionsFetchRequested={() => {}}
          />
        )
      }

      return <TagsInput inputProps={{placeholder: ''}} renderInput={autocompleteRenderInput} value={this.state.tags} onChange={(tags) => this.handleChange(tags)} />

  }
}

export default Keywords
