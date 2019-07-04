import React, { Component } from 'react'
import {
  ImageSideButton,
  Block,
  addNewBlock,
  createEditorState,
  Editor,
} from 'medium-draft';
import 'medium-draft/lib/index.css';
import CustomImageSideButton from './RteImages'
import { convertFromHTML } from 'draft-convert';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import {
  convertToRaw
} from 'draft-js';
import './Superuser.css'
import mediumDraftImporter from 'medium-draft/lib/importer';


class Rte extends React.Component {
  constructor(props) {
    super(props);

    this.sideButtons = [{
      title: 'Image',
      component: CustomImageSideButton,
    }];

//    this.state = {
//      editorState: createEditorState(), // for empty content
//    };

    const editorState = createEditorState(convertToRaw(mediumDraftImporter(props.content)));


    //let editorState = createEditorState(rawState);
    this.state = {
      editorState
    };


    this.onChange = (editorState) => {
        this.props.updateText(mediumDraftExporter(this.state.editorState.getCurrentContent()));
      this.setState({ editorState });
    };
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  render() {

    const { editorState } = this.state;
    return (
      <Editor
        ref="editor"
        editorState={editorState}
        onChange={this.onChange}
        sideButtons={this.sideButtons}
      />
    );
  }
};

export default Rte
